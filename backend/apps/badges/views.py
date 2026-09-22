from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserBadge,Badge

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