from celery import shared_task
from django.utils import timezone

from .models import AdminNotification
from .services import send_admin_notification

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