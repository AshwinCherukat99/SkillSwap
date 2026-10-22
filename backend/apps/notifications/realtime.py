from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_notification_toast(notification):
    channel_layer=get_channel_layer()
    if channel_layer is None:
        print('error:channel layer is not configured')
        return
    group_name=f'notifications_user_{notification.recipient_id}'
    print('channel group:',group_name)
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type':'notification_event',
            'notification':{
                'id':notification.id,
                'notification_type':notification.notification_type,
                'title':notification.title,
                'message':notification.message,
                'created_at':notification.created_at.isoformat(),
                'is_read':notification.is_read,
            }
        }
    )