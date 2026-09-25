from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.accounts.permissions import IsAdmin
from apps.accounts.services import generate_tokens
from apps.mentors.models import Mentor,MentorDocument,MentorVerification
from apps.courses.models import Course

from .serializers.auth import AdminLoginSerializer
from .serializers.mentor_verification import (
    RejectMentorSerializer,
    RequestMentorInfoSerializer,
)
from .serializers.course import AdminCourseDetailSerializer,AdminCourseListSerializer,AdminCourseModuleSerializer,AdminCourseLessonSerializer,AdminCourseRejectSerializer

from .services import (
    approve_mentor,
    reject_mentor,
    request_mentor_info,
)

class AdminLoginView(APIView):
    def post(self,request):
        serializer=AdminLoginSerializer(
            data=request.data,
            context={'request':request},
        )
        serializer.is_valid(
            raise_exception=True
        ) 
        user=serializer.validated_data['user']
        tokens=generate_tokens(user)
        return Response(
            {
                'message':'admin login successful',
                'admin':{
                    'id':user.id,
                    'username':user.username,
                    'email':user.email,
                    'role':user.role,
                },
                'tokens':tokens,
            },
            status=status.HTTP_200_OK,
        )  

class MentorVerificationListView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        verifications=(MentorVerification.objects.select_related('mentor').order_by('-created_at'))
        mentors=[]
        for verification in verifications:
            mentor=verification.mentor
            documents_count=MentorDocument.objects.filter(
                mentor=mentor
            ).count()
            mentors.append({
                'id':mentor.id,
                'username':mentor.username,
                'email':mentor.email,
                'full_name':mentor.full_name,
                'profile_image':(
                    mentor.profile_image.url if mentor.profile_image else None
                ),
                'current_profession':(
                    mentor.profile.current_profession if hasattr(mentor,'profile') else ''
                ),
                'teaching_niche':(
                    mentor.profile.teaching_niche if hasattr(mentor,'profile') else ''
                ),
                'status':verification.status,
                'identity_verified':(verification.identity_verified),
                'education_verified':(verification.education_verified),
                'certifications_verified':(verification.certifications_verified),
                'portfolio_verified':(verification.portfolio_verified),
                'documents_count':documents_count,
                'submitted_at':verification.created_at,
                'reviewed_at':verification.reviewed_at,
            })
        stats={
            'pending':MentorVerification.objects.filter(
                status=MentorVerification.Status.PENDING
            ).count(),
            'under_review':MentorVerification.objects.filter(
                            status=MentorVerification.Status.INFO_REQUIRED
                        ).count(),
            'verified':MentorVerification.objects.filter(
                            status=MentorVerification.Status.APPROVED
                        ).count(),
            'rejected':MentorVerification.objects.filter(
                status=MentorVerification.Status.REJECTED
            ).count(),
        }
        return Response(
            {
                'stats':stats,
                'mentors':mentors,
            },
            status=status.HTTP_200_OK,
        )

class MentorVerificationDetailView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request,mentor_id):
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id,
        )
        verification=get_object_or_404(
            MentorVerification,
            mentor=mentor,
        )
        documents=MentorDocument.objects.filter(
            mentor=mentor
        ).order_by('-uploaded_at')
        return Response(
            {
                'mentor':{
                    'id':mentor.id,
                    'username':mentor.username,
                    'email':mentor.email,
                    'is_verified':mentor.is_verified,
                    'rating':str(mentor.rating),
                },
                'verification':{
                    'status':verification.status,
                    'identity_verified':verification.identity_verified,
                    'education_verified':verification.education_verified,
                    'certifications_verified':verification.certifications_verified,
                    'portfolio_verified':verification.portfolio_verified,
                    'internal_notes':verification.internal_notes,
                    'rejection_reason':verification.rejection_reason,
                    'created_at':verification.created_at,
                    'reviewed_at':verification.reviewed_at,
                },
                'documents':[
                    {
                        'id':document.id,
                        'document':(
                            document.document.url 
                            if document.document
                            else None
                        ),
                        'external_url':document.external_url,
                        'document_type':document.document_type,
                        'status':document.status,
                        'rejection_reason':document.rejection_reason,
                        'uploaded_at':document.uploaded_at,
                        'reviewed_at':document.reviewed_at,
                    }
                    for document in documents
                ],
            },
            status=status.HTTP_200_OK,
        )

class ApproveMentorView(APIView):
    permission_classes=[IsAdmin]
    def post(self,request,mentor_id):
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id,
        )
        try:
            verification=approve_mentor(mentor)
        except MentorVerification.DoesNotExist:
            return Response(
                {'error':'mentor verification record not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as error:
            return Response(
                {'error':str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'mentor approved successfully',
                'status':verification.status,
            },
            status=status.HTTP_200_OK,
        )   

class RequestMentorInfoView(APIView):
    permission_classes=[IsAdmin]
    def post(self,request,mentor_id):
        serializer=RequestMentorInfoSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id,
        )
        try:
            verification=request_mentor_info(
                mentor,
                serializer.validated_data['message'],
            )
        except MentorVerification.DoesNotExist:
            return Response(
                {'error':'mentor verification record not founc'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                'message':'additional information required',
                'status':verification.status,
            },
            status=status.HTTP_200_OK,
        )

class RejectMentorView(APIView):
    permission_classes=[IsAdmin]
    def post(self,request,mentor_id): 
        serializer=RejectMentorSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        mentor=get_object_or_404(Mentor,id=mentor_id)
        try:
            verification=reject_mentor(
                mentor,
                serializer.validated_data['rejection_reason'],
            )
        except MentorVerification.DoesNotExist:
            return Response(
                {'error':'mentor verification record not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                'message':'mentor rejected',
                'status':verification.status,
            },
            status=status.HTTP_200_OK,
        )

class AdminCourseManagementView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def get(self,request):
        courses=Course.objects.all().select_related(
            'mentor',
            'category'
        ).prefetch_related(
            'modules',
            'enrollments'
        ).order_by('-updated_at')
        search=request.query_params.get('search')
        if search:
            courses=courses.filter(
                Q(title__icontains=search)|
                Q(mentor__username__icontains=search)|
                Q(mentor__full_name__icontains=search)
            )
        course_status=request.query_params.get('status')
        if course_status:
            courses=courses.filter(status=course_status)
        category=request.query_params.get('category')
        if category:
            courses=courses.filter(
                category_id=category
            )
        total_courses=courses.count()
        pending_courses=courses.filter(
            status=Course.Status.PENDING_REVIEW
        ).count()
        published_courses=courses.filter(
            status=Course.Status.PUBLISHED
        ).count()
        draft_courses=courses.filter(
            status=Course.Status.DRAFT
        ).count()
        rejected_courses=courses.filter(
            status=Course.Status.ARCHIVED
        )
        serializer=AdminCourseListSerializer(
            courses,
            many=True,
        )
        return Response(
            {
                'stats':{
                    'total_courses':total_courses,
                    'pending_review':pending_courses,
                    'published':published_courses,
                    'drafts':draft_courses,
                    'rejected':rejected_courses,
                },
                'courses':serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class AdminCourseDetailView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def get(self,request,course_id):
        course=get_object_or_404(
            Course.objects.select_related(
                'mentor',
                'category',
            ).prefetch_related('modules__lessons'),
            id=course_id,
        )
        serializer=AdminCourseDetailSerializer(
            course
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AdminCourseApproveView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def post(self,request,course_id):
        course=get_object_or_404(
            Course,
            id=course_id,
        )
        if course.status!=Course.Status.PENDING_REVIEW:
            return Response({
                'error':'only courses pending review can be approved'
            },status=status.HTTP_400_BAD_REQUEST,)
        course.status=Course.Status.PUBLISHED
        course.is_active=True
        course.published_at=timezone.now()
        course.save(
            update_fields=[
                'status',
                'is_active',
                'published_at',
                'updated_at',
            ]
        )
        return Response(
            {
                'message':'course approved and published successfully',
                'course_id':course.id,
                'status':course.status,
            },
            status=status.HTTP_200_OK,
        )

class AdminCourseRejectView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def post(self,request,course_id):
        course=get_object_or_404(
            Course,
            id=course_id,
        )
        serializer=AdminCourseRejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if course.status!=Course.Status.PENDING_REVIEW:
            return Response(
                {
                    'error':'only courses pending review can be rejected'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        reason=serializer.validated_data['reason']
        course.status=Course.Status.REJECTED
        course.rejection_reason=reason
        course.save(
            update_fields=[
                'status',
                'rejection_reason',
                'updated_at',
            ]
        )
        return Response(
            {
                'message':'course rejected successfully',
                'course_id':course.id,
                'status':course.status,
                'reason':reason,
            },
            status=status.HTTP_200_OK,
        )