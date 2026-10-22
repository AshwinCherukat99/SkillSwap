from rest_framework import serializers
from ..models import CourseEnrollment,CourseLesson,CourseModule

class MentorStudentSerializer(serializers.ModelSerializer):
    student_id=serializers.IntegerField(
        source='user.id',
        read_only=True
    )
    username=serializers.CharField(
        source='user.username',
        read_only=True
    )
    full_name=serializers.SerializerMethodField()
    email=serializers.EmailField(
        source='user.email',
        read_only=True
    )
    course_id=serializers.IntegerField(
        source='course.id',
        read_only=True
    )
    course_title=serializers.CharField(
        source='course.title',
        read_only=True
    )
    profile_image=serializers.SerializerMethodField()
    class Meta:
        model=CourseEnrollment
        fields=[
           'id',
           'student_id',
           'username',
           'full_name',
           'email',
           'profile_image',
           'course_id',
           'course_title',
           'progress',
           'enrolled_at', 
           'completed_at'
        ]
    def get_full_name(self,obj):
        user=obj.user
        full_name=user.get_full_name()
        return full_name or user.username
    def get_profile_image(self,obj):
        if obj.user.profile_image:
            request=self.context.get('request')
            if request:
                return request.build_absolute_uri(
                    obj.user.profile_image.url
                )
            return obj.user.profile_image.url
        return None

class MentorStudentDetailSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    username=serializers.CharField()
    email=serializers.EmailField()
    full_name=serializers.SerializerMethodField()
    bio=serializers.CharField(
        allow_blank=True
    )
    location=serializers.CharField(
        allow_blank=True
    )
    profile_image=serializers.SerializerMethodField()
    phone_number=serializers.CharField(
        allow_null=True,
        allow_blank=True,
        required=False
    )
    def get_full_name(self,obj):
        return (
            getattr(obj,'full_name','')
            or obj.get_full_name() or obj.username
        )
    def get_profile_image(self,obj):
        if not obj.profile_image:
            return None
        request=self.context.get('request')
        image_url=obj.profile_image.url
        if request:
            return request.build_absolute_uri(image_url)
        return image_url

class MentorLessonProgressSerializer(serializers.ModelSerializer):
    is_unlocked=serializers.SerializerMethodField()
    is_completed=serializers.SerializerMethodField()
    unlocked_at=serializers.SerializerMethodField()
    completed_at=serializers.SerializerMethodField()
    class Meta:
        model=CourseLesson
        fields=[
            'id',
            'title',
            'order',
            'is_unlocked',
            'is_completed',
            'unlocked_at',
            'completed_at',
        ]
    def get_progress(self,obj):
        progress_map=self.context.get('progress_map',{})
        return progress_map.get(obj.id)
    def get_is_unlocked(self,obj):
        progress=self.get_progress(obj)
        return progress.is_unlocked if progress else False
    def get_is_completed(self,obj):
        progress=self.get_progress(obj)
        return progress.is_completed if progress else False
    def get_unlocked_at(self,obj):
        progress=self.get_progress(obj) 
        return progress.unlocked_at if progress else None
    def get_completed_at(self,obj):
        progress=self.get_progress(obj)
        return progress.completed_at if progress else None 

class MentorEnrollmentProfileSerializer(serializers.ModelSerializer):
    student=serializers.SerializerMethodField()
    course=serializers.SerializerMethodField()
    modules=serializers.SerializerMethodField()
    class Meta:
        model=CourseEnrollment
        fields=[
            'id',
            'enrolled_at',
            'completed_at',
            'progress',
            'student',
            'course',
            'modules',
        ]
    def get_student(self,obj):
        return MentorStudentDetailSerializer(
            obj.user,
            context=self.context,
        ).data
    def get_course(self,obj):
        course=obj.course
        total_lessons=CourseLesson.objects.filter(
            module__course=course
        ).count()
        completed_lessons=obj.lesson_progress.filter(
            is_completed=True,
            lesson__module__course=course
        ).count()
        return {
            'id':course.id,
            'title':course.title,
            'description':course.description,
            'level':course.level,
            'module_count':course.modules.count(),
            'total_lessons':total_lessons,
            'completed_lessons':completed_lessons,
        }
    def get_modules(self,obj):
        modules=obj.course.modules.prefetch_related(
            'lessons'
        ).all()
        progress_map={
            progress.lesson_id:progress
            for progress in obj.lesson_progress.filter(
                lesson__module__course=obj.course
            )
        }
        context={
            **self.context,
            'progress_map':progress_map
        }
        return MentorCourseModuleWithProgressSerializer(
            modules,
            many=True,
            context=context
        ).data

class MentorCourseModuleWithProgressSerializer(serializers.ModelSerializer):
    lessons=MentorLessonProgressSerializer(
        many=True,
        read_only=True,
    )
    class Meta:
        model=CourseModule
        fields=[
            'id',
            'title',
            'description',
            'order',
            'lessons'
        ]