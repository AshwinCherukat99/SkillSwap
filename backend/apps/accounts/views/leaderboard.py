from django.db.models import Avg, Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.models import User,UserRating
from apps.accounts.serializers.leaderboard import LeaderBoardUserSerializer

class LeaderBoardView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        users=(User.objects.filter(role=User.Role.USER).annotate(average_rating=Avg('received_rating__rating'),rating_count_value=Count('received_rating',distinct=True))).order_by('-xp','-current_streak','id')
        data=[]
        for index,user in enumerate(users,start=1):
            user.rank=index
            user.rating=(round(user.average_rating,1) if user.average_rating is not None else 0)
            user.rating_count=user.rating_count_value
            data.append(user)
        serializer=LeaderBoardUserSerializer(
            data,
            many=True
        )
        return Response(
            {
                'leaderboard':serializer.data
            },
            status=status.HTTP_200_OK
        )

class MyLeaderBoardRankView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        rank=(User.objects.filter(role=User.Role.USER,xp__gt=user.xp).count()+1)
        average_rating=(UserRating.objects.filter(rated_user=user).aggregate(average=Avg('rating')))['average']
        rating_count=(UserRating.objects.filter(rated_user=user).count())
        return Response(
            {
                'rank':rank,
                'xp':user.xp,
                'current_streak':user.current_streak,
                'level':(user.xp//500)+1,
                'rating':(
                    round(average_rating,1) if average_rating else 0
                ),
                'rating_count':rating_count
            }
        )