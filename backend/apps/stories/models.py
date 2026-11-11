from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q
# Create your models here.

class Story(models.Model):
    class ContentType(models.TextChoices):
        IMAGE='IMAGE','Image'
        VIDEO='VIDEO','Video'
        TEXT='TEXT','Text'
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='stories',
    )
    content_type=models.CharField(
        max_length=10,
        choices=ContentType.choices
    )
    media=models.FileField(
        upload_to='stories/%Y/%m/%d/',
        null=True,
        blank=True,
    )
    text=models.TextField(blank=True)
    background_color=models.CharField(
        max_length=20,
        blank=True,
    )
    created_at=models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )
    expires_at=models.DateTimeField(db_index=True)
    is_active=models.BooleanField(default=True)
    class Meta:
        ordering=['-created_at']
        constraints=[
            models.CheckConstraint(
                condition=Q(expires_at__gt=models.F('created_at')),
                name='story_expiry_after_creation'
            ),
            models.CheckConstraint(
                condition=(
                    ~Q(content_type='TEXT')|
                    Q(media='')
                ),
                name='text_story_without_media'
            ),
            models.CheckConstraint(
                condition=(
                    Q(content_type='TEXT')|
                    ~Q(media='')
                ),
                name='media_story_requires_file'
            )
        ]
        indexes=[
            models.Index(
                fields=['is_active','expires_at'],
                name='story_active_expiry_idx'
            ),
            models.Index(
                fields=['user','created_at'],
                name='story_user_created_idx'
            )
        ]
    def clean(self):
        super().clean()
        if self.content_type==self.ContentType.TEXT:
            if not self.text.strip():
                raise ValidationError({
                    'text':'text story cannot be empty'
                })
        elif self.content_type in [
            self.ContentType.IMAGE,
            self.ContentType.VIDEO,
        ]:
            if not self.media:
                raise ValidationError({
                    'media':'media is required'
                })
    def __str__(self):
        return f'story by {self.user.username}'
    @property
    def is_expired(self):
        return self.expires_at<=timezone.now()

class StoryView(models.Model):
    story=models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='views'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='story_views',
    )
    viewed_at=models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        ordering=['-viewed_at']
        constraints=[
            models.UniqueConstraint(
                fields=['story','user'],
                name='unique_story_user_view',
            )
        ]
        indexes=[
            models.Index(
                fields=['story','viewed_at'],
                name='story_view_time_idx'
            )
        ]
    def __str__(self):
        return f'{self.user.username} viewed story {self.story_id}'

class StoryReaction(models.Model):
    class ReactionType(models.TextChoices):
        LIKE='LIKE','Like'
        LOVE='LOVE','Love'
        LAUGH='LAUGH','Laugh'
        WOW='WOW','Wow'
        CLAP='CLAP','Clap'
    story=models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='story_reactions'
    )
    reaction=models.CharField(
        max_length=10,
        choices=ReactionType.choices,
        default=ReactionType.LIKE,
    )
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['-created_at']
        constraints=[models.UniqueConstraint(
            fields=['story','user'],
            name='unique_story_user_reaction',
        )]