from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..models import Friendship
from ..serializers.friends import FriendSerializer

class FriendsListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        friendships=Friendship.objects.filter(
            Q(sender=user)|Q(receiver=user),
            status=Friendship.Status.ACCEPTED,
        ).select_related('sender','receiver')
        friends=[]
        for friendship in friendships:
            if friendship.sender==user:
                friend=friendship.receiver
            else:
                friend=friendship.sender
            friends.append(
                {
                    'user':friend,
                    'friendship':friendship,
                }
            )
        return Response(
            {
                'friends':FriendSerializer(
                    friends,
                    many=True,
                    context={'request':request}
                ).data
            },
            status=status.HTTP_200_OK,
        )