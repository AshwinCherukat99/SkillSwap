from rest_framework import serializers
from .models import ChatConversation,ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ChatMessage
        fields=[
            'id',
            'role',
            'content',
            'created_at',
        ]
        read_only_fields=fields

class ChatConversationSerializer(serializers.ModelSerializer):
    messages=ChatMessageSerializer(
        many=True,
        read_only=True,
    )
    class Meta:
        model=ChatConversation
        fields=[
            'id',
            'account_type',
            'title',
            'is_active',
            'messages',
            'created_at',
            'updated_at',
        ]
        read_only_fields=fields

class ChatConversationCreateSerializer(serializers.Serializer):
    title=serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )

class ChatMessageCreateSerializer(serializers.Serializer):
    content=serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
    )