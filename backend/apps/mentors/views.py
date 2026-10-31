from rest_framework import status
from rest_framework.parsers import MultiPartParser,FormParser 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.utils import timezone
from datetime import date,timedelta
from google.oauth2 import id_token
from google.auth.transport import requests
from .authentication import MentorJWTAuthentication
from .models import MentorDocument,Mentor,MentorProfile
from apps.sessions_mgmt.models import CourseSession
from apps.chat.models import Conversation
from apps.accounts.models import UserRating
from apps.courses.models import Course,CourseEnrollment
from django.db.models import Count,Avg,Q
from django.db.models.functions import TruncMonth
from django.core.exceptions import ObjectDoesNotExist
from .serializers.documents import MentorDocumentSerializer,MentorRegisterSerializer,VerifyMentorRegistrationOTPSerializer,MentorLoginSerializer,MentorForgotPasswordSerialzer,MentorVerifyResetOTPSerializer,MentorResetPasswordSerializer,MentorProfileUpdateSerializer
from .serializers.reviews import MentorReviewSerializer
from .serializers.students import MentorStudentSerializer
from .services import start_mentor_registration,verify_mentor_registration_otp,generate_mentor_tokens,resend_mentor_registration_otp,start_mentor_password_reset,reset_mentor_password,verify_mentor_password_reset_otp

class MentorLoginView(APIView):
    def post(self, request):
        serializer = MentorLoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        mentor = serializer.validated_data["mentor"]

        tokens = generate_mentor_tokens(mentor)

        return Response(
            {
                "message": "mentor login successful",
                "mentor": {
                    "id": mentor.id,
                    "full_name": mentor.full_name,
                    "username": mentor.username,
                    "email": mentor.email,
                    "is_verified": mentor.is_verified,
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )

class MentorDocumentListCreateView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    parser_classes=[MultiPartParser,FormParser]
    def get(self,request):
        documents=MentorDocument.objects.filter(
            mentor=request.user
        ).order_by('-uploaded_at')
        serializer=MentorDocumentSerializer(
            documents,
            many=True,
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    def post(self,request): 
        serializer=MentorDocumentSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        document=serializer.save(
            mentor=request.user
        ) 
        return Response(
            {
                'message':'document submitted successfully',
                            'document':MentorDocumentSerializer(
                                document
                            ).data,
            },
            status=status.HTTP_201_CREATED,
        )

class MentorRegisterView(APIView):       
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]
    def post(self,request):
        data = request.data.copy()

        data.setlist(
            "documents",
            request.FILES.getlist("documents")
        )

        data.setlist(
            "document_types",
            request.data.getlist("document_types")
        )
        serializer=MentorRegisterSerializer(
            data=data
        )
        serializer.is_valid(
            raise_exception=True
        )
        print(
    "VALIDATED DATA:",
    serializer.validated_data
)

        print(
    "VALIDATED EMAIL:",
    serializer.validated_data.get("email")
)
        success,error=start_mentor_registration(
            full_name=serializer.validated_data['full_name'],
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            phone_number=serializer.validated_data["phone_number"],
            current_profession=serializer.validated_data.get(
                'current_profession',
                '',
            ),
            organization=serializer.validated_data.get(
                "organization",
                "",
            ),
            experience_years=serializer.validated_data.get(
                "experience_years"
            ),
            professional_summary=serializer.validated_data.get(
                "professional_summary",
                "",
            ),
            teaching_niche=serializer.validated_data.get(
                "teaching_niche",
                "",
            ),
            documents=serializer.validated_data.get(
                "documents",
                [],
            ),

            document_types=serializer.validated_data.get(
                "document_types",
                [],
            ),
        )
        if not success:
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':(
                    'mentor registration initiated'
                    'otp has been sent to your email'
                )
            },
            status=status.HTTP_200_OK,
        )

class VerifyMentorRegistrationOTPView(APIView):

    def post(self, request):

        serializer = (
            VerifyMentorRegistrationOTPSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            mentor = verify_mentor_registration_otp(
                email=serializer.validated_data["email"],
                otp_code=serializer.validated_data["otp"],
            )

        except ValueError as error:
            print(
        "MENTOR OTP VERIFICATION ERROR:",
        str(error)
    )

            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tokens = generate_mentor_tokens(
            mentor
        )

        return Response(
            {
                "message":
                    "mentor registration successful",

                "mentor": {
                    "id": mentor.id,
                    "full_name": mentor.full_name,
                    "username": mentor.username,
                    "email": mentor.email,
                    "is_verified": mentor.is_verified,
                },

                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )

class ResendMentorRegistrationOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.lower()

        success, error = resend_mentor_registration_otp(
            email
        )

        if not success:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message":
                    "A new OTP has been sent to your email."
            },
            status=status.HTTP_200_OK,
        )

class MentorForgotPasswordView(APIView):
    def post(self,request):
        serializer=MentorForgotPasswordSerialzer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        email=serializer.validated_data['email']
        start_mentor_password_reset(email)
        return Response(
            {
                'message':(
                    'if an active mentor account exists '
                    'with this email an otp has been sent'
                )
            },
            status=status.HTTP_200_OK
        )

class MentorVerifyResetOTPView(APIView):
    def post(self,request):
        serializer=MentorVerifyResetOTPSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        reset_token,error=(
            verify_mentor_password_reset_otp(
                serializer.validated_data['email'],
                serializer.validated_data['otp']
            )
        )
        if error:
            return Response(
                {
                    'error':error
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {
                'message':(
                    'otp verified successfully'
                ),
                'reset_token':reset_token
            },
            status=status.HTTP_200_OK
        )

class MentorResetPasswordView(APIView):
    def post(self,request):
        serializer=MentorResetPasswordSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        success,error=reset_mentor_password(
            serializer.validated_data['reset_token'],
            serializer.validated_data['new_password']
        )
        if not success:
            return Response(
                {
                    'error':error
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({
            'message':'password reset successful'
        },status=status.HTTP_200_OK)

class MentorGoogleLoginView(APIView):
    def post(self,request):
        credential=request.data.get('credential')
        if not credential:
            return Response(
                {
                    'error':'google credential is required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            id_info=id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            return Response(
                {
                    'error':'invalid google credential'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        email=id_info.get('email')
        email_verified=id_info.get('email_verified',False)
        if not email:
            return Response(
                {
                    'error':'google account email could not be verified'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if not email_verified:
            return Response(
                {
                    'error':'google email is not verified'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            mentor=Mentor.objects.get(
                email__iexact=email
            )
        except Mentor.DoesNotExist:
            return Response(
                {
                    'error':(
                        'no mentor account is associated'
                        'with this google account'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if not mentor.is_active:
            return Response(
                {
                    'error':'this mentor account is inactive'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        tokens=generate_mentor_tokens(mentor)
        return Response(
            {
                'message':'mentor google login successful',
                'mentor':{
                    'id':mentor.id,
                    'full_name':mentor.full_name,
                    'username':mentor.username,
                    'email':mentor.email,
                },
                'tokens':tokens,
            },
            status=status.HTTP_200_OK,
        )

class MentorDashboardView(APIView):
    permission_classes=[IsAuthenticated]   
    def get(self,request):
        if request.auth.get('account_type')!='MENTOR':
            return Response(
                {
                    'error':'mentor authentication required'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            mentor=request.user.mentor_profile
        except AttributeError:
            return Response(
                {
                    'error':'no mentor account is associated with this user'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if not mentor.is_active:
            return Response(
                {
                    'error':'mentor account is inactive'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        mentor_courses=Course.objects.filter(
            mentor=mentor,
            status=Course.Status.PUBLISHED,
            is_active=True,
        )
        courses=list(mentor_courses.values('slug'))
        total_students=CourseEnrollment.objects.filter(
            course_in=mentor_courses
        ).values('user').distinct().count()
        total_courses=mentor_courses.count()
        active_groups=Conversation.objects.filter(
            course__in=mentor_courses,
            conversation_type=Conversation.ConversationType.GROUP
        ).count()
        period=request.query_params.get('period','6')
        if period not in ['6','12']:
            period='6'
        period=int(period)
        today=timezone.localdate()       
        month_index=(
            today.year*12+today.month-1-(period-1)
        )
        start_date=date(
            month_index//12,
            month_index%12+1,
            1,
        )
        growth_data=(
            CourseEnrollment.objects.filter(
                course__in=mentor_courses,
                enrolled_at__date__gte=start_date,
            ).annotate(
                month=TruncMonth('enrolled_at')
            )
            .values('month')
            .annotate(
                students=Count('user',distinct=True)
            )
            .order_by('month')
        )
        growth_lookup={
            item['month'].date.replace(day=1):item['students'] 
            for item in growth_data
        }
        student_growth=[]
        for i in range(period):
            month_index=(
                start_date.year*12+today.month-1+i
            )
            month_date=date(
                month_index//12,
                month_index%12+1,
                1
            )
            student_growth.append({
                'month':month_date.strftime('%b'),
                'students':growth_lookup.get(month_date,0)
            })
        now=timezone.now()
        upcoming_queryset=(
            CourseSession.objects.filter(
                mentor=mentor,
                status=CourseSession.Status.SCHEDULED,
                scheduled_start__gte=now
            )
            .select_related(
                'enrollment__user',
                'enrollment__course'
            )
            .order_by('scheduled_start')[:5]
        )
        upcoming_sessions=[]
        for session in upcoming_queryset:
            try:
                conversation_id=session.video_conversation.id
            except ObjectDoesNotExist:
                conversation_id=None
            student=session.enrollment.user
            upcoming_sessions.append({
                'id':session.id,
                'title':session.enrollment.course.title,
                'student_name':(
                    student.full_name or student.username
                ),
                'student_username':student.username,
                'scheduled_start':session.scheduled_start,
                'duration_minutes':session.duration_minutes,
                'status':session.status,
                'message':session.message,
                'conversation_id':conversation_id,
            })
        profile_image=None
        if mentor.profile_image:
            profile_image=request.build_absolute_uri(
                mentor.profile_image.url
            )
        try:
            profile=mentor.profile
        except MentorProfile.DoesNotExist:
            profile=None
        mentor_data={
                                'id':mentor.id,
                                'full_name':mentor.full_name,
                                'username':mentor.username,
                                'email':mentor.email,
                                'profile_image':profile_image,
                                'phone_number':mentor.phone_number,
                                'is_verified':mentor.is_verified,
                                'rating':str(mentor.rating),
                                'total_reviews':mentor.total_reviews,
                                'created_at':mentor.created_at,
                                'updated_at':mentor.updated_at,
                                'current_profession':(
                                    profile.current_profession if profile else ''
                                ),
                                'professional_summary':(
                                                        profile.professional_summary if profile else ''
                                                    ),
                                'teaching_niche':(
                                                        profile.teaching_niche if profile else ''
                                                    ),
        }
        return Response(
            {
                'mentor':mentor_data,
                'courses':courses,
                'stats':{
                    'total_students':total_students,
                    'total_courses':total_courses,
                    'rating':str(mentor.rating),
                    'total_reviews':mentor.total_reviews,
                    'active_groups':active_groups,
                },
                'student_growth':student_growth,
                'upcoming_sessions':upcoming_sessions,
            },
            status=status.HTTP_200_OK,
        )

class MentorProfileUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        if request.auth.get("account_type") != "MENTOR":
            return Response(
                {
                    "error": "mentor authentication required"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            mentor = request.user.mentor_profile
        except AttributeError:
            return Response(
                {
                    "error":
                        "no mentor account is associated with this user"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not mentor.is_active:
            return Response(
                {
                    "error": "mentor account is inactive"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MentorProfileUpdateSerializer(
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        data = serializer.validated_data

        # --------------------------------
        # Mentor fields
        # --------------------------------

        if "full_name" in data:
            mentor.full_name = data["full_name"]

        if "username" in data:
            mentor.username = data["username"]

        if "phone_number" in data:
            mentor.phone_number = data["phone_number"]

        # --------------------------------
        # Profile fields
        # --------------------------------

        try:
            profile = mentor.profile
        except MentorProfile.DoesNotExist:
            profile = MentorProfile.objects.create(
                mentor=mentor
            )

        if "teaching_niche" in data:
            profile.teaching_niche = data[
                "teaching_niche"
            ]

        # --------------------------------
        # Profile image
        # --------------------------------

        if data.get("remove_profile_image"):

            if mentor.profile_image:
                mentor.profile_image.delete(
                    save=False
                )

            mentor.profile_image = None

        elif "profile_image" in data:

            mentor.profile_image = data[
                "profile_image"
            ]

        mentor.save()

        profile.save()

        # --------------------------------
        # Image URL
        # --------------------------------

        profile_image = None

        if mentor.profile_image:
            profile_image = request.build_absolute_uri(
                mentor.profile_image.url
            )

        return Response(
            {
                "message":
                    "mentor profile updated successfully",

                "mentor": {
                    "id": mentor.id,
                    "full_name": mentor.full_name,
                    "username": mentor.username,
                    "email": mentor.email,
                    "profile_image": profile_image,
                    "phone_number": mentor.phone_number,
                    "is_verified": mentor.is_verified,
                    "rating": str(mentor.rating),
                    "total_reviews": mentor.total_reviews,

                    "current_profession":
                        profile.current_profession,

                    "experience_years":
                        profile.experience_years,

                    "organization":
                        profile.organization,

                    "professional_summary":
                        profile.professional_summary,

                    "teaching_niche":
                        profile.teaching_niche,

                    "created_at":
                        mentor.created_at,

                    "updated_at":
                        mentor.updated_at,
                }
            },
            status=status.HTTP_200_OK
        )

class UserMentorProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,mentor_id):
        try:
            mentor=Mentor.objects.get(
                id=mentor_id,
                is_active=True,
                is_verified=True,
            )
        except Mentor.DoesNotExist:
            return Response(
                {
                    'error':'mentor not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        profile_image=None
        if mentor.profile_image:
            profile_image=request.build_absolute_uri(
                mentor.profile_image.url
            )
        try:
            profile=mentor.profile
        except MentorProfile.DoesNotExist:
            profile=None
        courses=(Course.objects.filter(
            mentor=mentor,
            status=Course.Status.PUBLISHED,
            is_active=True,
        ).annotate(
            enrollment_count=Count('enrollments',distinct=True)
        )
        ).select_related('category').order_by('-enrollment_count','-created_at')[:2]
        course_data=[]
        for course in courses:
            thumbnail=None
            if course.thumbnail:
                thumbnail=request.build_absolute_uri(
                    course.thumbnail.url
                )
            course_data.append(
                {
                    'id':course.id,
                    'title':course.title,
                    'slug':course.slug,
                    'description':course.description,
                    'thumbnail':thumbnail,
                    'catgeory':course.category.name,
                    'level':course.level,
                    'price':str(course.price),
                    'estimated_duration':course.estimated_duration,
                    'enrollment_count':course.enrollment_count,
                }
            )
        return Response(
                {
                    'mentor':{
                        'id':mentor.id,
                        'username':mentor.username,
                        'profile_image':profile_image,
                        'rating':str(mentor.rating),
                        'total_reviews':mentor.total_reviews,
                        'qualification':(
                            profile.qualification if profile and hasattr(profile,'qualification') else ''
                        ),
                        'current_profession':(
                            profile.current_profession if profile else ''
                        ),
                        'experience_years':(
                            profile.experience_years if profile and hasattr(profile,'experience_years') else 0
                        ),
                        'professional_summary':(
                            profile.professional_summary if profile else ''
                        ),
                        'teaching_niche':(
                            profile.teaching_niche if profile else ''
                        )
                    },
                    'courses':course_data,
                },
                status=status.HTTP_200_OK,
            )

class UserMentorReviewView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,mentor_id):
        try:
            mentor=Mentor.objects.get(
                id=mentor_id,
                is_active=True,
                is_verified=True,
            )
        except Mentor.DoesNotExist:
            return Response(
                {
                    'error':'mentor not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        reviews=(
            UserRating.objects.filter(
                rated_user=mentor.user,
            ).select_related('rated_by').order_by('-created_at')
        )
        average_rating=reviews.aggregate(
            average=Avg('rating')
        )['average']
        serializer=MentorReviewSerializer(
            reviews,
            many=True,
            context={'request':request}
        )
        return Response(
            {
                'mentor_id':mentor.id,
                'username':mentor.username,
                'average_rating':(
                    round(float(average_rating),2)
                    if average_rating is not None
                    else 0
                ),
                'total_reviews':reviews.count(),
                'reviews':serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def post(self,request,mentor_id):
        try:
            mentor=Mentor.objects.get(
                id=mentor_id,
                is_active=True,
                is_verified=True,
            )
        except Mentor.DoesNotExist:
            return Response(
                {
                    'error':'mentor not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if mentor.user_id==request.user.id:
            return Response(
                {
                    'error':'you cannot review yourself'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        rating=request.data.get('rating')
        review=request.data.get('review','').strip()
        if rating is None:
            return Response(
                {
                    'error':'rating is required'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            rating=int(rating)
        except (ValueError,TypeError):
            return Response(
                {
                    'error':'rating must be a number between 1 and 5'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if rating<1 or rating>5:
            return Response(
                {
                    'error':'rating must be between 1 and 5'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_review=UserRating.objects.filter(
            rated_user=mentor.user,
            rated_by=request.user,
        ).first()
        if existing_review:
            return Response(
                {
                    'error':'you have already reviewed this mentor'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        new_review=UserRating.objects.create(
            rated_user=mentor.user,
            rated_by=request.user,
            rating=rating,
            review=review,
        )
        rating_data=UserRating.objects.filter(
            rated_user=mentor.user,
        ).aggregate(
            average=Avg('rating')
        )
        mentor.rating=round(rating_data['average'] or 0,2)
        mentor.total_reviews=UserRating.objects.filter(
            rated_user=mentor.user
        ).count()
        mentor.save(
            update_fields=[
                'rating',
                'total_reviews',
                'updated_at',
            ]
        )
        serializer=MentorReviewSerializer(
            new_review,
            context={'request':request}
        )
        return Response(
            {
                'message':'review submitted successfully',
                'review':serializer.data,
                'average_rating':str(mentor.rating),
                'total_reviews':mentor.total_reviews,
            },
            status=status.HTTP_201_CREATED,
        )

class MentorReceivedReviewsView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        if not mentor.user:
            return Response(
                {
                    'error':'this mentor account is not linked to a user accound'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        reviews=(UserRating.objects.filter(rated_user=mentor.user).select_related('rated_by').order_by('-created_at'))
        serializer=MentorReviewSerializer(
            reviews,
            many=True,
            context={'request':request}
        )
        return Response(
            {
                'reviews':serializer.data,
                'total_reviews':reviews.count(),
            },
            status=status.HTTP_200_OK,
        )

class MentorStudentsView(APIView):
    authentication_classes=[MentorJWTAuthentication]        
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        enrollments=(CourseEnrollment.objects.filter(
            course__mentor=mentor,
            course__is_active=True,
        ).select_related('user','course').order_by('-enrolled_at'))
        total_students=(enrollments.values('user_id').distinct().count())
        completed_students=(enrollments.filter(completed_at__isnull=False).values('user_id').distinct().count())
        search=request.query_params.get('search','').strip()
        if search:
            enrollments=enrollments.filter(
                Q(user__username__icontains=search)|
                Q(user__full_name__icontains=search)|
                Q(user__last_name__icontains=search)|
                Q(user__first_name__icontains=search)
            )
        course_id=request.query_params.get('course')
        if course_id and course_id!='all':
            enrollments=enrollments.filter(
                course_id=course_id
            )
        student_status=request.query_params.get('status')
        if student_status=='active':
            enrollments=enrollments.filter(
                completed_at__isnull=True
            )
        elif student_status=='completed':
            enrollments=enrollments.filter(
                completed_at__isnull=False
            )  
        serializer=MentorStudentSerializer(
            enrollments,
            many=True,
            context={
                'request':request
            }
        )
        return Response(
            {
                'students':serializer.data,
                'stats':{
                    'total_students':total_students,
                    'completed_students':completed_students,
                    'active_now': 0,
        'sessions_this_week': 0,
        'average_rating': None,
        'success_rate': None,
                }
            },
            status=status.HTTP_200_OK,
        )