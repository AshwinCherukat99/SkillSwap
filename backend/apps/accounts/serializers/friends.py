from rest_framework import serializers
from ..models import User
from apps.skills.models import UserSkill

class FriendSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField()
    profile_image=serializers.SerializerMethodField()
    is_online=serializers.SerializerMethodField()
    skills=serializers.SerializerMethodField()
    friends_since=serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=[
            'id',
            'name',
            'username',
            'profile_image',
            'is_online',
            'skills',
            'friends_since',
        ]
    def get_name(self,obj):
        return obj.username
    def get_profile_image(self,obj):
        if not obj.profile_image:
            return None
        request=self.context.get('request')
        if request:
            return request.build_absolute_uri(
                obj.profile_image.url
            )
        return obj.profile_image.url
    def get_is_online(self,obj):
        return False
    def get_skills(self,obj):
        user_skills=UserSkill.objects.filter(
            user=obj,
        ).select_related('skill')
        return [
            {
                'id':user_skill.skill.id,
                'name':user_skill.skill.name,
            } for user_skill in user_skills
        ]
    def get_friends_since(self,obj):
        request=self.context.get('request')
        if not request:
            return None
        friendship=obj.sent_friend_requests.filter(
            reciever=request.user,
            status='ACCEPTED',
        ).first()
        if not friendship:
            friendship=obj.received_friend_requests.filter(
                sender=request.user,
                status='ACCEPTED',
            ).first()
        if friendship:
            return friendship.accepted_at
        return None