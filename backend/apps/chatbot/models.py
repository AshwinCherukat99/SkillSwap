from django.db import models
from django.db.models import Q
from django.conf import settings
from pgvector.django import VectorField
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

class KnowledgeDocument(models.Model):
    class Category(models.TextChoices):
        GENERAL='GENERAL','General'
        ACCOUNTS='ACCOUNTS','Accounts'
        MENTORS='MENTORS','Mentors'
        COURSES='COURSES','Courses'
        SESSIONS='SESSIONS','Sessions'
        PAYMENTS='PAYMENTS','Payments'
        SKILLS='SKILLS','Skills'
        POLICIES='POLICIES','Policies'
    class Audience(models.TextChoices):
        BOTH='BOTH','Both'
        USER='USER','User'
        MENTOR='MENTOR','Mentor'
    title=models.CharField(
        max_length=255
    )
    content=models.TextField()
    category=models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.GENERAL
    )
    audience=models.CharField(
        max_length=10,
        choices=Audience.choices,
        default=Audience.BOTH
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
    def __str__(self):
        return self.title
    class Meta:
        ordering=['-created_at']

class KnowledgeChunk(models.Model):
    document=models.ForeignKey(
        KnowledgeDocument,
        on_delete=models.CASCADE,
        related_name='chunks'
    )
    content=models.TextField()
    embedding=VectorField(
        dimensions=768
    )
    chunk_index=models.PositiveIntegerField()
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        ordering=['chunk_index']
        constraints=[
            models.UniqueConstraint(
                fields=['document','chunk_index'],
                name='unique_document_chunk'
            )
        ]
    def __str__(self): 
        return f'{self.document.title} - Chunk {self.chunk_index}'