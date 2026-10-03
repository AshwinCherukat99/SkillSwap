from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser 
from .managers import MentorManager
# Create your models here.

class Mentor(AbstractBaseUser):
    class Status(models.TextChoices):
        ACTIVE='ACTIVE','Active'
        SUSPENDED='SUPENDED','Suspended'
        BLOCKED='BLOCKED','Blocked'
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mentor_profile',
    )
    full_name=models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    username=models.CharField(
        max_length=150,
        unique=True,
    )
    email=models.EmailField(
        unique=True,
    )
    profile_image=models.ImageField(
        upload_to='mentor_profiles/',
        blank=True,
        null=True,
    )
    phone_number=models.CharField(
        max_length=15,
        blank=True,
        null=True,
    )
    is_verified=models.BooleanField(
        default=False,
    )
    is_active=models.BooleanField(
        default=True,
    )
    rating=models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
    )
    total_reviews=models.PositiveIntegerField(
        default=0,
    )
    created_at=models.DateTimeField(
        auto_now_add=True,
    )
    updated_at=models.DateTimeField(
        auto_now=True,
    )
    objects=MentorManager()
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']
    def __str__(self):
        return self.email   

class MentorProfile(models.Model): 
    mentor=models.OneToOneField(
        Mentor,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    qualification=models.CharField(
            max_length=255,
            blank=True
        )
    current_profession=models.CharField(
        max_length=255,
        blank=True,
    )
    organization=models.CharField(
        max_length=255,
        blank=True,
    )
    experience_years=models.IntegerField(blank=True,)
    professional_summary=models.TextField(blank=True,)
    teaching_niche=models.TextField(blank=True,) 
    updated_at=models.DateTimeField(auto_now=True,)

class MentorDocument(models.Model): 
    class Status(models.TextChoices):
        PENDING='PENDING','Pending'
        APPROVED='APPROVED','Approved' 
        REJECTED='REJECTED','Rejected' 
    mentor=models.ForeignKey(
        Mentor,
        on_delete=models.CASCADE,
        related_name='documents',
    )
    document=models.FileField(
        upload_to='mentor_documents/'
    ) 
    external_url=models.URLField(
        blank=True,
        null=True,
    )
    document_type=models.CharField(
        max_length=100,
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    ) 
    rejection_reason=models.TextField(
        blank=True,
    )
    uploaded_at=models.DateTimeField(
        auto_now_add=True,
    ) 
    reviewed_at=models.DateTimeField(
        null=True,
        blank=True,
    ) 

class MentorVerification(models.Model):
    class Status(models.TextChoices):
        PENDING='PENDING','Pending'
        APPROVED='APPROVED','Approved'
        REJECTED='REJECTED','Rejected'
        INFO_REQUIRED='INFO_REQUIRED','Info Required'
    mentor=models.OneToOneField(
        Mentor,
        on_delete=models.CASCADE,
        related_name='verification',
    )
    identity_verified=models.BooleanField(
        default=False,
    )
    education_verified=models.BooleanField(
        default=False,
    )
    certifications_verified=models.BooleanField(
        default=False,
    )
    portfolio_verified=models.BooleanField(
        default=False,
    )
    internal_notes=models.TextField(
        blank=True,
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    rejection_reason=models.TextField(
        blank=True,
    )
    created_at=models.DateTimeField(
        auto_now_add=True,
    )
    reviewed_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    def __str__(self):
        return f'{self.mentor.username}-{self.status}'