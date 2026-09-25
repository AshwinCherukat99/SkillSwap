from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ..models import Friendship
from ..serializers.friends import FriendSerializer,AddFriendSerializer,FriendRequestSerializer

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
                friend
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

class AddFriendView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=AddFriendSerializer(
            data=request.data,
            context={
                'request':request
            }
        )
        serializer.is_valid(raise_exception=True)
        friendship=serializer.save()
        return Response(
            {
                'message':'friend request sent successfully',
                'friendship':{
                    'id':friendship.id,
                    'sender':friendship.sender.id,
                    'receiver':friendship.receiver.id,
                    'status':friendship.status,
                    'created_at':friendship.created_at,
                }
            },
            status=status.HTTP_201_CREATED,
        )

class AcceptFriendRequestView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,request_id):
        friendship=get_object_or_404(
            Friendship,
            id=request_id,
            receiver=request.user,
            status=Friendship.Status.PENDING
        )
        friendship.status=Friendship.Status.ACCEPTED
        friendship.accepted_at=timezone.now()
        friendship.save(
            update_fields=[
                'status',
                'accepted_at',
            ]
        )
        return Response(
            {
                'message':'friend request accepted',
            },
            status=status.HTTP_200_OK,
        )

class RejectFriendRequestView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,request_id):
        friendship=get_object_or_404(
            Friendship,
            id=request_id,
            receiver=request.user,
            status=Friendship.Status.PENDING,
        )
        friendship.status=Friendship.Status.REJECTED
        friendship.save(update_fields=['status'])
        return Response(
            {
                'message':'friend request rejected'
            },
            status=status.HTTP_200_OK,
        )

class FriendRequestListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        requests=Friendship.objects.filter(
            receiver=request.user,
            status=Friendship.Status.PENDING,
        ).select_related('sender').order_by('-created_at')
        serializer=FriendRequestSerializer(
            requests,
            many=True,
            context={'request':request}
        )
        return Response(
            {
                'requests':serializer.data
            },
            status=status.HTTP_200_OK,
        )