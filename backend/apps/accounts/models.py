from django.db import models
from django.db.models import Q,F
from django.contrib.auth.models import AbstractUser 
from .managers import UserManager
from django.utils import timezone 
from datetime import timedelta 
from django.conf import settings
# Create your models here.

class User(AbstractUser):
    class Role(models.TextChoices): 
        USER="USER","User"
        ADMIN="ADMIN","Admin"
    class Status(models.TextChoices):
        ACTIVE='ACTIVE','Active'
        BLOCKED='BLOCKED','Blocked'
        SUSPENDED='SUSPENDED','Suspended'
    username=models.CharField(max_length=150,unique=True)
    email=models.EmailField(unique=True) 
    full_name=models.CharField(max_length=150,blank=True,)
    bio=models.TextField(blank=True)
    location=models.CharField(max_length=255,blank=True)
    role=models.CharField(max_length=10,choices=Role.choices,default=Role.USER) 
    status=models.CharField(max_length=10,choices=Status.choices,default=Status.ACTIVE,db_index=True)
    profile_image=models.ImageField(upload_to='profile_images/',default="profile_images/default.jpg",blank=True,null=True)
    phone_number=models.CharField(max_length=15,blank=True,null=True) 
    google_id=models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True
    )
    xp=models.PositiveIntegerField(default=0)
    current_streak=models.PositiveIntegerField(default=0)
    last_session_date=models.DateField(null=True,blank=True)
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=["username"]
    objects=UserManager()
    def __str__(self):
        return self.email

class OTP(models.Model):
    class Purpose(models.TextChoices):
        REGISTER="REGISTER","Register" 
        MENTOR_REGISTER='MENTOR_REGISTER','Mentor Register'
        PASSWORD_RESET="PASSWORD_RESET","Password Reset"
        EMAIL_CHANGE="EMAIL_CHANGE","Email Change"
    email=models.EmailField()
    otp=models.CharField(max_length=6,db_index=True) 
    purpose=models.CharField(max_length=20,choices=Purpose.choices)
    created_at=models.DateTimeField(auto_now_add=True) 
    expires_at=models.DateTimeField()  
    attempts=models.PositiveBigIntegerField(default=0)
    def is_expired(self):
       return timezone.now()>self.expires_at 
    def __str__(self):
        return f"{self.email}-{self.purpose}" 
    def save(self,*args,**kwargs):
        if not self.expires_at:
            self.expires_at=timezone.now()+timedelta(minutes=5)
        super().save(*args,**kwargs)
    class Meta:
        indexes=[
            models.Index(fields=["email","purpose"])
        ]

class UserRating(models.Model):
    rated_user=models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='received_rating'
    )
    rated_by=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='given_rating'
    )
    session_id=models.PositiveBigIntegerField(
        null=True,
        blank=True,
        db_index=True,
    )
    rating=models.PositiveSmallIntegerField()
    review=models.TextField(blank=True)
    mentor_reply=models.TextField(
        blank=True,
        null=True
    )
    replied_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    is_hidden=models.BooleanField(
        default=False
    )
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.rated_by}->{self.rated_user}({self.rating})'
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['session_id','rated_by','rated_user'],
                condition=Q(session_id__isnull=False),
                name='unique_rating_per_user_per_session'
            ),
            models.CheckConstraint(
                condition=Q(rating__gte=1)&Q(rating__lte=5),
                name='user_rating_between_1_and_5'
            ),
            models.CheckConstraint(
                condition=~Q(rated_by=F('rated_user')), 
                name='user_cannot_rate_self'
            )
        ]

class Friendship(models.Model):
    class Status(models.TextChoices):
        PENDING='PENDING','Pending'
        ACCEPTED='ACCEPTED','Accepted'
        REJECTED='REJECTED','Rejected'
    sender=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_friend_requests',
    )
    receiver=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_friend_requests',
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at=models.DateTimeField(auto_now_add=True)
    accepted_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['sender','receiver'],   
                name='unique-friend-request'
            )
        ]