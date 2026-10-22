from django.db import models
from django.conf import settings

class Conversation(models.Model):
    class ConversationType(models.TextChoices):
        DIRECT='DIRECT','Direct'
        GROUP='GROUP','Group'
        VIDEO_CALL='VIDEO_CALL','Video Call'
    course_session=models.OneToOneField(
        'sessions_mgmt.CourseSession',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='video_conversation',
    )
    skill_exchange_session=models.OneToOneField(
        'sessions_mgmt.SkillExchangeSession',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='video_conversation',
    )
    conversation_type=models.CharField(
        max_length=10,
        choices=ConversationType.choices
    )
    course=models.OneToOneField(
        'courses.Course',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='study_group',
        unique=False,
    )
    name=models.CharField(
        max_length=255,
        blank=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    def clean(self):
        from django.core.exceptions import ValidationError
        linked_sessions=[
            self.course_session_id,
            self.skill_exchange_session_id,
        ]
        if sum(value is not None for value in linked_sessions)>1:
            raise ValidationError(
                'a conversation can link to only one session type'
            )
    def __str__(self):
        return self.name or f'Conversation {self.id}'

class ConversationMember(models.Model):
    conversation=models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='members'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='chat_memberships'
    )
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='chat_memberships'
    )
    joined_at=models.DateTimeField(
        auto_now_add=True
    )
    left_at=models.DateTimeField(
        null=True,
        blank=True
    )
    is_active=models.BooleanField(
        default=True
    )
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['conversation','user'],
                name='unique_conversation_user'
            ),
            models.UniqueConstraint(
                fields=['conversation','mentor'],
                name='unique_conversation_mentor'
            )
        ]

class Message(models.Model):
    conversation=models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender_user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sent_chat_messages'
    )  
    sender_mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sent_chat_messages'
    )
    content=models.TextField(
        blank=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    is_deleted=models.BooleanField(
        default=False
    )
    class Meta:
        ordering=['created_at']

class MessageAttachment(models.Model):
    message=models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file=models.FileField(
        upload_to='chat_attachments/'
    )
    original_name=models.CharField(
        max_length=255
    )
    file_size=models.PositiveBigIntegerField(
        default=0
    )
    uploaded_at=models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return self.original_name

class MessageRead(models.Model):
    message=models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='read_records'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    read_at=models.DateTimeField(
        auto_now_add=True
    )