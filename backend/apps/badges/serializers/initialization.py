from rest_framework import serializers

from ..models import Badge,BadgeRule
from .admin import BadgeRuleSerializer

class BadgeSerializer(serializers.ModelSerializer):
    rarity_display=serializers.CharField(
        source='get_rarity_display',
        read_only=True
    )
    rules=BadgeRuleSerializer(
        many=True,
        read_only=True
    )
    awarded_count=serializers.IntegerField(
        source='user_badges.count',
        read_only=True,
    )
    class Meta:
        model=Badge
        fields=[
            'id',
            'name',
            'slug',
            'description',
            'icon',
            'rarity',
            'rarity_display',
            'xp_reward',
            'is_active',
            'created_at',
            'rules',
            'awarded_count',
        ]