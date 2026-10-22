from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.badges.models import UserBadge

User=get_user_model()

class PublicBadgeSerializer(serializers.ModelSerializer):
    name=serializers.CharField(source='badge.name',read_only=True)
    slug=serializers.SlugField(source='badge.slug',read_only=True)
    description=serializers.CharField(
        source='badge.description',read_only=True
    )
    icon=serializers.CharField(source='badge.icon',read_only=True)
    rarity=serializers.CharField(source='badge.rarity',read_only=True)
    xp_reward=serializers.IntegerField(source='badge.xp_reward',read_only=True) 
    class Meta:
        model=UserBadge
        fields=[
            'name',
            'slug',
            'description',
            'icon',
            'rarity',
            'xp_reward',
            'earned_at'
        ]

class PublicUserProfileSerializer(serializers.ModelSerializer):
    badges=serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=[
            'id',
            'username',
            'full_name',
            'bio',
            'location',
            'profile_image',
            'xp',
            'current_streak',
            'date_joined',
            'badges',
            'last_session_date',
        ]
    def get_badges(self,obj):
        user_badges=(
            obj.user_badges
            .filter(badge__is_active=True)
            .select_related('badge')
            .order_by('-earned_at')
        )
        return PublicBadgeSerializer(user_badges,many=True).data