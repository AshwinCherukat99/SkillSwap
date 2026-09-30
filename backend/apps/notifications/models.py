from django.db import models
from django.conf import settings

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        WELCOME = 'WELCOME', 'Welcome'

        SKILL_MATCH='SKILL_MATCH', 'Skill Match'

        # Admin
        ADMIN_ANNOUNCEMENT = (
            'ADMIN_ANNOUNCEMENT',
            'Admin Announcement'
        )

        ADMIN_WARNING = (
            'ADMIN_WARNING',
            'Admin Warning'
        )

        ADMIN_OFFER = (
            'ADMIN_OFFER',
            'Admin Offer'
        )

        # Friends
        FRIEND_REQUEST = (
            'FRIEND_REQUEST',
            'Friend Request'
        )

        FRIEND_REQUEST_ACCEPTED = (
            'FRIEND_REQUEST_ACCEPTED',
            'Friend Request Accepted'
        )

        FRIEND_REQUEST_REJECTED = (
            'FRIEND_REQUEST_REJECTED',
            'Friend Request Rejected'
        )

        # Sessions
        SESSION_REQUEST = (
            'SESSION_REQUEST',
            'Session Request'
        )

        SESSION_ACCEPTED = (
            'SESSION_ACCEPTED',
            'Session Accepted'
        )

        SESSION_REJECTED = (
            'SESSION_REJECTED',
            'Session Rejected'
        )

        SESSION_CANCELLED = (
            'SESSION_CANCELLED',
            'Session Cancelled'
        )

        SESSION_REMINDER = (
            'SESSION_REMINDER',
            'Session Reminder'
        )

        SESSION_COMPLETED = (
            'SESSION_COMPLETED',
            'Session Completed'
        )

        # Reviews
        REVIEW_RECEIVED = (
            'REVIEW_RECEIVED',
            'Review Received'
        )

        # Messages
        NEW_MESSAGE = (
            'NEW_MESSAGE',
            'New Message'
        )

        # Activity
        STREAK = (
            'STREAK',
            'Streak'
        )

        # Payments
        PAYMENT_SUCCESS = (
            'PAYMENT_SUCCESS',
            'Payment Successful'
        )

        PAYMENT_FAILED = (
            'PAYMENT_FAILED',
            'Payment Failed'
        )

        PAYMENT_PENDING = (
            'PAYMENT_PENDING',
            'Payment Pending'
        )

        POST='POST','Post'

        RATING='RATING','Rating'
    recipient=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    notification_type=models.CharField(
        max_length=30,
        choices=NotificationType.choices,
    )
    title=models.CharField(
        max_length=255
    )
    message=models.TextField()
    is_read=models.BooleanField(
        default=False
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        ordering=['-created_at']
    def __str__(self):
        return (
            f'{self.recipient.username}-'
            f'{self.title}'
        )

class AdminNotification(models.Model):
    class Audience(models.TextChoices):
        ALL=(
            'ALL',
            'All Users'
        )
        USER=(
            'USERS',
            'Users Only'
        )
        MENTOR=(
            'MENTOR',
            'Mentors Only'
        )
        INDIVIDUAL=(
            'INDIVIDUAL',
            'Individual User'
        )
    class Priority(models.TextChoices):
        NORMAL=(
            'NORMAL',
            'Normal'
        )
        HIGH=(
            'HIGH',
            'High'
        )
        URGENT=(
            'URGENT',
            'Urgent'
        )
    class Status(models.TextChoices):
        SENT=(
            'SENT',
            'Sent'
        )
        SCHEDULED=(
            'SCEHDULED',
            'Scheduled'
        )
        CANCELLED=(
            'CANCELLED',
            'Cancelled'
        )
    title=models.CharField(
        max_length=255
    )
    message=models.TextField()
    audience=models.CharField(
        max_length=20,
        choices=Audience.choices,
    )
    recipient=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='admin_direct_notifications'
    )
    priority=models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL
    )
    in_app=models.BooleanField(
        default=True
    )
    push=models.BooleanField(
        default=False
    )
    email=models.BooleanField(
        default=False
    )
    scheduled_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SENT,
    )
    sent_at=models.DateTimeField(
        blank=True,
        null=True,
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    class Meta:
        ordering=['-created_at']
    def __str__(self):
        return self.title