from rest_framework import serializers

from ..models import Notification,AdminNotification

class AdminNotificationSerializer(serializers.ModelSerializer):
    audience_display=serializers.CharField(
        source='get_audience_display',
        read_only=True
    )
    priority_display=serializers.CharField(
        source='get_priority_display',
        read_only=True
    )
    status_display=serializers.CharField(
        source='get_status_display',
        read_only=True,
    )
    recipient_username=serializers.CharField(
        source='recipient.username',
        read_only=True,
    )
    class Meta:
        model=AdminNotification
        fields=[
            'id',
            'title',
            'message',
            'audience',
            'audience_display',
            'recipient',
            'recipient_username',
            'priority',
            'priority_display',
            'in-app',
            'push',
            'email',
            'scheduled_at',
            'status',
            'status_display',
            'sent_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields=[
            'id',
            'status',
            'sent_at',
            'created_at',
            'updated_at',
            'recipient_username',
        ]
    def validate(self,attrs):
        audience=attrs.get(
            'audience',
            getattr(
                self.instance,
                'audience',
                None
            )
        )
        recipient=attrs.get(
            'recipient',
            getattr(
                self.instance,
                'recipient',
                None
            )
        )
        if audience==AdminNotification.Audience.INDIVIDUAL:
            if not recipient:
                raise serializers.ValidationError(
                    {
                        'recipient':('a recipient is required for an individual notification')
                    }
                )
            if not recipient.is_active:
                raise serializers.ValidationError(
                    {
                        'recipient':('the selected user is inactive')
                    }
                )
        else:
            if recipient:
                raise serializers.ValidationError(
                    {
                        'recipient':(
                            'recipient can only be specified for an individual notification'
                        )
                    }
                )
        in_app=attrs.get(
            'in_app',
            getattr(
                self.instance,
                'in_app',
                False
            )
        )
        push=attrs.get(
            'push',
            getattr(
                self.instance,
                'push',
                False
            )
        )
        email=attrs.get(
            'email',
            getattr(
                self.instance,
                'email',
                False
            )
        )
        if not any([in_app,push,email]):
            raise serializers.ValidationError({
                'channels':'select at least one notification channel'
            })
        return attrs