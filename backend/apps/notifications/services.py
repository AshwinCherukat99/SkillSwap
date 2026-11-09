from django.db import transaction
from django.utils import timezone

from .realtime import send_notification_toast

from .models import (Notification,AdminNotification)

from apps.mentors.models import Mentor
from apps.accounts.models import User

from .tasks import deliver_admin_notification

def get_admin_notification_recipients(admin_notification):
    audience=admin_notification.audience
    recipients={
        'users':[],
        'mentors':[]
    }
    if audience==AdminNotification.Audience.INDIVIDUAL:
        if admin_notification.recipient:
            recipients['users']=[
                admin_notification.recipient
            ]
    elif audience==AdminNotification.Audience.USER:
        recipients['users']=list(
            User.objects.filter(
                role=User.Role.USER,
                status=User.Status.ACTIVE,
                is_active=True,
                mentor_profile__isnull=True,
            ).only('id','email','username')
        )
    elif audience==AdminNotification.Audience.MENTOR:
        recipients['mentors']=list(
            Mentor.objects.filter(
                is_active=True,
                status=Mentor.Status.ACTIVE,
            ).only('id','email','username','user_id')
        )
    elif audience==AdminNotification.Audience.ALL:
        recipients['users']=list(
            User.objects.filter(
                role=User.Role.USER,
                status=User.Status.ACTIVE,
                is_active=True,
                mentor_profile__isnull=True,
            ).only('id','email','username')
        )
        recipients['mentors']=list(
            Mentor.objects.filter(
                is_active=True,
                status=Mentor.Status.ACTIVE
            ).only('id','email','username','user_id')
        )
    return recipients

@transaction.atomic
def send_admin_notification(admin_notification):
    recipients=get_admin_notification_recipients(admin_notification)
    in_app_user_ids={
        user.id 
        for user in recipients['users']
    }
    for mentor in recipients['mentors']:
        if mentor.user_id and mentor.user.is_active:
            in_app_user_ids.add(mentor.user_id)
    created_notifications=[]
    if admin_notification.in_app:
        notification_objects=[
            Notification(
                recipient_id=user_id,
                notification_type=Notification.NotificationType.ADMIN_ANNOUNCEMENT,
                title=admin_notification.title,
                message=admin_notification.message,
            )
            for user_id in in_app_user_ids
        ]
        created_notifications=Notification.objects.bulk_create(
            notification_objects
        )
    admin_notification.status=AdminNotification.Status.SENT
    admin_notification.sent_at=timezone.now()
    admin_notification.save(
    update_fields=[
                'status',
                'sent_at',
                'updated_at',
            ]
        )
    if admin_notification.email or admin_notification.push:
        transaction.on_commit(
                lambda:deliver_admin_notification.delay(
                    admin_notification.id
                )
            )
    if admin_notification.in_app:
        for notification in created_notifications:
                send_notification_toast(notification)
    return admin_notification