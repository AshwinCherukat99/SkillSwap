from collections import defaultdict
from datetime import timedelta
from django.db.models import Count,Sum,Avg
from django.utils import timezone

from apps.accounts.models import User
from apps.courses.models import CourseEnrollment,LessonProgress,Assessment
from apps.sessions_mgmt.models import SessionAttendance,CourseSession
from apps.sessions_mgmt.services.attendance import COMPLETION_THRESHOLD_PERCENT

def collect_learner_activity(days=30):
    if days<=0:
        raise ValueError(
            'days must be greater than zero'
        )
    period_start=timezone.now()-timedelta(days=days)
    enrolled_user_ids=(CourseEnrollment.objects.values_list('user_id',flat=True).distinct())
    learners=User.objects.filter(
        id__in=enrolled_user_ids,
        role='USER',
        status='ACTIVE',
        is_active=True,
        is_staff=False,
        is_superuser=False,
        mentor_profile__isnull=True,
    ).distinct()
    learner_ids=list(
        learners.values_list('id',flat=True)
    )
    if not learner_ids:
        return []
    attendance_records=(
        SessionAttendance.objects.filter(
            participant_type='USER',
            user_id__in=learner_ids,
            course_session__isnull=False,
            skill_exchange_session__isnull=True,
            course_session__status=CourseSession.Status.COMPLETED,
            course_session__completed_at__gte=period_start
        ).values(
            'id',
            'user_id',
            'total_attended_seconds',
            'course_session__duration_minutes'
        )
    )
    attendance_map=defaultdict(
        lambda:{
            'sessions_attended':0,
            'total_attended_seconds':0
        }
    )
    for record in attendance_records:
        duration_minutes=record[
            'course_session__duration_minutes'
        ]
        required_seconds=(
            duration_minutes*60*COMPLETION_THRESHOLD_PERCENT//100
        )
        attended_seconds=record['total_attended_seconds'] or 0
        if attended_seconds<required_seconds:
            continue
        user_id=record['user_id']
        attendance_map[user_id]['sessions_attended']+=1
        attendance_map[user_id]['total_attended_seconds']+=attended_seconds
    lesson_stats=(
        LessonProgress.objects.filter(
            enrollment__user_id__in=learner_ids,
            is_completed=True,
            completed_at__gte=period_start
        )
        .values('enrollment_user_id')
        .annotate(
            lessons_completed=Count('id')
        )
    )
    lesson_map={
        row['enrollment_user_id']:row['lessons_completd']
        for row in lesson_stats
    }
    assessment_stats=(
        Assessment.objects.filter(
            enrollment__user_id__in=learner_ids,
            status=Assessment.Status.COMPLETED,
            completed_at__gte=period_start
        )
        .values('enrollment__user_id')
        .annotate(
            assessments_completed=Count('id'),
            average_score=Avg('score')
        )
    )
    assessment_map={
        row['enrollment__user_id']:row 
        for row in assessment_stats
    }
    active_days=defaultdict(set)
    attendance_dates=(
        SessionAttendance.objects.filter(
            participant_type='USER',
            user_id__in=learner_ids,
            course_session__isnull=False,
            skill_exchange_session__isnull=True,
            course_session__status=CourseSession.Status.COMPLETED,
            course_session__completed_at__gte=period_start,
            total_attended_seconds__gt=0,
            first_joined_at__gte=period_start
        )
        .values_list(
            'user_id',
            'first_joined_at'
        )
    )
    for user_id,timestamp in attendance_dates:
        if timestamp:
            active_days[user_id].add(timestamp.date())
    lesson_dates=(
        LessonProgress.objects.filter(
            enrollment__user_id__in=learner_ids,
            is_completed=True,
            completed_at__gte=period_start
        )
        .values_list(
            'enrollment__user_id',
            'completed_at'
        )
    )
    for user_id,timestamp in lesson_dates:
        if timestamp:
            active_days[user_id].add(timestamp.date()) 
    assessment_dates=(
        Assessment.objects.filter(
            enrollment__user_id__in=learner_ids,
            status=Assessment.Status.COMPLETED,
            completed_at__gte=period_start
        )
        .values_list(
            'enrollment__user_id',
            'completed_at'
        )
    )   
    for user_id,timestamp in assessment_dates:
        if timestamp:
            active_days[user_id].add(timestamp.date())
    results=[]
    for user in learners:
        attendance=attendance_map[user.id]
        assessment=assessment_map.get(user.id,{})
        total_seconds=attendance[
            'total_attended_seconds'
        ]
        average_score=assessment.get('average_score')
        results.append({
            'user_id':user.id,
            'username':user.username,
            'sesions_attended':attendance['sessions_attended'],
            'attendance_minutes':round(
                total_seconds/60,
                2
            ),
            'lessons_completed':lesson_map.get(
                user.id,0
            ),
            'assessments_completed':assessment.get(
                'assessments_completed',
                0
            ),
            'average_score':(
                float(average_score) if average_score is not None
                else None
            ),
            'active_learning_days':len(active_days[user.id])
        })
    return results