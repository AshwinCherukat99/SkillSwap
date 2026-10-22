from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from .services.attendance import finalise_session
from .models import SkillExchangeSession,CourseSession

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