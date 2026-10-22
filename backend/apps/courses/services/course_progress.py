from django.db.models import Count
from django.utils import timezone

from ..models import CourseEnrollment,CourseLesson,LessonProgress

def update_enrollment_progress(enrollment):
    total_lessons=CourseLesson.objects.filter(
        module__course_id=enrollment.course_id
    ).count()
    unlocked_lessons=enrollment.lesson_progress.filter(
        is_unlocked=True,
        lesson__module__course_id=enrollment.course_id,
    ).values('lesson_id').distinct().count()
    if total_lessons==0:
        lesson_progress=0
    else:
        lesson_progress=round(
            (unlocked_lessons/total_lessons)*90
        )
    exam_passed=enrollment.assessments.filter(
        status='COMPLETED',
        result__passed=True
    ).exists()
    progress=min(100,lesson_progress+(10 if exam_passed else 0))
    enrollment.progress=progress 
    if exam_passed and progress==100:
        if enrollment.completed_at is None:
            enrollment.completed_at=timezone.now()
    else:
        enrollment.completed_at=None
    enrollment.save(
        update_fields=['progress','completed_at']
    )
    return progress