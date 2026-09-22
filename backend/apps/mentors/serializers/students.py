from rest_framework import serializers

from apps.courses.models import CourseEnrollment

class MentorStudentSerializer(serializers.ModelSerializer):
    student_id=serializers.IntegerField(
        source='user.id',
        read_only=True
    )
    full_name=serializers.SerializerMethodField()
    username=serializers.CharField(
        source='user.username',
        read_only=True
    )
    profile_image=serializers.SerializerMethodField()
    course_id=serializers.IntegerField(
        source='course.id',
        read_only=True
    )
    course_title=serializers.CharField(
        source='course.title',
        read_only=True
    )
    class Meta:
        model=CourseEnrollment
        fields=[
            'student_id',
            'full_name',
            'username',
            'profile_image',
            'course_id',
            'course_title',
            'progress',
            'enrolled_at',
            'completed_at',
        ]
        read_only_fields=fields
    def get_full_name(self,obj):
        user=obj.user
        return (
            user.full_name or user.get_full_name() or user.username
        )
    def get_profile_image(self,obj):
        user=obj.user
        if not user.profile_image:
            return None
        request=self.context.get('request')
        if request:
            return request.build_absolute_uri(user.profile_image.url)
        return user.profile_image.url