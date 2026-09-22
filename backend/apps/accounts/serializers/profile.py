from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.skills.models import UserSkill
from django.db.models import Avg

User=get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    skills_teaching=serializers.SerializerMethodField()
    skills_learning=serializers.SerializerMethodField()
    average_rating=serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=[
            'id',
            'full_name',
            'username',
            'email',
            'phone_number',
            'bio',
            'location',
            'profile_image',
            'date_joined',
            'skills_teaching',
            'skills_learning',
            'current_streak',
            'average_rating',
        ]
        read_only_fields=[
            'id',
            'email',
            'date_joined',
            'current_streak',
            'average_rating',
        ]
    def get_average_rating(self, obj):
        average = obj.received_rating.aggregate(
            average=Avg("rating")
        )["average"]

        return round(average, 1) if average is not None else 0.0
    def get_skills_teaching(self,obj):
        return UserSkill.objects.filter(
            user=obj,
            skill_type=UserSkill.SkillType.OFFER,
        ).count()
    def get_skills_learning(self,obj):
        return UserSkill.objects.filter(
            user=obj, 
            skill_type=UserSkill.SkillType.WANT,
        ).count()
    def validate_username(self,value):
        user=self.instance
        if User.objects.filter(
            username=value
        ).exclude(
            pk=user.pk
        ).exists():
            raise serializers.ValidationError(
                'this username is already taken'
            )
        return value
    
class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta: 
        model=User
        fields=['profile_image']
    def validate_profile_image(self,image):
        allowed_types=[
            "image/jpeg",
            "image/png",
            "image/webp",
        ]
        if image.content_type not in allowed_types: 
            raise serializers.ValidationError(
                'only jpeg, png, webp images are allowed'
            )
        max_size=5*1024*1024
        if image.size>max_size:
            raise serializers.ValidationError(
                'image size must not exceed 5 mb'
            )
        return image

class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=[
            'id',
            'username',
            'profile_image',
            'role',
            'bio',
        ] 
        read_only_fields=[
            'id',
            'username',
            'profile_image',
            'role',
            'bio',
        ]