from rest_framework import serializers
from ..models import User,Friendship
from apps.skills.models import UserSkill
from django.db.models import Q
from django.utils import timezone

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
            receiver=request.user,
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

class AddFriendSerializer(serializers.ModelSerializer):
    receiver_id=serializers.IntegerField(
        write_only=True
    )
    class Meta:
        model=Friendship
        fields=['receiver_id']
    def validate_receiver_id(self,value):
        request=self.context['request']
        sender=request.user
        if sender.id==value:
            raise serializers.ValidationError('you cannot send a friend request to yourself')
        try:
            receiver=User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('user not found')
        existing_friendship=Friendship.objects.filter(
            Q(sender=sender,receiver=receiver)|
            Q(sender=receiver,receiver=sender)
        ).first()
        if existing_friendship:
            if existing_friendship.status==Friendship.Status.ACCEPTED:
                raise serializers.ValidationError('you are already friends with this user')
            if existing_friendship.status==Friendship.Status.PENDING:
                if existing_friendship.sender==sender:
                    raise serializers.ValidationError('friend request already sent')
            else:
                raise serializers.ValidationError('this user has already sent you a friend request')
            if existing_friendship.status==Friendship.Status.REJECTED:
                return value
        return value
    def create(self,validated_data):
        sender=self.context['request'].user
        receiver=User.objects.get(
            id=validated_data['receiver_id']
        )
        friendship=Friendship.objects.filter(
            sender=sender,
            receiver=receiver
        ).first()
        if friendship:
            friendship.status=Friendship.Status.PENDING
            friendship.accepted_at=None
            friendship.created_at=timezone.now()
            friendship.save(
                update_fields=[
                    'status',
                    'accepted_at',
                    'created_at',
                ]
            )
            return friendship
        return Friendship.objects.create(
            sender=sender,
            receiver=receiver,
            status=Friendship.Status.PENDING,
        )

class FriendRequestSerializer(serializers.ModelSerializer):
    sender=FriendSerializer(read_only=True)
    class Meta:
        model=Friendship
        fields=[
            'id',
            'sender',
            'status',
            'created_at'
        ]