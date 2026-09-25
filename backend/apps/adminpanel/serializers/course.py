from rest_framework import serializers
from apps.courses.models import Course,CourseModule,CourseLesson
from apps.accounts.models import User            

class AdminCourseListSerializer(serializers.ModelSerializer):
    mentor_name=serializers.CharField(
        source='mentor.full_name',
        read_only=True,
    )
    mentor_username=serializers.CharField(
        source='mentor.usernam',
        read_only=True,
    )
    category_name=serializers.CharField(
        source='category.name',
        read_only=True,
    )
    modules_count=serializers.SerializerMethodField()
    lessons_count=serializers.SerializerMethodField()
    enrollments_count=serializers.SerializerMethodField()
    class Meta:
        model=Course
        fields=[
            'id',
            'title',
            'slug',
            'description',
            'thumbnail',
            'lessons_count',
            'modules_count',
            'enrollments_count',
            'mentor_name',
            'mentor_username',
            'category',
            'category_name',
            'level',
            'price',
            'status',
            'is_active',
            'created_at',
            'updated_at',
            'published_at',
        ]
    def get_modules_count(self,obj):
        return obj.modules.count()
    def get_lessons_count(self,obj):
        return CourseLesson.objects.filter(module__course=obj).count()
    def get_enrollments_count(self,obj):
        return obj.enrollments.count()

class AdminCourseLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseLesson
        fields=[
            'id',
            'title',
            'content',
            'order',
        ]

class AdminCourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseModule
        fields=[
            'id',
            'title',
            'description',
            'order',
            'lessons',
        ]

class AdminCourseDetailSerializer(serializers.ModelSerializer):
    mentor_name=serializers.CharField(
        source='mentor.full_name',
        read_only=True,
    )
    mentor_username=serializers.CharField(
        source='mentor.username',
        read_only=True,
    )
    category_name=serializers.CharField(
        source='category.name',
        read_only=True,
    )
    modules=AdminCourseModuleSerializer(
        many=True,
        read_only=True,
    )
    modules_count=serializers.SerializerMethodField()
    lessons_count=serializers.SerializerMethodField()
    enrollments_count=serializers.SerializerMethodField()
    class Meta:
        model=Course
        fields=[
            'id',
            'title',
            'slug',
            'description',
            'thumbnail',
            'mentor_name',
            'mentor_username',
            'category',
            'category_name',
            'level',
            'price',
            'estimated_duration',
            'status',
            'is_active',
            'modules',
            'modules_count',
            'lessons_count',
            'enrollments_count',
            'created_at',
            'updated_at',
            'published_at',
        ]
    def get_modules_count(self,obj):
        return obj.modules.count()
    def get_lessons_count(self,obj):
        return CourseLesson.objects.filter(
            module__course=obj
        ).count()
    def get_enrollments_count(self,obj):
        return obj.enrollments.count()

class AdminCourseRejectSerializer(serializers.Serializer):
    reason=serializers.CharField(
        required=True,
        allow_blank=False,
    )