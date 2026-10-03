from rest_framework import serializers

from ..models import SkillExchangeSession,CourseSession

class AdminSkillExchangeSessionSerializer(serializers.ModelSerializer):
    session_id=serializers.SerializerMethodField()
    session_type=serializers.SerializerMethodField()
    recipient=serializers.SerializerMethodField()
    receiver=serializers.SerializerMethodField()
    skill=serializers.SerializerMethodField()
    rating=serializers.SerializerMethodField()
    class Meta:
        model=SkillExchangeSession
        fields=[
            'id',
            'session_id',
            'session_type',
            'recipient',
            'receiver',
            'skill',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'rejection_reason',
            'cancellation_reason',
            'rating',
            'created_at',
            'updated_at',
        ]
    def get_session_id(self,obj):
        return f'SS-{obj.id:05d}'
    def get_session_type(self,obj):
        return 'SKILL_EXCHANGE'
    def get_recipient(self,obj):
        user=obj.recipient
        return {
            'id':user.id,
            'name':getattr(user,'full_name',None) or user.username,
            'username':user.username,
            'profile_image':(
                self.context['request'].build_absolute_uri(
                    user.profile_image.url
                )
                if getattr(user,'profile_image',None)
                else None
            )
        }
    def get_requester(self,obj):
        user=obj.requester
        return {
            'id':user.id,
            'name':getattr(user,'full_name',None) or user.username,
            'username':user.username,
            'profile_image':(
                self.context['request'].build_absolute_uri(
                    user.profile_image.url
                )
                if getattr(user,'profile_image',None)
                else None
            )
        }
    def get_skill(self,obj):
        return obj.skill_wanted.name
    def get_rating(self,obj):
        return None

class AdminCourseSessionSerializer(serializers.ModelSerializer):
    session_id=serializers.SerializerMethodField()
    session_type=serializers.SerializerMethodField()
    mentor=serializers.SerializerMethodField()
    learner=serializers.SerializerMethodField()
    course=serializers.SerializerMethodField()
    rating=serializers.SerializerMethodField()
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'session_id',
            'session_type',
            'mentor',
            'learner',
            'course',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'cancellation_reason',
            'rating',
            'created_at',
            'updated_at',
            'completed_at',
            'cancelled_at',
        ]
    def get_session_id(self,obj):
        return f'CS-{obj.id:05d}'
    def get_session_type(self,obj):
        return 'COURSE'
    def get_mentor(self,obj):
        mentor=obj.mentor
        return {
            'id':mentor.id,
            'name':mentor.full_name or mentor.username,
            'username':mentor.username,
            'profile_image':(
                self.context['request'].build_absolute_uri(
                    mentor.profile_image.url
                )  
                if mentor.profile_image
                else None
            )
        }
    def get_learner(self,obj):
        user=obj.enrollment.user
        return {
            'id':user.id,
            'name':getattr(user,'full_name',None) or user.username,
            'username':user.username,
            'profile_image':(
                self.context['request'].build_absolute_uri(
                    user.profile_image.url
                )
                if getattr(user,'profile_image',None) else None
            )
        }