from rest_framework import serializers

from ..models import SkillExchangeSession

class FriendSessionRequestSerializer(serializers.ModelSerializer):
    recipient_username=serializers.CharField(
        source='recipient.username',
        read_only=True
    )
    skill_wanted_name=serializers.CharField(
        source='skill_wanted.name',
        read_only=True
    )
    skill_offered_name=serializers.CharField(
        source='skill_offered.name',
        read_only=True
    )
    class Meta:
        model=SkillExchangeSession
        fields=[
            'id',
            'recipient',
            'recipient_username',
            'skill_wanted',
            'skill_wanted_name',
            'skill_offered',
            'skill_offered_name',
            'scheduled_start',
            'duration_minutes',
            'message',
            'status',
            'created_at',
        ]
        read_only_fields=[
            'id',
            'recipient_username',
            'skill_wanted_name',
            'skill_offered_name',
            'status',
            'created_at',
        ]
    def validate(self,attrs):
        request=self.context['request']
        user=request.user
        recipient=attrs['recipient']
        if recipient==user:
            raise serializers.ValidationError(
                'you cannot send a session request to yourself'
            )
        if attrs['skill_wanted']==attrs['skill_offered']:
            raise serializers.ValidationError(
                'wanted and offered skills cannot be the same'
            )
        return attrs

class RecievedSessionRequestSerializer(serializers.ModelSerializer):
    requester_username=serializers.CharField(
        source='requester.username',
        read_only=True,
    )
    requester_name=serializers.SerializerMethodField()
    skill_wanted_name=serializers.CharField(
        source='skill_wanted.name',
        read_only=True,
    )
    skill_offered_name=serializers.CharField(
        source='skill_offered.name',
        read_only=True
    )
    class Meta:
        model=SkillExchangeSession
        fields=[
            'id',
            'requester',
            'requester_username',
            'requester_name',
            'skill_wanted',
            'skill_wanted_name',
            'skill_offered',
            'skill_offered_name',
            'scheduled_start',
            'duration_minutes',
            'message',
            'status',
            'created_at',
        ]
        read_only_fields=fields
    def get_requester_name(self,obj):
        user=obj.requester
        return user.get_full_name() or user.username