from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from apps.sessions_mgmt.models import SkillExchangeSession,CourseSession,SessionAttendance
from apps.mentors.models import Mentor
from apps.accounts.models import User

COMPLETION_THRESHOLD_PERCENT=80

def get_session_model(session_type):
    if session_type=='SKILL_EXCHANGE':
        return SkillExchangeSession
    if session_type=='COURSE':
        return CourseSession
    raise ValueError('invalid session type')

def get_session_attendance_filter(session,session_type):
    if session_type=='SKILL_EXCHANGE':
        return {'skill_exchange_session':session}
    return {'course_session':session}

def validate_participant(session,session_type,participant,participant_type):
    if session_type=='SKILL_EXCHANGE':
        return (
            participant_type=='USER'
            and participant.pk in (
                session.requester_id,
                session.recipient_id,
            )
        )
    if participant_type=='MENTOR':
        return participant.pk==session.mentor_id
    if participant_type=='USER':
        return participant.pk==session.enrollment.user_id
    return False

def get_participant_filter(participant_type,participant):
    if participant_type=='USER':
        return {
            'participant_type':'USER',
            'user':participant,
            'mentor__isnull':True
        }
    if participant_type=='MENTOR':
        return {
            'participant_type':'MENTOR',
            'mentor':participant,
            'user__isnull':True,
        }

@transaction.atomic
def start_attendance(
    session_type,
    session_id,
    participant_type,
    participant,
):
    SessionModel=get_session_model(session_type)
    session=SessionModel.objects.select_for_update().get(pk=session_id)
    if session.status!=session.Status.SCHEDULED:
        raise ValueError('this session is not scheduled')
    if not validate_participant(
        session,
        session_type,
        participant,
        participant_type
    ):
        raise PermissionError('participant is not part of this session')
    now=timezone.now()
    if session.actual_started_at is None:
        session.actual_started_at=now
        session.save(update_fields=['actual_started_at','updated_at'])
    filters={
        **get_session_attendance_filter(session,session_type),
        **get_participant_filter(participant_type,participant)
    }
    attendance,_=SessionAttendance.objects.get_or_create(
        **filters,
        defaults={
            'first_joined_at':now,
            'joined_at':now,
        }
    )
    if attendance.joined_at is None:
        attendance.joined_at=now
        if attendance.first_joined_at is None:
            attendance.first_joined_at=now
        attendance.save(
            update_fields=[
                'joined_at','first_joined_at',
            ]
        )
    return attendance

@transaction.atomic
def stop_attendance(
    session_type,
    session_id,
    participant_type,
    participant,
):
    SessionModel=get_session_model(session_type)
    session=SessionModel.objects.select_for_update().get(
        pk=session_id
    )
    if not validate_participant(
        session,
        session_type,
        participant,
        participant_type
    ):
        raise PermissionError('participant is not part of this session')
    filters={
        **get_session_attendance_filter(session,session_type),
        **get_participant_filter(participant_type,participant)
    }
    if participant_type=='MENTOR':
        attendance=(
        SessionAttendance.objects.select_for_update().filter(course_session=session,mentor=participant).first()
    )
    else:
        if session_type=='SKILL_EXCHANGE':
            attendance=(
                SessionAttendance.objects.select_for_update().filter(skill_exchange_session=session,user=participant).first()
            )
        else:
            attendance=(
                            SessionAttendance.objects.select_for_update().filter(course_session=session,user=participant).first()
                        )
    if attendance is None or attendance.joined_at is None:
        return attendance
    now=timezone.now()
    elapsed=max(
        0,
        int((now-attendance.joined_at).total_seconds()),
    )
    attendance.total_attended_seconds+=elapsed
    attendance.last_left_at=now
    attendance.joined_at=None
    attendance.save(
        update_fields=[
            'total_attended_seconds',
            'last_left_at',
            'joined_at',
        ]
    )
    return attendance

@transaction.atomic 
def finalise_session(session_type,session_id):
    SessionModel=get_session_model(session_type)
    session=(
        SessionModel.objects.select_for_update().get(pk=session_id)
    )
    if session.status==session.Status.COMPLETED:
        return {
            'completed':True,
            'message':'session has already been completed'
        }
    if session.status!=session.Status.SCHEDULED:
        raise ValueError('only scheduled sessions can be finalised')
    now=timezone.now()
    attendance_filter=get_session_attendance_filter(
        session,
        session_type
    )
    scheduled_end=(
        session.scheduled_start+
        timedelta(minutes=session.duration_minutes)
    )
    effective_end=min(now,scheduled_end)
    records=list(
        SessionAttendance.objects.select_for_update().filter(
            **attendance_filter
        )
    )
    for record in records:
        if record.joined_at is not None:
            elapsed=max(
                0,
                int((effective_end-record.joined_at).total_seconds()),
            )
            record.total_attended_seconds+=elapsed
            record.last_left_at=now
            record.joined_at=None
            record.save(
                update_fields=[
                    'total_attended_seconds',
                    'last_left_at',
                    'joined_at',
                ]
            )
    if session_type=='SKILL_EXCHANGE':
        required_participants=[
            ('USER',session.requester_id),
            ('USER',session.recipient_id),
        ]
    else:
        required_participants=[
            ('USER',session.enrollment.user_id),
            ('MENTOR',session.mentor_id),
        ]
    required_seconds=(
        session.duration_minutes*60*COMPLETION_THRESHOLD_PERCENT//100
    )
    attendance_by_participant={}
    for record in records:
        if record.participant_type=='USER':
            key=('USER',record.user_id)
        else:
            key=('MENTOR',record.mentor_id)
        attendance_by_participant[key]=record
    participant_results=[]
    all_qualified=True
    for participant_type,participant_id in required_participants:
        key=(participant_type,participant_id)
        record=attendance_by_participant.get(key)
        attended_seconds=(
            record.total_attended_seconds if record else 0
        )
        qualified=attended_seconds>=required_seconds
        if not qualified:
            all_qualified=False
        participant_results.append({
            'participant_type':participant_type,
            'participant_id':participant_id,
            'attended_seconds':attended_seconds,
            'required_seconds':required_seconds,
            'qualified':qualified,
        })    
    if not all_qualified:
        session.status=session.Status.EXPIRED
        session.save(update_fields=['status','updated_at'])
        return {
            'completed':False,
            'expired':True,
            'message':'the session does not meet attendance requirement for every participant',
            'participants':participant_results,
        }
    session.status=session.Status.COMPLETED
    session.completed_at=now
    session.save(
        update_fields=[
            'status',
            'completed_at',
            'updated_at',
        ]
    )
    return {
        'completed':True,
        'message':'session completed successfully',
        'participants':participant_results,
    }