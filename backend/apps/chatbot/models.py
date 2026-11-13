from django.db import models
from django.db.models import Q
from django.conf import settings
# Create your models here.

class ChatConversation(models.Model):
    class AccountType(models.TextChoices):
        USER='USER','User'
        MENTOR='MENTOR','Mentor'
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='ai_conversations'
    )
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='ai_conversations'
    )
    account_type=models.CharField(
        max_length=10,
        choices=AccountType.choices
    )
    title=models.CharField(
        max_length=255,
        default='New Conversation'
    )
    is_active=models.BooleanField(
        default=True
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    def __str_(self):
        return f'{self.account_type}-{self.title}'
    class Meta:
        constraints=[
            models.CheckConstraint(
                condition=(
                    Q(
                        account_type='USER',
                        user__isnull=False,
                        mentor__isnull=True
                    )|
                    Q(
                        account_type='MENTOR',
                        user__isnull=True,
                        mentor__isnull=False
                    )
                ),
                name='valid_chat_conversation_owner'
            )
        ]

class ChatMessage(models.Model):
    class Role(models.TextChoices):
        USER='USER','User'
        ASSISTANT='ASSISTANT','Assistant'
    conversation=models.ForeignKey(
        ChatConversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role=models.CharField(
        max_length=10,
        choices=Role.choices
    )
    content=models.TextField()
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        ordering=['created_at']
    def __str__(self):
        return f'{self.role}-{self.conversation_id}'