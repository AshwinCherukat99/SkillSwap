from django.utils import timezone
from .models import Certificate

def generate_certificate(assessment):
    result=assessment.result
    if not result.passed:
        return None
    enrollment=assessment.enrollment
    user=enrollment.user
    course=assessment.course
    existing_certificate=Certificate.objects.filter(
        enrollment=enrollment
    ).first()
    if existing_certificate:
        return existing_certificate
    certificate_number=(
        f'SS-{timezone.now().year}-{enrollment.id:06d}'
    )
    certificate=Certificate.objects.create(
        user=user,
        course=course,
        enrollment=enrollment,
        assessment=assessment,
        certificate_number=certificate_number,
        score=result.score,
    )
    return certificate