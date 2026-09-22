from django.db import transaction
from django.utils import timezone

from apps.mentors.models import Mentor,MentorVerification

from rest_framework_simplejwt.tokens import RefreshToken

def generate_admin_tokens(user):

    refresh = RefreshToken.for_user(user)

    refresh["account_type"] = "ADMIN"
    refresh["user_id"] = user.id

    access = refresh.access_token

    access["account_type"] = "ADMIN"
    access["user_id"] = user.id

    return {
        "refresh": str(refresh),
        "access": str(access),
    }

@transaction.atomic
def approve_mentor(mentor):
    verification=MentorVerification.objects.select_for_update().get(
        mentor=mentor
    ) 
    if verification.status==MentorVerification.Status.APPROVED:
        raise ValueError('this mentor is already approved')
    if not (
        verification.identity_verified
        and verification.education_verified
        and verification.certifications_verified
        and verification.portfolio_verified
    ):
        raise ValueError(
            'all verification checklist items must be completed before approval'
        )
    verification.status=MentorVerification.Status.APPROVED 
    verification.reviewed_at=timezone.now()
    verification.save(
        update_fields=[
            'status',
            'reviewed_at',
        ]
    )
    mentor.is_verified=True
    mentor.save(update_fields=['is_verified'])
    return verification

@transaction.atomic
def request_mentor_info(mentor,message):
    verification=MentorVerification.objects.select_for_update().get(
        mentor=mentor
    ) 
    verification.status=MentorVerification.Status.INFO_REQUIRED
    verification.rejection_reason=message
    verification.reviewed_at=timezone.now()
    verification.save(
        update_fields=[
            'status',
            'rejection_reason',
            'reviewed_at',
        ]
    ) 
    return verification

@transaction.atomic
def reject_mentor(mentor,rejection_reason):
    verification=MentorVerification.objects.select_for_update().get(
        mentor=mentor
    )
    verification.status=MentorVerification.Status.REJECTED
    verification.rejection_reason=rejection_reason
    verification.reviewed_at=timezone.now()
    verification.save(
        update_fields=[
            'status',
            'rejection_reason',
            'reviewed_at',
        ]
    )
    mentor.is_verified=False
    mentor.save(update_fields=['is_verified'])
    return verification