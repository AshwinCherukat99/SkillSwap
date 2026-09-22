from rest_framework import serializers
from ..models import CourseEnrollment

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
                    obj.user.proifle_image.url
                )
            return obj.user.profile_iamge.url
        return None
