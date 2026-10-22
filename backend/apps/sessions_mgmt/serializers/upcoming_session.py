from rest_framework import serializers

from apps.chat.models import Conversation
from ..models import SkillExchangeSession,CourseSession

class UpcomingSkillExchangeSerializer(serializers.ModelSerializer):
    type=serializers.SerializerMethodField()
    title=serializers.SerializerMethodField()
    person_name=serializers.SerializerMethodField()
    conversation_id=serializers.SerializerMethodField()
    class Meta:
        model=SkillExchangeSession
        fields=[
            'id',
            'type',
            'title',
            'person_name',
            'skill_wanted',
            'skill_offered',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'conversation_id',
        ]
    def get_type(self,obj):
        return 'SKILL_EXCHANGE'
    def get_title(self,obj):
        return (
            f'{obj.skill_wanted.name}<->'
            f'{obj.skill_offered.name}'
        )
    def get_person_name(self,obj):
        request=self.context['request']
        if obj.requester_id==request.user.id:
            return obj.recipient.username
        return obj.requester.username
    def get_conversation_id(self, obj):
        try:
            return obj.video_conversation.id
        except Conversation.DoesNotExist:
            return None

class UpcomingCourseSessionSerializer(serializers.ModelSerializer):
    type=serializers.SerializerMethodField()
    title=serializers.SerializerMethodField()
    person_name=serializers.SerializerMethodField()
    conversation_id=serializers.SerializerMethodField()
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'type',
            'title',
            'person_name',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'conversation_id',
        ]
    def get_type(self,obj):
        return 'MENTOR'
    def get_title(self,obj):
        return obj.enrollment.course.title 
    def get_person_name(self,obj):
        return (obj.mentor.full_name or obj.mentor.username)
    def get_conversation_id(self,obj):
        try:
            return obj.video_conversation.id
        except Conversation.DoesNotExist:
            return None

class MentorUpcomingSessionSerializer(serializers.ModelSerializer):
    title=serializers.CharField(
        source='enrollment.course.title',
        read_only=True,
    )
    student_name=serializers.SerializerMethodField()
    student_username=serializers.CharField(
        source='enrollment.user.username',
        read_only=True,
    )
    course_name=serializers.CharField(
        source='enrollment.course.title',
        read_only=True,
    )
    conversation_id=serializers.SerializerMethodField()
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'title',
            'student_name',
            'student_username',
            'course_name',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'conversation_id',
        ]
        read_only_fields=fields
    def get_student_name(self,obj):
        user=obj.enrollment.user
        return (
            user.get_full_name() 
            or user.username
        )
    def get_conversation_id(self,obj):
        try:
            return obj.video_conversation.id
        except Conversation.DoesNotExist:
            return None