from rest_framework import serializers
from .models import Skill,UserSkill,SuggestedSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta: 
        model=Skill
        fields=[
            'id',
            'name',
            'slug',
        ]

class UserSkillSerializer(serializers.ModelSerializer):
    skill=SkillSerializer(read_only=True)
    class Meta:
        model=UserSkill
        fields=[
            'id',
            'skill',
            'skill_type',
        ]
        read_only_fields=[
            'id',
            'skill',
            'skill_type',
        ]  

class ManageSkillSerializer(serializers.Serializer):
    skill_id=serializers.IntegerField()
    def validate_skill_id(self,value):
        if not Skill.objects.filter(
            id=value,
            is_active=True,
        ).exists():
            raise serializers.ValidationError(
                'skill not found'
            )
        return value

class SuggestSkillSerializer(serializers.Serializer):
    name=serializers.CharField(max_length=100)
    description=serializers.CharField(
        required=False,
        allow_blank=True, 
        max_length=300,
    )
    suggested_for=serializers.ChoiceField(
        choices=SuggestedSkill.SuggestedFor.choices,
    )
    def validate_name(self,value):
        value=value.strip() 
        if Skill.objects.filter(
            name__iexact=value,
            is_active=True
        ).exists(): 
            raise serializers.ValidationError(
                'this skill already exists in the master list'
            )
        return value