from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import transaction

from apps.notifications.models import Notification
from apps.chat.models import ConversationMember

class NotificationService:
    @staticmethod
    def create_notification(
        recipient,
        notification_type,
        title,
        message,
        send_realtime=True
    ):
        if recipient is None:
            return None
        notification=Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message
        )
        if send_realtime:
            transaction.on_commit(
                lambda notification_id=notification.id:
                NotificationService.send_realtime_notification(
                    notification_id
                )
            ) 
        return notification
    @staticmethod
    def send_realtime_notification(notification_id):
        try:
            notification=Notification.objects.get(
                id=notification_id
            )
            channel_layer=get_channel_layer()
            if channel_layer is None:
                return
            async_to_sync(channel_layer.group_send)(
                f'notifications_user_{notification.recipient_id}',
                {
                    'type':'notification_event',
                    'notification':{
                        'id':notification.id,
                        'notification_type':notification.notification_type,
                        'title':notification.title,
                        'message':notification.message,
                        'is_read':notification.is_read,
                        'created_at':notification.created_at.isoformat()
                    }
                }
            ) 
        except Notification.DoesNotExist:
            return
    @staticmethod
    def notify_conversation_members(
        conversation,
        sender_user=None,
        sender_mentor=None
    ):
        members=(
            ConversationMember.objects.filter(
                conversation=conversation,
                is_active=True
            )
            .select_related(
                'user',
                'mentor__user'
            )
        )
        sender_name=(
            sender_mentor.username
            if sender_mentor
            else sender_user.username
        ) 
        notified_user_ids=set()
        for member in members:
            if sender_user and member.user_id==sender_user.id:
                continue
            if sender_mentor and member.user_id==sender_mentor.id:
                continue
            recipient=None
            if member.user_id:
                recipient=member.user
            elif member.mentor_id:
                recipient=member.mentor.user
            if not recipient:
                continue
            if recipient.id in notified_user_ids:
                continue
            notified_user_ids.add(recipient.id)
            NotificationService.create_notification(
                recipient=recipient,
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                title='New Message',
                message=f'{sender_name} sent you a message'
            )