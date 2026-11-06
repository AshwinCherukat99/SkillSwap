from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.permissions import IsAdmin
from apps.accounts.models import User
from apps.posts.models import Post
from apps.chat.models import Message  
from apps.courses.models import CourseEnrollment
from apps.sessions_mgmt.models import SkillExchangeSession,CourseSession
from django.db import transaction
from django.db.models import Count,Q,F
from django.shortcuts import get_object_or_404

from .models import UserBadge,Badge,UserMilestone
from .services import BadgeService
from .serializers.initialization import BadgeSerializer
from .serializers.admin import AdminBadgeCreateSerializer,AdminBadgeUpdateSerializer

class BadgeDashboardView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        first_skill_session=SkillExchangeSession.objects.filter(
            Q(requester=user)|Q(recipient=user),
            status=SkillExchangeSession.Status.COMPLETED,
            completed_at__isnull=False,
        ).order_by('completed_at').first()
        first_course_session=CourseSession.objects.filter(
            enrollment__user=user,
            status=CourseSession.Status.COMPLETED,
            completed_at__isnull=False,
        ).order_by('completed_at').first()
        completed_session_dates=[
            session.completed_at
            for session in [
                first_skill_session,
                first_course_session
            ]
            if session is not None
        ]
        first_session_date=(
            min(completed_session_dates)
            if completed_session_dates
            else None
        )
        first_post=Post.objects.filter(
            user_author=user
        ).order_by('created_at').first()
        first_message=Message.objects.filter(
            sender_user=user,
            is_deleted=False,
        ).order_by('created_at').first()
        first_enrollment=CourseEnrollment.objects.filter(
            user=user
        ).order_by('enrolled_at').first()
        first_completed_course=CourseEnrollment.objects.filter(
            user=user,
            completed_at__isnull=False
        ).order_by('completed_at').first()
        milestone_events={
            'JOINED':user.date_joined,
            'FIRST_SESSION':first_session_date,
            'FIRST_POST':(
                first_post.created_at if first_post else None
            ),
            'FIRST_MESSAGE':(
                first_message.created_at if first_message else None
            ),
            'FIRST_ENROLLMENT':(
                first_enrollment.enrolled_at if first_enrollment else None
            ),
            'FIRST_COURSE':(
                first_completed_course.completed_at if first_completed_course else None
            )
        }
        with transaction.atomic():
            for milestone_type,completed_at in milestone_events.items():
                if completed_at is None:
                    continue
                milestone,created=UserMilestone.objects.get_or_create(
                    user=user,
                    milestone_type=milestone_type,
                    defaults={
                        'xp_awarded':500,
                        'completed_at':completed_at,
                    }
                )
                if created:
                    User.objects.filter(
                        pk=user.pk
                    ).update(
                        xp=F('xp')+milestone.xp_awarded
                    )
        user.refresh_from_db(fields=['xp'])
        earned_milestones={
            milestone.milestone_type:milestone
            for milestone in UserMilestone.objects.filter(
                user=user
            )
        }
        milestone_definitions=[
            ('JOINED','Joined SkillSwap'),
            ('FIRST_SESSION','Completed First Session'),
            ('FIRST_POST','Put Up First Post'),
            ('FIRST_MESSAGE','Sent First Message'),
            ('FIRST_ENROLLMENT','Enrolled In A Course'),
            ('FIRST_COURSE','Completed A Course'),
        ]
        milestones=[]
        for key,title in milestone_definitions:
            earned=earned_milestones.get('key')
            milestones.append({
                'key':key,
                'title':title,
                'completed':earned is not None,
                'date':(
                    earned.completed_at
                    if earned else None
                ),
                'xp':500,
                'xp_awarded':(
                    earned.xp_awarded if earned else None
                )
            })
        total_xp=user.xp
        user_badges=UserBadge.objects.filter(
            user=user
        ).select_related(
            'badge'
        )
        earned_badges={
            user_badge.badge_id:user_badge for user_badge in user_badges
        }
        badges=Badge.objects.filter(is_active=True)
        badge_data=[]
        for badge in badges:
            user_badge=earned_badges.get(badge.id)
            badge_data.append(
                {
                    'id':badge.id,
                    'name':badge.name,  
                    'slug':badge.slug,
                    'description':badge.description,
                    'icon':badge.icon,
                    'rarity':badge.rarity,
                    'earned':user_badge is not None,
                    'earned_at':(
                        user_badge.earned_at if user_badge else None
                    )
                }
            )
        total_badges=badges.count()
        earned_badges_count=user_badges.count()
        stats_data={
            'total_badges':total_badges,
            'earned_badges':earned_badges_count,
            'total_xp':total_xp,
        }
        return Response(
            {
                'stats':stats_data,
                'badges':badge_data,
                'milestones':milestones,
            },
            status=status.HTTP_200_OK,
        )

class AdminBadgeListCreateView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        badges=Badge.objects.all().prefetch_related('rules').annotate(awarded_count_db=Count('user_badges')).order_by('-created_at')
        search=request.query_params.get('search')
        rarity=request.query_params.get('rarity')
        status_filter=request.query_params.get('status')
        if search:
            badges=badges.filter(
                Q(name__icontains=search)|
                Q(description__icontains=search)
            )
        if rarity:
            badges=badges.filter(
                rarity=rarity.upper()
            )
        if status_filter=='active':
            badges=badges.filter(
                is_active=True
            )
        if status_filter=='inactive':
            badges=badges.filter(
                is_active=False
            )
        serializer=BadgeSerializer(
            badges,
            many=True,
        )
        return Response(
            {
                'count':badges.count(),
                'badges':serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def post(self,request):
        serializer=AdminBadgeCreateSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)
        badge=serializer.save()
        return Response(
            BadgeSerializer(badge).data,
            status=status.HTTP_201_CREATED,
        )

class AdminBadgeDetailView(APIView):
    permission_classes=[IsAdmin]
    def get_object(self,badge_id):
        return get_object_or_404(
            Badge.objects.prefetch_related('rules','user_badges__user'),
            id=badge_id,
        )
    def get(self,request,badge_id):
        badge=self.get_object(badge_id)
        serializer=BadgeSerializer(badge)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    def patch(self,request,badge_id):
        badge=self.get_object(badge_id)
        serializer=AdminBadgeUpdateSerializer(
            badge,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        badge=serializer.save()
        return Response(
            BadgeSerializer(badge).data,
            status=status.HTTP_200_OK,
        )
    def delete(self,request,badge_id):
        badge=self.get_object(
            badge_id
        )
        badge.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

class EvaluateMyBadgesView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        newly_earned=BadgeService.evaluate_user(request.user)
        return Response(
            {
                'message':'badge evaluation completed',
                'newly_earned':[
                    {
                        'id':badge.id,
                        'name':badge.name,
                        'xp_reward':badge.xp_reward
                    }
                    for badge in newly_earned
                ],
                'xp':request.user.xp,
                'current_streak':request.user.current_streak,
            },
            status=status.HTTP_200_OK,
        )