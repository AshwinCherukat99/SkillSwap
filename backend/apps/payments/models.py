from django.db import models
from django.conf import settings
from decimal import Decimal

class MentorWallet(models.Model):
    mentor=models.OneToOneField(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        related_name='wallet'
    )
    available_balance=models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    pending_balance=models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return f'{self.mentor} wallet'

class CoursePayment(models.Model):
    class Status(models.TextChoices):
        CREATED='CREATED','Created'
        PAID='PAID','Paid'
        REFUNDED='REFUNDED','Refunded'
        FAILED='FAILED','Failed'
    student=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='payments'
    )
    course=models.ForeignKey(
        'courses.Course',
        on_delete=models.PROTECT,
        related_name='payments',
    )
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.PROTECT,
        related_name='course_payments',
    )
    amount=models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    platform_fee=models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )
    mentor_amount=models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )
    razorpay_order_id=models.CharField(
        max_length=100,
        unique=True
    )
    razorpay_payment_id=models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    paid_at=models.DateTimeField(
        null=True,
        blank=True
    )        
    class Meta:
        ordering=['-created_at']

class WalletTransaction(models.Model):
    class TransactionType(models.TextChoices):
        COURSE_EARNING='COURSE_EARNING','Course Earning'
        PAYOUT='PAYOUT','Payout'
        REFUND='REFUND','Refund'
        ADJUSTMENT='ADJUSTMENT','Adjustment'
    class Direction(models.TextChoices):
        CREDIT='CREDIT','Credit'
        DEBIT='DEBIT','Debit'
    wallet=models.ForeignKey(
        MentorWallet,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type=models.CharField(
        max_length=30,
        choices=TransactionType.choices,
    )
    direction=models.CharField(
        max_length=10,
        choices=Direction.choices,
    )
    amount=models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    balance_after=models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    course_payment=models.ForeignKey(
        CoursePayment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='balance_transactions'
    )
    description=models.CharField(
        max_length=255
    )
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering=['-created_at']

class MentorPayout(models.Model):
    class Status(models.TextChoices):
        REQUESTED='REQUESTED','Requested'
        PROCESSING='PROCESSING','Processing'
        COMPLETED='COMPLETED','Completed'
        REJECTED='REJECTED','Rejected'
        APPROVED='APPROVED','Approved'
    mentor=models.ForeignKey(
        'mentors.Mentor',
        on_delete=models.PROTECT,
        related_name='payouts'
    )
    amount=models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.REQUESTED
    )
    payment_reference=models.CharField(
        max_length=200,
        blank=True,
    )
    failure_reason=models.TextField(
        blank=True
    )
    requested_at=models.DateTimeField(
        auto_now_add=True
    )
    approved_at=models.DateTimeField(
        null=True,
        blank=True,
    )
    completed_at=models.DateTimeField(
        null=True,
        blank=True
    )
    class Meta:
        ordering=['-requested_at'] 

class MentorPayoutProfile(models.Model):
    mentor=models.OneToOneField(
        'mentors.Mentor',
        on_delete=models.CASCADE,
        related_name='payout_profile'
    )
    razorpay_contact_id=models.CharField(
        max_length=100,
        blank=True
    )
    razorpay_fund_account_id=models.CharField(
        max_length=100,
        blank=True
    )
    is_verified=models.BooleanField(
        default=False
    )
    created_at=models.DateTimeField(
        auto_now_add=True
    )
    updated_at=models.DateTimeField(
        auto_now=True
    )