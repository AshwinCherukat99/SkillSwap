from rest_framework import serializers

from ..models import Course,CourseModule,CourseLesson

class MentorCourseSerializer(serializers.ModelSerializer):
    enrollment_count=serializers.SerializerMethodField()
    lesson_count=serializers.SerializerMethodField()
    class Meta:
        model=Course
        fields=[
            'id',
            'title',
            'slug',
            'description',
            'thumbnail',
            'category',
            'level',
            'price',
            'estimated_duration',
            'status',
            'is_active',
            'created_at',
            'updated_at',
            'published_at',
            'enrollment_count',
            'lesson_count',
        ]
    def get_enrollment_count(self,obj):
        return obj.enrollments.count()
    def get_lesson_count(self,obj):
        return sum(
            module.lessons.count()
            for module in obj.modules.all()
        )

class MentorCourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Course
        fields=[
            'title',
            'slug',
            'description',
            'thumbnail',
            'category',
            'level',
            'price',
            'estimated_duration',
        ]
    def validate_price(self,value):
        if value<0:
            raise serializers.ValidationError('price cannot be negative')
        return value
    def validate_estimated_duration(self,value):
        if value<=0:
            raise serializers.ValidationError('estimated duration must be greater than zero')
        return value

class MentorCourseLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseLesson
        fields=[
            'id',
            'title',
            'content',
            'order',
            'created_at',
            'updated_at',
        ]

class MentorCourseModuleSerializer(serializers.ModelSerializer):
    lessons=MentorCourseLessonSerializer(
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
            'lessons',
            'created_at',
            'updated_at',
        ]

class MentorCourseDetailSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(
        source='category.name',
        read_only=True,
    )
    mentor_name=serializers.SerializerMethodField()
    modules=MentorCourseModuleSerializer(
        many=True,
        read_only=True,
    )
    thumbnail_url=serializers.SerializerMethodField()
    class Meta:
        model=Course
        fields=[
            'id',
            'title',
            'slug',
            'description',
            'thumbnail_url',
            'category',
            'category_name',
            'level',
            'price',
            'estimated_duration',
            'status',
            'is_active',
            'created_at',
            'updated_at',
            'published_at',
            'mentor_name',
            'modules',
        ]
    def get_mentor_name(self,obj):
        return obj.mentor.full_name or obj.mentor.username
    def get_thumbnail_url(self,obj):
        if not obj.thumbnail:
            return None
        request=self.context.get('request')
        return request.build_absolute_uri(
            obj.thumbnail.url
        )