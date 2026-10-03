from django.db import models
from django.conf import settings

class Badge(models.Model):
    class Rarity(models.TextChoices):
        COMMON='COMMON','Common'
        RARE='RARE','Rare'
        EPIC='EPIC','Epic'
        LEGENDARY='LEGENDARY','Legendary'
    name=models.CharField(
        max_length=100,
        unique=True
    )
    slug=models.SlugField(
        unique=True
    )
    description=models.TextField()
    icon=models.CharField(
        max_length=100,
        default='workspace_premium'
    )
    rarity=models.CharField(
        max_length=20,
        choices=Rarity.choices,
        default=Rarity.COMMON
    )
    xp_reward=models.PositiveIntegerField(default=0)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_badges'
    )
    badge=models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name='user_badges'
    )
    earned_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['user','badge'],
                name='unique_user_badge'
            )
        ]
    def __str__(self):
        return f'{self.user}-{self.badge}'

class BadgeRule(models.Model):
    class RuleType(models.TextChoices):
        SESSIONS_COMPLETED='SESSIONS_COMPLETED','Sessions Completed'
        COURSES_COMPLETED='COURSES_COMPLETED','Courses Completed'
        COURSES_PASSED='COURSES_PASSED','Courses Passed'
        FRIENDS_ADDED='FRIENDS_ADDED','Friends Added'
        POSTS_CREATED='POSTS_CREATED','Posts Created'
        POSTS_LIKED='POSTS_LIKED','Posts Liked'
        COMMENTS_CREATED='COMMENTS_CREATED','Comments Created'
        STREAK_DAYS='STREAK_DAYS','Streak Days'
    badge=models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name='rules'
    )
    rule_type=models.CharField(
        max_length=50,
        choices=RuleType.choices,
    )
    target_value=models.PositiveIntegerField(
        default=1
    )
    class Meta:
        ordering=['id']
    def __str__(self):
        return f'{self.badge.name}-{self.rule_type}'