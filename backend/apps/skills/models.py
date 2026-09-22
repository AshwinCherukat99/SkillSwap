from django.db import models
from django.conf import settings
from apps.mentors.models import Mentor
# Create your models here.
class Skill(models.Model):
    name=models.CharField(
        max_length=100,
        unique=True,
    )
    slug=models.SlugField(
        unique=True,
    ) 
    is_active=models.BooleanField(
        default=True,
    )
    created_at=models.DateTimeField(
        auto_now_add=True,
    )
    def __str__(self):
        return self.name 

class UserSkill(models.Model):
    class SkillType(models.TextChoices):
        OFFER='OFFER','Offer'
        WANT='WANT','Want'
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_skills',
    )
    skill=models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='user_skills',
    )
    skill_type=models.CharField(
        max_length=10,
        choices=SkillType.choices,
    )
    created_at=models.DateTimeField(
        auto_now_add=True,
    )
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['user','skill','skill_type'],
                name='unique_user_skill_type',
            )
        ]
    def __str__(self):
        return f'{self.user}-{self.skill}-{self.skill_type}'

class SuggestedSkill(models.Model): 
    class SuggestedFor(models.TextChoices):
        OFFER='OFFER','Skills I Offer'
        WANT='WANT','Skills I Want'
    class Status(models.TextChoices):
        PENDING='PENDING','Pending'
        APPROVED='APPROVED','Approved'
        REJECTED='REJECTED','Rejected'
    suggested_by=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skill_suggestions',
    )
    name=models.CharField(max_length=100)
    description=models.TextField(blank=True)
    suggested_for=models.CharField(
        max_length=10,
        choices=SuggestedFor.choices,
    )
    status=models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    approved_skill=models.ForeignKey(
        Skill,
        on_delete=models.SET_NULL,
        null=True,
        blank=True, 
        related_name='suggestions',
    )
    rejection_reason=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    reviewed_at=models.DateTimeField(
        null=True,
        blank=True,
    )