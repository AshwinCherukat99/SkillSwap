from django.db import models
from django.conf import settings

class SkillExchangeSession(models.Model):
    class Status(models.TextChoices):
        REQUESTED='REQUESTED','Requested'
        SCHEDULED='SCHEDULED','Scheduled'
        REJECTED='REJECTED','Rejected'
        CANCELLED='CANCELLED','Cancelled'
        COMPLETED='COMPLETED','Completed'
        EXPIRED='EXPIRED','Expired'
    class Duration(models.IntegerChoices):
        FIFTEEN=15,'15 minutes'
        THIRTY=30,'30 minutes'
        FORTY_FIVE=45,'45 minutes'
        SIXTY=60,'60 minutes'
        NINETY=90,'90 minutes'
        ONE_TWENTY=120,'120 minutes'
    requester=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skill_exchange_requests_sent'
    )
    recipient=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skill_exchange_requests_recieved'
    )
    skill_wanted=models.ForeignKey(
        'skills.Skill',
        on_delete=models.PROTECT,
        related_name='skill_exchange_sessions_wanted'
    )
    skill_offered=models.ForeignKey(
        'skills.Skill',
        on_delete=models.PROTECT,
        related_name='skill_exchange_sessions_offered'
    )
    scheduled_start=models.DateTimeField()
    duration_minutes=models.PositiveSmallIntegerField(
        choices=Duration.choices
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.REQUESTED
    )   
    message=models.TextField(blank=True)
    rejection_reason=models.TextField(blank=True)
    cancellation_reason=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    accepted_at=models.DateTimeField(
        null=True,
        blank=True
    )
    cancelled_at=models.DateTimeField(
        blank=True,
        null=True
    )  
    class Meta:
        ordering=['-scheduled_start']
    def __str__(self):
        return (
            f'{self.requester}<->{self.recipient}'
            f'-{self.skill_wanted}'
        )

class CourseSession(models.Model):
    class Status(models.TextChoices):
        SCHEDULED='SCHEDULED','Scheduled'
        CANCELLED='CANCELLED','Cancelled'
        COMPLETED='COMPLETED','Completed'
        EXPIRED='EXPIRED','Expired'
    class Duration(models.IntegerChoices):
        FIFTEEN = 15, "15 minutes"
        THIRTY = 30, "30 minutes"
        FORTY_FIVE = 45, "45 minutes"
        SIXTY = 60, "1 hour"
        NINETY = 90, "1.5 hours"
        ONE_TWENTY = 120, "2 hours"
    enrollment=models.ForeignKey(
        'courses.CourseEnrollment',
        on_delete=models.CASCADE,
        related_name='course_sessions'
    )
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        related_name='course_sessions',
    )
    scheduled_start=models.DateTimeField()
    duration_minutes=models.PositiveSmallIntegerField(
        choices=Duration.choices
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )
    message=models.TextField(blank=True)
    cancellation_reason=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    completed_at=models.DateTimeField(
        null=True,
        blank=True
    )
    cancelled_at=models.DateTimeField(
        null=True,
        blank=True
    )
    def __str__(self):
        return (
            f'{self.enrollment.user.username}-'
            f'{self.enrollment.course.title}'
        )