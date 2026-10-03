from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q,Count
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.accounts.models import User,UserRating
from apps.accounts.permissions import IsAdmin
from apps.accounts.services import generate_tokens
from apps.mentors.models import Mentor,MentorDocument,MentorVerification
from apps.courses.models import Course
from apps.skills.models import Skill,SuggestedSkill
from apps.reports.models import Report

from .serializers.auth import AdminLoginSerializer
from .serializers.mentor_verification import (
    RejectMentorSerializer,
    RequestMentorInfoSerializer,
)
from .serializers.course import AdminCourseDetailSerializer,AdminCourseListSerializer,AdminCourseModuleSerializer,AdminCourseLessonSerializer,AdminCourseRejectSerializer
from .serializers.skills import AdminSkillSerializer,SuggestedSkillSerializer
from .serializers.users import AdminUserSerializer       
from .serializers.reviews import AdminReviewSerializer,ReviewReportSerializer
from .serializers.mentors import (AdminMentorListSerializer,AdminMentorDetailSerializer,AdminMentorUpdateSerializer)

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

class AdminSkillListCreateView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        search=request.query_params.get('search','').strip()
        skills=Skill.objects.all().order_by('name')
        if search:
            skills=skills.filter(
                Q(name__icontains=search)|Q(slug__icontains=search)
            )
        serializer=AdminSkillSerializer(
            skills,
            many=True,
        )
        return Response(
            {
                'skills':serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def post(self,request):
        serializer=AdminSkillSerializer(
            data=request.data,
        )
        if serializer.is_valid:
            skill=serializer.save()
            return Response(
                AdminSkillSerializer(serializer).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class AdminSkillDeleteView(APIView):
    authentication_classes=[
        JWTAuthentication
    ]
    permission_classes=[
        IsAuthenticated
    ]
    def delete(self,request,skill_id):
        skill=get_object_or_404(
            Skill,
            id=skill_id,
        )
        skill.delete()
        return Response(
            {
                'message':'skill deleted successfully'
            },
            status=status.HTTP_200_OK,
        )

class AdminSuggestedSkillListView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        status_filter=request.query_params.get(
            'status','PENDING'
        )
        suggestions=(
            SuggestedSkill.objects.select_related('suggested_by','approved_skill').order_by('-created_at')
        )
        if status_filter!='all':
            suggestions=suggestions.filter(
                status=status_filter
            )
        serializer=SuggestedSkillSerializer(
            suggestions,
            many=True
        )
        return Response(
            {
                'suggestions':serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class AdminApproveSuggestedSkillView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    @transaction.atomic
    def post(self,request,suggestion_id):
        suggestion=get_object_or_404(
            SuggestedSkill.objects.select_for_update(),
            id=suggestion_id
        )
        if suggestion.status!=SuggestedSkill.Status.PENDING:
            return Response(
                {
                    'error':'this suggestion has already been reviewed'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_skill=Skill.objects.filter(
            name__iexact=suggestion.name.strip()
        ).first()
        if existing_skill:
            suggestion.status=(SuggestedSkill.Status.APPROVED)
            suggestion.approved_skill=existing_skill
            suggestion.reviewed_at=timezone.now()
            suggestion.save(
                update_fields=[
                    'status',
                    'approved_skill',
                    'reviewed_at',
                ]
            )
            return Response(
                {
                    'message':'skill approved. existing skill was linked',
                    'skill_id':existing_skill.id,
                },
                status=status.HTTP_200_OK,
            )
        skill=Skill.objects.create(
            name=suggestion.name.strip(),
            is_active=True,
        )
        suggestion.status=(SuggestedSkill.Status.APPROVED)
        suggestion.approved_skill=skill
        suggestion.reviewed_at=timezone.now()
        suggestion.save(
            update_fields=[
                'status',
                'approved_skill',
                'reviewed_at',
            ]
        )
        return Response(
            {
                'message':'skill approved successfully',
                'skill_id':skill.id,
            },
            status=status.HTTP_200_OK,
        )

class AdminRejectSuggestedSkillView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request,suggestion_id):
        suggestion=get_object_or_404(
            SuggestedSkill,
            id=suggestion_id,
        )
        if suggestion.status!=SuggestedSkill.Status.PENDING:
            return Response(
                {
                    'error':'this suggestion has already been reviewed'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        rejection_reason=request.data.get('rejection_reason','').strip()
        if not rejection_reason:
            return Response({
                'rejection_reason':'a rejection reason is required'
            },status=status.HTTP_400_BAD_REQUEST)
        suggestion.status=(SuggestedSkill.Status.REJECTED)
        suggestion.rejection_reason=rejection_reason
        suggestion.reviewed_at=timezone.now()
        suggestion.save(
            update_fields=[
                'status',
                'rejection_reason',
                'reviewed_at',
            ]
        )
        return Response(
            {
                'message':'skill suggestion rejected successfully'
            },
            status=status.HTTP_200_OK,
        )

class AdminUserManagementView(APIView):
    permission_classes=[
        IsAdmin,
        IsAuthenticated
    ]
    def get(self,request):
        user=User.objects.filter(
            role=User.Role.USER
        ).order_by('-date_joined')
        search=request.query_params.get(
            'search',''
        ).strip()
        if search:
            users=users.filter(
                Q(username__icontains=search)|
                Q(email__icontains=search)|
                Q(full_name__icontains=search)
            )
        user_status=request.query_params.get(
            'status',
            'ALL'
        ).upper()
        if user_status!='ALL':
            users=users.filter(
                status=user_status
            )
        all_users=User.objects.filter(
            role=User.Role.USER
        )
        total_users=all_users.count()
        active_users=all_users.filter(
            status=User.Status.ACTIVE
        ).count()
        blocked_users=all_users.filter(
            status=User.Status.BLOCKED
        ).count()
        suspended_users=all_users.filter(
            status=User.Status.SUSPENDED
        ).count()
        serializer=AdminUserSerializer(
            users,
            many=True,
            context={
                'request':request
            },
        )
        return Response(
            {
                'users':serializer.data,
                'stats':{
                    'total_users':total_users,
                    'active_users':active_users,
                    'blocked_users':blocked_users,
                    'suspended_users':suspended_users,
                }
            }
        )

class AdminUserDetailView(APIView):
    permission_classes=[
        IsAuthenticated,
        IsAdmin
    ]
    def get(self,request,user_id):
        user=get_object_or_404(
            User,
            id=user_id,
            role=User.Role.USER,
        )
        serializer=AdminUserSerializer(
            user,
            context={
                'request':request
            }
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AdminUserUpdateView(APIView):
    permission_classes=[
        IsAdmin,
        IsAuthenticated
    ]
    def patch(self,request,user_id):
        user=get_object_or_404(
            User,
            id=user_id,
            role=User.Role.USER,
        )
        serializer=AdminUserSerializer(
            user,
            data=request.data,
            partial=True,
            context={
                'request':request
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AdminBlockUserView(APIView):
    permission_classes=[
        IsAdmin,
        IsAuthenticated
    ]
    def post(self,request,user_id):
        user=get_object_or_404(
            User,
            id=user_id,
            role=User.Role.USER
        )
        user.status=User.Status.BLOCKED
        user.is_active=False
        user.save(
            update_fields=[
                'status',
                'is_active',
            ]
        )
        return Response({
            'message':'user blocked successfully',
                        'user_id':user.id,
                        'status':user.status
        }
        )

class AdminSuspendUserView(APIView):
    permission_classes=[
        IsAuthenticated,
        IsAdmin
    ]
    def post(self,request,user_id):
        user=get_object_or_404(
            User,
            id=user_id,
            role=User.Role.USER
        )
        user.status=user.Status.SUSPENDED
        user.is_active=True
        user.save(
            update_fields=[
                'status',
                'is_active',
            ]
        )
        return Response(
            {
                'message':'user suspended successufully',
                'user_id':user.id,
                'status':user.status
            }
        )

class AdminActivateUserView(APIView):
    psermission_classes=[
        IsAuthenticated,
        IsAdmin
    ]
    def post(self,request,user_id):
        user=get_object_or_404(
            User,
            id=user_id,
            role=User.Role.USER
        )
        user.status=User.Status.ACTIVE
        user.is_active=True
        user.save(
            update_fields=[
                'status',
                'is_active'
            ]
        )
        return Response(
            {
                'message':'user activated successfully',
                'user_id':user.id,
                'status':user.status,
            }
        )

class AdminReviewManagementView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        reviews=(UserRating.objects.select_related('rated_by','rated_user').order_by('-created_at'))
        search=request.query_params.get('search','').strip()
        if search:
            reviews=reviews.filter(
                Q(rated_by__username__icontains=search)|
                Q(rated_by__full_name__icontains=search)|
                Q(rated_user__username__icontains=search)|
                Q(rated_user__full_name__icontains=search)|
                Q(review__icontains=search)
            )
        rating=request.query_params.get('rating')
        if rating and rating!='all':
            try:
                rating=int(rating)
                if 1<=rating<=5:
                    reviews=reviews.filter(
                        rating=rating
                    )
            except ValueError:
                pass
        visibility=request.query_params.get('visibility')
        if visibility=='visible':
            reviews=reviews.filter(
                is_hidden=False
            )
        elif visibility=='hidden':
            reviews=reviews.filter(
                is_hidden=True
            )
        serializer=AdminReviewSerializer(
            reviews,
            many=True,
            context={
                'request':request,
            }
        )
        data=serializer.data
        review_ids=[review['id'] for review in data]
        report_counts={}
        if review_ids:
            reports=(
                Report.objects.filter(
                    target_type=Report.TargetType.REVIEW,
                    target_id__in=review_ids
                ).values('target_id').annotate(count=Count('id'))
            )
            reports={
                item['target_id']:item['count'] for item in reports
            }
        pending_report_counts={}
        if review_ids:
            pending_reports=(
                Report.objects.filter(
                    target_type=Report.TargetType.REVIEW,
                    target_id__in=review_ids,
                    status__in=[
                        Report.Status.PENDING,
                        Report.Status.IN_REVIEW,
                    ]
                ).values('target_id').annotate(count=Count('id'))
            )
            pending_report_counts={
                item['target_id']:item['count'] for item in pending_reports
            }
        for item in data:
            review_id=item['id']
            item['report_count']=(
                report_counts.get(
                    review_id,
                    0
                )
            )
            item['pending_report_count']=(
                pending_report_counts.get(
                    review_id,
                    0
                )
            )
        total_reviews=UserRating.objects.count()
        hidden_reviews=UserRating.objects.filter(is_hidden=True).count()
        reported_reviews=(Report.objects.filter(target_type=Report.TargetType.REVIEW).values('target_id').distint().count())
        return Response(
            {
                'reviews':data,
                'stats':{
                    'total_reviews':total_reviews,
                    'visible_reviews':(total_reviews-hidden_reviews),
                    'hidden_reviews':hidden_reviews,
                    'reported_reviews':reported_reviews,
                }
            }
        )

class AdminHideReviewView(APIView):
    permission_classes=[IsAdmin]
    def patch(self,request,review_id):
        try:
            review=UserRating.objects.get(id=review_id)
        except UserRating.DoesNotExist:
            return Response(
                {
                    'error':'review not found'
                },
                status=404
            )
        review.is_hidden=True
        review.save(
            update_fields=['is_hidden']
        )
        return Response(
            {
                'message':'review hidden successfully',
                'is_hidden':True,
            }
        )

class AdminRevealReviewView(APIView):
    permission_classes=[IsAdmin]
    def patch(self,request,review_id):
        try:
            review=UserRating.objects.get(id=review_id)
        except UserRating.DoesNotExist:
            return Response(
                {
                    'error':'review not found'
                },
                status=404
            )
        review.is_hidden=False
        review.save(
            update_fields=['is_hidden']
        )
        return Response(
            {
                'message':'review revealed successfully',
                'is_hidden':False,
            }
        )

class AdminRemoveReviewView(APIView):
    permission_classes=[IsAdmin]
    def delete(self,request,review_id):
        try:
            review=UserRating.objects.get(id=review_id)
        except UserRating.DoesNotExist:
            return Response(
                {
                    'error':'review not found'
                },
                status=404
            )
        review.delete()
        return Response(
            {
                'message':'review removed successfully'
            },
            status=200
        )

class AdminReviewReportsView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request,review_id):
        try:
            review=UserRating.objects.select_related('rated_by','rated_user').get(id=review_id)
        except UserRating.DoesNotExist:
            return Response(
                {
                    'error':'review does not exist'
                },
                status=404
            )   
        reports=Report.objects.filter(
            target_type=Report.TargetType.REVIEW,
            target_id=review_id,
        ).select_related('reporter')
        serializer=ReviewReportSerializer(
            reports,
            many=True,
        )
        return Response(
            {
                'review':AdminReviewSerializer(
                    review
                ).data,
                'reports':serializer.data,
                'total_reports':reports.count(),
            }
        )

class AdminReviewReportUpdateView(APIView):
    permission_classes=[IsAdmin]
    def patch(self,request,report_id):
        try:
            report=Report.objects.get(
                id=report_id,
                target_type=Report.TargetType.REVIEW,
            )
        except Report.DoesNotExist:
            return Response(
                {
                    'error':'report not found'
                },
                status=404
            )
        new_status=request.data.get('status')
        admin_notes=request.data.get('admin_notes')
        resolution=request.data.get('resolution')
        valid_statuses={
            Report.Status.PENDING,
            Report.Status.RESOLVED,
            Report.Status.DISMISSED,
            Report.Status.IN_REVIEW,
        }
        if new_status:
            if new_status not in valid_statuses:
                return Response(
                    {
                        'error':'invalid report status',
                    },
                    status=400
                )
            report.status=new_status
            if new_status==Report.Status.IN_REVIEW:
                report.reviewed_at=timezone.now()
            if new_status in [Report.Status.DISMISSED,Report.Status.RESOLVED]:
                report.resolved_at=timezone.now()
            if admin_notes is not None:
                report.admin_notes=admin_notes
            if resolution is not None:
                report.resolution=resolution
            report.save()
            serializer=ReviewReportSerializer(report)
            return Response(
                serializer.data
            )

class AdminMentorManagementView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def get(self,request):
        mentors=Mentor.objects.select_related('profile').all()
        search=request.query_params.get('search','').strip()
        mentor_status=request.query_params.get('status','ALL')
        if search:
            mentors=mentors.filter(
                Q(full_name__icontains=search)|
                Q(username__icontains=search)|
                Q(email__icontains=search)
            )
        if mentor_status!='ALL':
            if mentor_status=='PENDING':
                mentors=mentors.filter(is_verified=False)
            elif mentor_status in [
                Mentor.Status.ACTIVE,
                Mentor.Status.BLOCKED,
                Mentor.Status.SUSPENDED
            ]:
                mentors=mentors.filter(
                    status=mentor_status
                )
        mentors=mentors.order_by('-created_at')
        serializer=AdminMentorListSerializer(
            mentors,
            many=True,
            context={
                'request':request,
            }
        )
        return Response(
            {
                'mentors':serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class AdminMentorStatsView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def get(self,request):
        total=Mentor.objects.count()
        active=Mentor.objects.filter(
            status=Mentor.Status.ACTIVE
        ).count()
        pending=Mentor.objects.filter(
            is_verified=False
        ).count()
        suspended=Mentor.objects.filter(
            status=Mentor.Status.SUSPENDED
        ).count()
        blocked=Mentor.objects.filter(
            status=Mentor.Status.BLOCKED
        ).count()
        return Response(
            {
                'total':total,
                'active':active,
                'pending_verification':pending,
                'suspended':suspended,
                'blocked':blocked,
            },
            status=status.HTTP_200_OK,
        )

class AdminMentorDetailView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def get(self,request,mentor_id):
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id,
        )       
        serializer=AdminMentorDetailSerializer(
            mentor,
            context={
                'request':request
            }
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AdminMentorActionView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def post(self,request,mentor_id):
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id
        )
        action=request.data.get('action')
        if action=='suspend':
            mentor.status=Mentor.Status.SUSPENDED
            mentor.is_active=False
        elif action=='block':
            mentor.status=Mentor.Status.BLOCKED
            mentor.is_active=False
        elif action=='activate':
            mentor.status=Mentor.Status.ACTIVE
            mentor.is_active=True
        else:
            return Response(
                {
                    'error':'invalid response. use suspend, block or activate'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        mentor.save(
            update_fields=[
                'status',
                'is_active',
                'updated_at',
            ]
        )
        return Response(
            {
                'message':f'mentor {action}ed successfully',
                'status':mentor.status,
                'is_active':mentor.is_active,
            },
            status=status.HTTP_200_OK,
        )

class AdminMentorUpdateView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def patch(self,request,mentor_id):
        mentor=get_object_or_404(
            Mentor,
            id=mentor_id,
        )
        serializer=AdminMentorUpdateSerializer(
            mentor,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )