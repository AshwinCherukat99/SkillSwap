from rest_framework import serializers
from .models import (Conversation,ConversationMember,Message)

class MentorGroupSerializer(serializers.ModelSerializer):
    course_title=serializers.CharField(
        source='course.title',
        read_only=True
    )
    member_count=serializers.SerializerMethodField()
    class Meta:
        model=Conversation
        fields=[
            'id',
            'name',
            'course',
            'course_title',
            'member_count',
            'updated_at',
        ]
    def get_member_count(self,obj):
        return obj.members.filter(
            is_active=True
        ).count()

class ChatMessageSerializer(serializers.ModelSerializer):
    sender=serializers.SerializerMethodField()
    class Meta:
        model=Message 
        fields=[
            'id',
            'content',
            'sender',
            'created_at',
        ]
    def get_sender(self,obj):
        if obj.sender_mentor:
            return {
                'id':obj.sender_mentor.id,
                'username':obj.sender_mentor.username,
                'type':'MENTOR'
            }
        if obj.sender_user:
            return {
                'id':obj.sender_user.id,
                'username':obj.sender_user.username,
                'type':'USER'
            }
        return None

class ConversationMemberSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField()
    role=serializers.SerializerMethodField()
    class Meta:
        model=ConversationMember
        fields=[
            'id',
            'name',
            'role',
            'is_active',
            'joined_at',
        ]
    def get_name(self,obj):
        if obj.mentor:
            return obj.mentor.username
        if obj.user:
            return obj.user.username
        return "Unknown"      
    def get_role(self,obj):
        if obj.mentor:
            return 'MENTOR'
        if obj.user:
            return 'USER'
        return 'UNKNOWN'