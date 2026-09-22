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