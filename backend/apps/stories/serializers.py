import os
import re

from django.utils import timezone

from rest_framework import serializers 

from .models import Story,StoryView,StoryReaction

class StorySerializer(serializers.ModelSerializer):
    username=serializers.CharField(
        source='user.username',
        read_only=True,
    )
    full_name=serializers.CharField(
        source='user.full_name',
        read_only=True,
    )
    profile_image=serializers.SerializerMethodField()
    total_views=serializers.IntegerField(read_only=True) 
    total_reactions=serializers.IntegerField(read_only=True)
    is_expired=serializers.SerializerMethodField()
    class Meta:
        model=Story
        fields=[
            'id',
            'user',
            'username',
            'full_name',
            'profile_image',
            'content_type',
            'media',
            'text',
            'background_color',
            'created_at',
            'expires_at',
            'is_active',
            'total_views',
            'total_reactions',
            'is_expired',
        ]
        read_only_fields=[
            'id',
            'user',
            'created_at',
            'expires_at',
            'is_active',
            'total_views',
            'total_reactions',
            'is_expired',
        ]
    def get_profile_image(self,obj):
        request=self.context.get('request')
        if not obj.user.profile_image:
            return None
        image_url=obj.user.profile_image.url
        if request:
            return request.build_absolute_uri(image_url)
        return image_url
    def get_is_expired(self,obj):
        return obj.expires_at<=timezone.now()
    def validate_background_color(self,value):
        if value and not re.match(r"^#[0-9A-Fa-f]{6}$",value):
            raise serializers.ValidationError(
                'background color must be a valid hex color'
            )
        return value
    def validate(self,attrs):
        content_type=attrs.get('content_type')
        media=attrs.get('media')
        text=attrs.get('text','')
        background_color=attrs.get('background_color','')
        if content_type==Story.ContentType.TEXT:
            if not text or not text.strip():
                raise serializers.ValidationError({
                    'text':'text story cannot be empty'
                })
            if media:
                raise serializers.ValidationError({
                    'media':'text stories cannot contain a media file'
                })
        elif content_type in [
            Story.ContentType.IMAGE,
            Story.ContentType.VIDEO,
        ]:
            if not media:
                raise serializers.ValidationError({
                    'media':'a media file is required for image and video stories'
                })
            if content_type==Story.ContentType.IMAGE:
                allowed_types=['image/jpeg','image/png','image/webp']
                max_size=10*1024*1024
            else:
                allowed_types=['video/mp4','video/webm','video/quicktime']
                max_size=50*1024*1024
            if media.content_type not in allowed_types:
                raise serializers.ValidationError({
                    'media':'unsupported file format'
                })
            if media.size>max_size:
                raise serializers.ValidationError({
                    'media':f'file size cannot exceed {max_size/(1024*1024)} mb'
                })
        else:
            raise serializers.ValidationError({
                'content_type':'invalid story content type'
            })
        if background_color and not re.match(r"^#[0-9A-Fa-f]{6}$",background_color):
            raise serializers.ValidationError({
                'background_color':'enter a valid hex color'
            })
        return attrs

class StoryViewerSerializer(serializers.ModelSerializer):
    username=serializers.CharField(
        source='user.username',
        read_only=True
    )
    full_name=serializers.CharField(
        source='user.full_name',
        read_only=True
    )
    profile_image=serializers.SerializerMethodField()
    class Meta:
        model=StoryView
        fields=[
            'id',
            'user',
            'username',
            'full_name',
            'profile_image',
            'viewed_at'
        ]
        read_only_fields=fields
    def get_profile_image(self,obj):
        request=self.context.get('request')
        if not obj.user.profile_image:
            return None
        image_url=obj.user.profile_image.url
        if request:
            return request.build_absolute_uri(image_url)
        return image_url

class StoryReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model=StoryReaction
        fields=[
            'id',
            'reaction',
            'created_at',
            'updated_at'
        ]
        read_only_fields=[
            'id',
            'created_at',
            'updated_at',
        ]
    def validate_reaction(self,value):
        allowed_reactions=[
            choice[0]
            for choice in StoryReaction.ReactionType.choices
        ]
        if value not in allowed_reactions:
            raise serializers.ValidationError(
                'invalid reaction type'
            )
        return value 