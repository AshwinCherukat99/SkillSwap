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
        ).select_related('user','mentor','mentor__user')
        current_mentor=getattr(
            current_user,
            'mentor_profile',
            None
        )
        for member in members:
            if member.user_id is not None:
                if member.user_id==current_user.id:
                    continue
                person=member.user
                image=person.profile_image
                return {
                    'id':person.id,
                    'name':person.full_name or person.username,
                    'full_name':person.full_name or person.username,
                    'username':person.username,
                    'type':'USER',
                    'profile_image':(
                        request.build_absolute_uri(
                            image.url
                        )
                        if image else None
                    )
                }
            if member.mentor_id is not None:
                if (current_mentor and member.mentor_id==current_mentor.id):
                    continue
                person=member.mentor
                username=getattr(person,'username','') or ''
                full_name=(getattr(person,'full_name',None) or username)
                image = (
                getattr(person, 'profile_image', None)
                or getattr(person, 'avatar', None)
            )
                return {
                    'id':person.id,
                    'name':full_name,
                    'username':username,
                    'type':'MENTOR',
                    'avatar':request.build_absolute_uri(
                        image.url
                    )
                    if image else None
                }
        return None