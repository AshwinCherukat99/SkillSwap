from django.db import models
from django.conf import settings
# Create your models here.
class Post(models.Model):
    user_author=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='user_posts',
    )
    mentor_author=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mentor_posts',
    )
    content=models.TextField()
    image=models.ImageField(
        upload_to='posts/',
        blank=True,
        null=True,
    )
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['-created_at']
    def __str__(self):
        author=self.user_author or self.mentor_author
        return f'{author}-{self.created_at}'

class PostLike(models.Model):
    post=models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='post_likes'
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['post','user'],
                name='unique_post_like'
            )
        ]

class PostComment(models.Model):
    post=models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='post_comments'
    )
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)