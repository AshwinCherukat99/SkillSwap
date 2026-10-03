from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.permissions import IsAdmin
from django.db.models import Count,Q
from django.shortcuts import get_object_or_404

from .models import UserBadge,Badge
from .serializers.initialization import BadgeSerializer
from .serializers.admin import AdminBadgeCreateSerializer,AdminBadgeUpdateSerializer

class BadgeDashboardView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
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
        }
        first_badge=UserBadge.objects.filter(
            user=user
        ).order_by(
            'earned_at'
        ).first()
        milestones=[
            {
                'title':'Joined SkillSwap',
                'completed':True,
                'date':user.date_joined,
            },
            {
                'title':'Completed First Session',
                'completed':False,
                'date':None,
            },
            {
                'title':'Achieved First Badge',
                'completed':first_badge is not None,
                'date':(
                    first_badge.earned_at if first_badge else None
                )
            }
        ]
        return Response(
            {
                'stats':stats_data,
                'badges':badge_data,
            },
            status=status.HTTP_200_OK,
        )

class AdminBadgeListCreateView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
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
    permission_classes=[IsAuthenticated]
    authentication_classes=[IsAdmin]
    def get_object(self,badge_id):
        return get_object_or_404(
            Badge.objects.prefetch_related('rules'),
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