from django.db import transaction
from django.utils import timezone

from .models import (Notification,AdminNotification)

from apps.mentors.models import Mentor
from apps.accounts.models import User

@transaction.atomic
def send_admin_notification(admin_notification):
    audience=admin_notification.audience
    recipient_ids=set()
    if audience==AdminNotification.Audience.INDIVIDUAL:
        if admin_notification.recipient:
            recipient_ids.add(admin_notification.recipient.id)
    elif audience==AdminNotification.Audience.USER:
        user_ids=User.objects.filter(role=User.Role.USER).values_list(id,flat=True)
        recipient_ids.update(user_ids)
    elif audience==AdminNotification.Audience.MENTOR:
        mentor_user_ids=(Mentor.objects.filter(is_active=True,user__isnull=False,user__is_active=True).values_list('user_id',flat=True))
        recipient_ids.update(mentor_user_ids)
    elif audience==AdminNotification.Audience.ALL:
        user_ids=(User.objects.filter(is_active=True).values_list('id',flat=True))
        recipient_ids.update(user_ids)
        mentor_user_ids=(Mentor.objects.filter(is_active=True,user__isnull=False,user__is_active=True).values_list('user_id',flat=True))
        recipient_ids.update(mentor_user_ids)
    notification_objects=[]
    for user_id in recipient_ids:
        notification_objects.append(
                Notification(
                    recipient_id=user_id,
                    notification_type=(Notification.NotificationType.ADMIN_ANNOUNCEMENT),
                    title=admin_notification.title,
                    message=admin_notification.message,
                )
            )
    Notification.objects.bulk_create(notification_objects)
    admin_notification.status=(AdminNotification.Status.SENT)
    admin_notification.sent_at=timezone.now()
    admin_notification.save(
            update_fields=[
                'status',
                'sent_at',
                'updated_at',
            ]
        )
    return admin_notification