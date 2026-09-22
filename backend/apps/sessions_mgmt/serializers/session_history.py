from rest_framework import serializers

from ..models import CourseSession,SkillExchangeSession

class SkillExchangeSessionHistorySerializer(serializers.ModelSerializer):
    title=serializers.SerializerMethodField()
    person=serializers.SerializerMethodField()
    description=serializers.SerializerMethodField()
    skill_wanted=serializers.CharField(source='skill_wanted.name')
    skill_offered=serializers.CharField(source='skill_offered.name')
    class Meta:
        model=SkillExchangeSession
        fields=[
            'id',
            'title',
            'person_name',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'description',
            'skill_wanted',
            'skill_offered',
            'created_at',
        ]
    def get_title(self,obj):
        return (
            f'{obj.skill_wanted.name}-'
            f'{obj.skill_offered.name}'
        )
    def get_person_name(self,obj):
        request=self.context.get('request')
        if obj.requester_id==request.user.id:
            return obj.recipient.username
        return obj.requester.username
    def get_description(self,obj):
        return obj.message

class CourseSessionHistorySerializer(serializers.ModelSerializer):
    title=serializers.SerializerMethodField()
    person_name=serializers.SerializerMethodField()
    description=serializers.SerializerMethodField()
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'title',
            'person_name',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'description',
            'created_at',
        ]
    def get_title(self,obj):
        return obj.enrollment.course.title
    def get_person_name(self,obj):
        return (obj.mentor.full_name or obj.mentor.username)
    def get_description(self,obj):
        return obj.message

class MentorCourseSessionHistorySerializer(serializers.ModelSerializer):
    title=serializers.SerializerMethodField()
    person_name=serializers.SerializerMethodField()
    person_username=serializers.SerializerMethodField()
    description=serializers.SerializerMethodField()
    requested_by=serializers.SerializerMethodField()
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'title',
            'person_name',
            'person_username',
            'scheduled_start',
            'duration_minutes',
            'status',
            'message',
            'description',
            'requested_by',
            'created_at',
        ]
    def get_title(self,obj):
        return obj.enrollment.course.title
    def get_person_name(self,obj):
        student=obj.enrollment.user
        return (
            student.get_full_name() or student.username
        )
    def get_person_username(self,obj):
        return obj.enrollment.user.username
    def get_description(self,obj):
        return obj.message
    def get_requested_by(self,obj):
        return obj.requested_by