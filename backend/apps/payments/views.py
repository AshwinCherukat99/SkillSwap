from decimal import Decimal,InvalidOperation
from django.conf import settings
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.courses.models import Course,CourseEnrollment
from .models import CoursePayment,MentorWallet,WalletTransaction,MentorPayout
from .services.razorpay_service import create_course_order
import hmac
import hashlib
from django.utils import timezone
from django.db.models import Sum,Count
from django.db.models.functions import TruncDate
from apps.mentors.authentication import MentorJWTAuthentication
from apps.accounts.permissions import IsAdmin
from rest_framework import status

class CreateCoursePaymentOrderView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        course_id=request.data.get('course_id')
        try:
            course=Course.objects.get(
                id=course_id,
                status=Course.Status.PUBLISHED,
                is_active=True,
                mentor__is_active=True,
                mentor__is_verified=True,
            )
        except Course.DoesNotExist:
            return Response({
                'detail':'course not found'
            },status=404)
        if course.price<=0:
            return Response({
                'detail':'this course is free'
            },status=400)
        amount=course.price
        platform_fee=(amount*settings.PLATFORM_FEE_PERCENT/Decimal('100')).quantize(Decimal('0.01'))
        mentor_amount=amount-platform_fee
        receipt=f'course_{course.id}_{request.user.id}'
        razorpay_order=create_course_order(
            amount=amount,
            receipt=receipt,
        )
        payment=CoursePayment.objects.create(
            student=request.user,
            course=course,
            mentor=course.mentor,
            amount=amount,
            platform_fee=platform_fee,
            mentor_amount=mentor_amount,
            razorpay_order_id=razorpay_order['id']
        )
        return Response({
            'payment_id':payment.id,
            'razorpay_order_id':razorpay_order['id'],
            'razorpay_key_id':settings.RAZORPAY_KEY_ID,
            'amount':amount,
            'currency':'INR'
        })

class VerifyCoursePaymentView(APIView):
    permission_classes=[IsAuthenticated]
    @transaction.atomic
    def post(self,request):
        razorpay_order_id=request.data.get(
            'razorpay_order_id'
        )
        razorpay_payment_id=request.data.get(
            'razorpay_payment_id'
        )
        razorpay_signature=request.data.get(
            'razorpay_signature'
        )
        if not all([
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        ]):
            return Response({
                'detail':'missing payment details'
            },status=400)
        try:
            payment=(
                CoursePayment.objects.select_for_update().get(
                    razorpay_order_id=razorpay_order_id,
                    student=request.user
                )
            )
        except CoursePayment.DoesNotExist:
            return Response({
                'detail':'payment order not found'
            },status=404)
        if payment.status==CoursePayment.Status.PAID:
            return Response({
                'detail':'payment already verified'
            })
        message=(
            f'{payment.razorpay_order_id}|'
            f'{razorpay_payment_id}'
        )
        expected_signature=hmac.new(
            key=settings.RAZORPAY_KEY_SECRET.encode(),
            msg=message.encode(),
            digestmod=hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(
            expected_signature,
            razorpay_signature
        ):
            return Response({
                'detail':'invalid payment signature'
            },status=400)
        payment.razorpay_payment_id=razorpay_payment_id
        payment.status=CoursePayment.Status.PAID
        payment.paid_at=timezone.now()
        payment.save(
            update_fields=[
                'razorpay_payment_id',
                'status',
                'paid_at'
            ]
        )
        enrollment=CourseEnrollment.objects.create(
            user=request.user,
            course=payment.course,
        )
        wallet,_=MentorWallet.objects.select_for_update().get_or_create(
            mentor=payment.mentor
        )
        wallet.available_balance+=payment.mentor_amount
        wallet.save(update_fields=['available_balance'])
        WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type=WalletTransaction.TransactionType.COURSE_EARNING,
            direction=WalletTransaction.Direction.CREDIT,
            amount=payment.mentor_amount,
            balance_after=wallet.available_balance,
            course_payment=payment,
            description=(
                f'Course Purchase:{payment.course.title}'
            )
        )
        return Response({
            'detail':'payment verified successfully',
            'payment_id':payment.id,
            'enrollment_id':enrollment.id,
            'mentor_amount':payment.mentor_amount,
        })

class MentorRevenueView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[]
    def get(self,request):
        mentor=request.user
        wallet,_=MentorWallet.objects.get_or_create(
            mentor=mentor
        )
        payments=CoursePayment.objects.filter(
            mentor=mentor,
            status=CoursePayment.Status.PAID,
        )
        total_earnings=(payments.aggregate(total=Sum('mentor_amount'))['total'] or 0)
        current_month=timezone.now().month
        current_year=timezone.now().year
        this_month=(payments.filter(
            paid_at__month=current_month,
            paid_at__year=current_year,
        ).aggregate(total=Sum('mentor_amount'))['total'] or 0)
        pending_payout=(MentorPayout.objects.filter(mentor=mentor,status__in=[MentorPayout.Status.REQUESTED,MentorPayout.Status.PROCESSING,MentorPayout.Status.APPROVED,],).aggregate(total=Sum('amount'))['total'] or 0)
        students_count=(payments.values('student_id').distinct().count())
        transactions=payments.select_related('student','course')[:20]
        transaction_data=[]
        for payment in transactions:
            transaction_data.append({
                'id':payment.id,
                'transaction_id':payment.razorpay_payment_id,
                'student_name':(
                    payment.student.get_full_name() or payment.student.username
                ),
                'course_title':payment.course.title,
                'date':payment.paid_at,
                'amount':payment.amount,
                'mentor_amount':payment.mentor_amount,
                'platform_fee':payment.platform_fee,
                'status':payment.status,
            })
        return Response({
            'wallet':{
                'available_balance':wallet.available_balance,
                'pending_balance':wallet.pending_balance,
            },
            'summary':{
                'total_earnings':total_earnings,
                'this_month':this_month,
                'pending_payout':pending_payout,
                'students_enrolled':students_count,
            },
            'transactions':transaction_data,
        })

class MentorRequestPayoutView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[]
    @transaction.atomic
    def post(self,request):
        mentor=request.user
        raw_amount=request.data.get('amount')
        try:
            amount=Decimal(str(raw_amount))
        except (InvalidOperation,TypeError,ValueError):
            return Response({
                'detail':'invalid payout amount'
            },status=status.HTTP_400_BAD_REQUEST,)
        if (amount<=Decimal('0')):
            return Response({
                'detail':'payout amount must be greater than zero'
            },status=status.HTTP_400_BAD_REQUEST,) 
        wallet,_=(MentorWallet.objects.select_for_update().get_or_create(mentor=mentor))         
        if amount>wallet.available_balance:
            return Response({
                'detail':'insufficient available balance',
                'available_balance':str(wallet.available_balance),
            },status=status.HTTP_400_BAD_REQUEST,)           
        wallet.available_balance-=amount
        wallet.pending_balance+=amount
        wallet.save(update_fields=[
            'available_balance',
            'pending_balance',
            'updated_at',
        ]) 
        payout=MentorPayout.objects.create(
            mentor=mentor,
            amount=amount,
            status=MentorPayout.Status.REQUESTED,
        )        
        return Response({
            'message':'payout request submitted successfully',
            'payout':{
                'id':payout.id,
                'amount':str(payout.amount),
                'status':payout.status,
                'requested_at':payout.requested_at,
            },
            'wallet':{
                'available_balance':str(wallet.available_balance),
                'pending_balance':str(wallet.pending_balance),
            },
        },status=status.HTTP_201_CREATED,)

class AdminPaymentDashboardView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def get(self,request):
        now=timezone.now()
        today=now.date()
        current_year=now.year
        current_month=now.month
        paid_payments=CoursePayment.objects.filter(
            status=CoursePayment.Status.PAID
        )
        today_payments=paid_payments.filter(
            paid_at__date=today
        )
        total_revenue=(
            paid_payments.aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
        )
        total_transactions=CoursePayment.objects.count()
        today_revenue=(
            today_payments.aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
        )
        pending_payout_statuses=[
            MentorPayout.Status.REQUESTED,
            MentorPayout.Status.PROCESSING,
            MentorPayout.Status.APPROVED,
        ]
        pending_payouts=(MentorPayout.objects.filter(
            status__in=pending_payout_statuses
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00'))
        pending_payout_count=(MentorPayout.objects.filter(
            status__in=pending_payout_statuses
        ).count())
        refunded_payments=CoursePayment.objects.filter(
            status=CoursePayment.Status.REFUNDED,
        ).count()
        platform_profit=(
            paid_payments.aggregate(
                total=Sum('platform_fee'))['total'] or Decimal('0.00')
        )
        current_month_revenue=(
            paid_payments.filter(
                paid_at__year=current_year,
                paid_at__month=current_month
            ).aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
        )
        if current_month==1:
            previous_month_year=current_year-1
            previous_month=12
        else:
            previous_month_year=current_year
            previous_month=current_month-1
        previous_month_revenue=(
            paid_payments.filter(
                paid_at__year=previous_month_year,
                paid_at__month=previous_month,
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        )
        if previous_month_revenue>0:
            monthly_growth=(
            (current_month_revenue-previous_month_revenue)/previous_month_revenue
            )*Decimal('100')
        else:
            monthly_growth=Decimal('0.00')
        total_payment_attempts=CoursePayment.objects.count()
        successful_payments=paid_payments.count()
        if total_payment_attempts>0:
            transaction_success_rate=(
                Decimal(successful_payments)/Decimal(total_payment_attempts)*Decimal('100')
            )
        else:
            transaction_success_rate=Decimal('0.00')
        if successful_payments>0:
            refund_rate=(
                Decimal(refunded_payments)/Decimal(successful_payments)*Decimal('100')
            )
        else:
            refund_rate=Decimal('0.00')
        today_sales_count=today_payments.count()
        recent_payments=(
            CoursePayment.objects.select_related('student','course','mentor').order_by('-created_at')[:10]
        )
        transactions=[]
        for payment in recent_payments:
            student_name=(
                payment.student.get_full_name() or payment.student.username
            )
            transactions.append({
                'id':payment.id,
                'transaction_id':(
                    payment.razorpay_payment_id or payment.razorpay_order_id
                ),
                'order_id':payment.razorpay_order_id,
                'student_name':student_name,
                'student_username':payment.student.username,
                'mentor_name':payment.mentor.full_name or payment.mentor.username,
                'course_title':payment.course.title,
                'amount':payment.amount,
                'platform_fee':payment.platform_fee,
                'mentor_amount':payment.mentor_amount,
                'status':payment.status,
                'created_at':payment.created_at,
                'paid_at':payment.paid_at,
            })
        return Response({
            'overview':{
                'total_revenue':total_revenue,
                'total_transactions':total_transactions,
                'today_revenue':today_revenue,
                'pending_payouts':pending_payouts,
                'pending_payout_count':pending_payout_count,
                'refund_count':refunded_payments,
                'platform_profit':platform_profit,
                'monthly_growth':monthly_growth,
            },
            'today':{
                'sales':today_revenue,
                'transactions':today_sales_count,
            },
            'financial_health':{
                'transaction_success_rate':transaction_success_rate,
                'refund_rate':refund_rate,
            },
            'transactions':transactions,
        },status=status.HTTP_200_OK)