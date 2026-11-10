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