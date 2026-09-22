from rest_framework import serializers

from ..models import Badge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Badge
        fields=[
            'id',
            'name',
            'slug',
            'description',
            'icon',
            'rarity',
            'xp_reward',
        ]