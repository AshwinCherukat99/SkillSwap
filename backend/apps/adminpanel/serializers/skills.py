from rest_framework import serializers
from django.utils import timezone

from apps.skills.models import Skill,SuggestedSkill

class AdminSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model=Skill
        fields=[
            'id',
            'name',
            'slug',
            'is_active',
            'created_at',
        ]
        read_only_fields=[
            'id',
            'created_at',
        ]

class SuggestedSkillSerializer(serializers.ModelSerializer):
    suggested_by_id=serializers.IntegerField(
        source='suggested_by.id',
        read_only=True,
    )
    suggested_by_name=serializers.SerializerMethodField()
    suggested_for_display=serializers.CharField(
        source='get_suggested_for_display',
        read_only=True,
    )
    status_display=serializers.CharField(
        source='get_status_display',
        read_only=True,
    )
    approved_skill_name=serializers.CharField(
        source='approved_skill.name',
        read_only=True,
        allow_null=True,
    )
    class Meta:
        model=SuggestedSkill
        fields=[
            'id',
            'suggested_by_id',
            'suggested_by_name',
            'name',
            'description',
            'suggested_for',
            'suggested_for_display',
            'status',
            'status_display',
            'approved_skill',
            'approved_skill_name',
            'rejection_reason',
            'created_at',
            'reviewed_at',
        ]
        read_only_fields=[
            'id',
            'suggested_by_id',
            'suggested_by_name',
            'suggested_for_display',
            'status_display',
            'approved_skill',
            'approved_skill_name',
            'created_at',
            'reviewed_at',
        ]
    def get_suggested_by_name(self,obj):
        user=obj.suggested_by
        return (
            user.full_name
            or user.get_full_name()
            or user.username
        )