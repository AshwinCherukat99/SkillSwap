from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .services.attendance import finalise_session
from .models import SkillExchangeSession,CourseSession
from apps.notifications.notification_service import NotificationService
from apps.notifications.models import Notification

@shared_task
def expire_sessions():
    now=timezone.now()
    session_models=[
        ('SKILL_EXCHANGE',SkillExchangeSession),
        ('COURSE',CourseSession),
    ]
    results={
        'completed':0,
        'expired':0,
        'errors':0,
    }
    for session_type,SessionModel in session_models:
        sessions=SessionModel.objects.filter(
            status=SessionModel.Status.SCHEDULED,
            scheduled_start__lte=now,
        )
        for session in sessions.iterator():
            end_time=(
                session.scheduled_start+timedelta(minutes=session.duration_minutes)
            )
            if now<end_time:
                continue
            try:
                result=finalise_session(
                    session_type=session_type,
                    session_id=session.id
                )
                if result.get('completed'):
                    results['completed']+=1
                elif  result.get('expired'):
                    results['expired']+=1
            except Exception as e:
                print('failed to finalise session:',e)
    return results

@shared_task
def send_session_reminders():
    now=timezone.now()
    reminder_start=now+timedelta(minutes=29)
    reminder_end=now+timedelta(minutes=31)
    results={
        'skill_exchange_reminders':0,
        'course_reminders':0,
        'errors':0
    }
    skill_session_ids=SkillExchangeSession.objects.filter(
        status=SkillExchangeSession.Status.SCHEDULED,
        reminder_sent_at__isnull=True,
        scheduled_start__gte=reminder_start,
        scheduled_start__lt=reminder_end,
    ).values_list('id',flat=True)
    for session_id in skill_session_ids:
        try:
            with transaction.atomic():
                session=(
                    SkillExchangeSession.objects
                    .select_for_update(of=('self',))
                    .select_related('requester','recipient')
                    .filter(
                        id=session_id,
                        status=SkillExchangeSession.Status.SCHEDULED,
                        reminder_sent_at__isnull=True
                    )
                    .first()
                )
                if not session:
                    continue
                current_time=timezone.now()
                if not (
                    current_time+timedelta(minutes=29)
                    <=session.scheduled_start<
                    current_time+timedelta(minutes=31)
                ):
                    continue
                scheduled_time=timezone.localtime(
                    session.scheduled_start
                ).strftime('%d %b %Y at %I:%M %p')
                recipients=[
                    session.requester,
                    session.recipient
                ]
                for recipient in recipients:
                    other_person=(
                        session.recipient if
                        recipient.pk==session.requester_id
                        else session.requester 
                    )  
                    NotificationService.create_notification(
                        recipient=recipient,
                        notification_type=Notification.NotificationType.SESSION_REMINDER,
                        title='Session Starting Soon',
                        message=f'your session with {other_person.username} starts in approximately 30 minutes ({scheduled_time})'
                    )
                session.reminder_sent_at=timezone.now()
                session.save(
                    update_fields=['reminder_sent_at']
                ) 
                results['skill_exchange_reminders']+=1
        except Exception as e:
            results['errors']+=1
            print(f'failed to send skill exchange reminder for session {session_id}:{e}')
    course_session_ids=CourseSession.objects.filter(
        status=CourseSession.Status.SCHEDULED,
        reminder_sent_at__isnull=True,
        scheduled_start__gte=reminder_start,
        scheduled_start__lt=reminder_end
    ).values_list('id',flat=True)
    for session_id in course_session_ids:
        try:
            with transaction.atomic():
                session=(
                    CourseSession.objects
                    .select_for_update(of=('self',))
                    .select_related(
                        'enrollment__user',
                        'enrollment__course',
                        'mentor__user'
                    )
                    .filter(
                        id=session_id,
                        status=CourseSession.Status.SCHEDULED,
                        reminder_sent_at__isnull=True
                    )
                    .first()
                )
                if not session:
                    continue
                current_time=timezone.now()
                if not (
                    current_time+timedelta(minutes=29)
                    <=session.scheduled_start<
                    current_time+timedelta(minutes=31)
                ):
                    continue
                scheduled_time=timezone.localtime(
                    session.scheduled_start
                ).strftime('%d %b %Y at %I:%M %p')
                student=session.enrollment.user
                mentor_user=session.mentor.user
                recipients=[student]
                if mentor_user:
                    recipients.append(mentor_user)
                for recipient in recipients:
                    if recipient.pk==student.pk:
                        other_person=session.mentor.username
                    else:
                        other_person=student.username
                    NotificationService.create_notification(
                        recipient=recipient,
                        notification_type=Notification.NotificationType.SESSION_REMINDER,
                        title='Session Starting Soon',
                        message=f'your session with {other_person} for {session.enrollment.course.title} starts in approximately 30 min ({scheduled_time})'
                    )
                    session.reminder_sent_at=timezone.now()
                    session.save(
                        update_fields=['reminder_sent_at']
                    )
                    results['course_reminders']+=1
        except Exception as e:
            results['errors']+=1
            print(f'failed to send course session reminder for session {session_id}:{e}')
    return results