from celery import shared_task
from django.utils import timezone

from .models import AdminNotification
from .services import send_admin_notification,get_admin_notification_recipients
from .email_service import send_admin_notification_email
from .push_service import send_push_notification,get_push_subscriptions

@shared_task
def send_due_admin_notifications():
    due_notifications=AdminNotification.objects.filter(
        status=AdminNotification.Status.SCHEDULED,
        scheduled_at__lte=timezone.now(),
    ).order_by('scheduled_at')
    sent_count=0
    for notification in due_notifications:
        try:
            send_admin_notification(notification)
            sent_count+=1
        except Exception as e:
            print(f'failed to send notification {notification.id}:{e}')
    return sent_count

@shared_task
def deliver_admin_notification(notification_id):
    try:
        notification=AdminNotification.objects.get(
            id=notification_id
        )
    except AdminNotification.DoesNotExist:
        return 
    recipients=get_admin_notification_recipients(notification)
    if notification.email:
        try:
            send_admin_notification_email(notification,recipients)
        except Exception as e:
            print(f"email delivery failed:{e}")
    if notification.push:
        subscriptions=get_push_subscriptions(recipients)
        for subscription in subscriptions:
            try:
                send_push_notification(subscription,notification)
            except Exception as e:
                print(f"push delivery failed:{e}")