from django.db import models
from django.conf import settings
# Create your models here.

class Report(models.Model):
    class ReportType(models.TextChoices):
        HARASSMENT='HARASSMENT','Harassment'
        SPAM='SPAM','Spam'
        INAPPROPRIATE_CONTENT=('INAPPROPRIATE_CONTENT','Inappropriate Content')
        ABUSE='ABUSE','Abuse'
        FRAUD='FRAUD','Fraud'
        IMPERSONATION='IMPERSONATION','Impersonation'
        OTHER='OTHER','Other'
    class Priority(models.TextChoices):
        LOW='LOW','Low'
        MEDIUM='MEDIUM','Medium'
        HIGH='HIGH','High'
        CRITICAL='CRITICAL','Critical'
    class Status(models.TextChoices):
        PENDING='PENDING','Pending'
        IN_REVIEW='IN_REVIEW','In Review'
        RESOLVED='RESOLVED','Resolved'
        DISMISSED='DISMISSED','Dismissed'
    class TargetType(models.TextChoices):
        USER='USER','User'
        MENTOR='MENTOR','Mentor'
        MESSAGE='MESSAGE','Message'
        POST='POST','Post'
        SESSION='SESSION','Session'
        REVIEW='REVIEW','Review'
    reporter=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submitted_reports',
    )
    reported_user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='received_reports',
    )
    reported_mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='received_reports',
    )
    target_type=models.CharField(
        max_length=20,
        choices=TargetType.choices,
        default=TargetType.USER,
    )
    target_id=models.PositiveIntegerField(
        null=True,
        blank=True,
    )
    report_type=models.CharField(
        max_length=40,
        choices=ReportType.choices,
    )
    priority=models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    description=models.TextField()
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    admin_notes=models.TextField(
        blank=True
    )
    resolution=models.TextField(
        blank=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    reviewed_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    resolved_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    class Meta:
        ordering=['-created_at']
    def __str__(self):
        return f'REP-{self.id}'