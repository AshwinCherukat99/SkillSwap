import base64
import json

from py_vapid import Vapid

from pywebpush import webpush,WebPushException

from django.conf import settings
from django.db.models import Q

from .models import PushSubscription

def send_push_notification(subscription,admin_notification):
    subscription_info={
        'endpoint':subscription.end_point,
        'keys':{
            'p256dh':subscription.p256dh,
            'auth':subscription.auth,
        }
    }
    payload={
        'title':admin_notification.title,
        'body':admin_notification.message,
        'priority':admin_notification.priority,
        'url':'/notifications/',
    }
    try:
        private_key_pem=base64.b64decode(
                settings.VAPID_PRIVATE_KEY_B64
            ).decode('utf-8') 
        vapid_key=Vapid.from_pem(
            private_key_pem.encode('utf-8')
        )
        webpush(
            subscription_info=subscription_info,
            data=json.dumps(payload),
            vapid_private_key=vapid_key,
            vapid_claims={
                'sub':settings.VAPID_SUBJECT
            },
        )
        return True
    except WebPushException as error:
        status_code=getattr(
            getattr(error,'response',None),
            'status_code',
            None
        )
        if status_code in (404,410):
            subscription.delete()
        else:
            print(f'push delivery failed for subscription:{subscription.id},{error}')
        return False 
    except Exception as error:
        print(f'unexpected push error for subscription {subscription.id}:',error)
        return False

def get_push_subscriptions(recipients):
    user_ids=[
        user.id 
        for user in recipients['users']
    ]
    mentor_ids=[
        mentor.id
        for mentor in recipients['mentors']
    ]
    return PushSubscription.objects.filter(
        Q(user_id__in=user_ids)|
        Q(mentor_id__in=mentor_ids)
    ).distinct()