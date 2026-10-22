from rest_framework import serializers
from .models import (Conversation,ConversationMember,Message,MessageAttachment)

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

class MessageAttachmentSerializer(serializers.ModelSerializer):
    file_url=serializers.SerializerMethodField()
    class Meta:
        model=MessageAttachment
        fields=[
            'id',
            'file',
            'file_url',
            'original_name',
            'file_size',
            'uploaded_at',
        ]
        read_only_fields=[
            'id',
            'file_url',
            'original_name',
            'file_size',
            'uploaded_at',
        ]
    def get_file_url(self,obj):
        request=self.context.get('request')
        if not obj.file:
            return None
        url=obj.file.url
        return request.build_absolute_uri(url) if request else url

class ChatMessageSerializer(serializers.ModelSerializer):
    sender=serializers.SerializerMethodField()
    attachments=MessageAttachmentSerializer(many=True,read_only=True)
    class Meta:
        model=Message 
        fields=[
            'id',
            'content',
            'sender',
            'created_at',
            'attachments'
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

class ConversationSerializer(serializers.ModelSerializer):
    last_message=serializers.SerializerMethodField()
    member_count=serializers.SerializerMethodField()
    person=serializers.SerializerMethodField()
    class Meta:
        model=Conversation
        fields=[
            'id',
            'conversation_type',
            'course',
            'name',
            'created_at',
            'updated_at',
            'last_message',
            'member_count',
            'person',
        ]
    def get_last_message(self,obj):
        message=(obj.messages.select_related('sender_user','sender_mentor').order_by('-created_at').first())
        if not message:
            return None
        return ChatMessageSerializer(
            message,
            context=self.context
        ).data
    def get_member_count(self,obj):
        return obj.members.filter(is_active=True).count()
    def get_person(self,obj):
        request=self.context.get('request')
        current_user=request.user
        members=obj.members.filter(
            is_active=True
        ).select_related('user','mentor')
        mentor_profile=getattr(
            current_user,'mentor_profile',None
        )
        current_mentor_id=getattr(
            current_user,'id',None
        )
        for member in members:
            if member.user_id is not None:
                if member.user_id==current_user.id:
                    continue
                person=member.user
                return {
                    'id':person.id,
                    'name':person.full_name or person.username,
                    'username':person.username,
                    'type':'USER',
                    'avatar':(
                        request.build_absolute_uri(
                            person.profile_image.url
                        )
                        if person.profile_image else None
                    )
                }
            if member.mentor_id is not None:
                if (mentor_profile and member.mentor_id==mentor_profile.id):
                    continue
                if (not mentor_profile and member.mentor_id==current_mentor_id):
                    continue
                person=member.mentor
                return {
                    'id':person.id,
                    'name':person.full_name or person.username,
                    'username':getattr(person,'username',''),
                    'type':'MENTOR',
                    'avatar':request.build_absolute_uri(
                        person.profile_image.url
                    )
                    if person.profile_image else None
                }
        return None