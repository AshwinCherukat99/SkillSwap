from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import (Conversation,ConversationMember,Message)

from .serializers import (MentorGroupSerializer,ChatMessageSerializer,ConversationMemberSerializer)

from apps.mentors.authentication import MentorJWTAuthentication

class MentorGroupListView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[MentorJWTAuthentication]
    def get(self,request):
        mentor=request.user
        conversations=Conversation.objects.filter(
            conversation_type=Conversation.ConversationType.GROUP,
            course__mentor=mentor,
            course__is_active=True,
        ).select_related('course').order_by('-updated_at')
        serializer=MentorGroupSerializer(
            conversations,
            many=True
        )
        return Response(serializer.data,status=status.HTTP_200_OK)

class ConversationMessagesView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[MentorJWTAuthentication]
    def get(self,request,conversation_id):
        mentor=request.user
        conversation=Conversation.objects.filter(
            id=conversation_id,
            course__mentor=mentor,
            conversation_type=Conversation.ConversationType.GROUP
        ).first()
        if not conversation:
            return Response(
                {
                    'detail':'conversation not found'
                },
                status=404
            )
        messages=Message.objects.filter(
            conversation=conversation,
            is_deleted=False,
        ).select_related(
            'sender_user',
            'sender_mentor',
        ).order_by('created_at')
        serializer=ChatMessageSerializer(
            messages,
            many=True
        )
        return Response(serializer.data,status=status.HTTP_200_OK)

class ConversationMembersView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[MentorJWTAuthentication]
    def get(self,request,conversation_id):
        mentor=request.user
        conversation=Conversation.objects.filter(
            id=conversation_id,
            course__mentor=mentor,
            conversation_type=Conversation.ConversationType.GROUP
        ).first()
        if not conversation:
            return Response({
                'detail':'conversation not found'
            },status=404)
        members=ConversationMember.objects.filter(
            conversation=conversation,
            is_active=True,
        ).select_related(
            'user',
            'mentor'
        )
        serializer=ConversationMemberSerializer(
            members,
            many=True
        )
        return Response(serializer.data,status=status.HTTP_200_OK)

class UserGroupListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        conversations=Conversation.objects.filter(
            conversation_type=Conversation.ConversationType.GROUP,
            course__is_active=True,
            members__user=user,
            members__is_active=True
        ).select_related('course').distinct().order_by('-updated_at')
        serializer=MentorGroupSerializer(
            conversations,
            many=True,
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class UserConversationMessagesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,conversation_id):
        user=request.user
        conversation=Conversation.objects.filter(
            id=conversation_id,
            conversation_type=Conversation.ConversationType.GROUP,
            members__user=user,
            members__is_active=True
        ).first()
        if not conversation:
            return Response(
                {
                    'detail':'conversation not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        messages=Message.objects.filter(
            conversation=conversation,
            is_deleted=False,
        ).select_related(
            'sender__user',
            'sender__mentor',
        ).order_by('created')
        serializer=ChatMessageSerializer(
            messages,
            many=True,
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class UserConversationMembersView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,conversation_id):
        user=request.user
        conversation=Conversation.objects.filter(
            id=conversation_id,
            conversation_type=Conversation.ConversationType.GROUP,
            members__user=user,
            members__is_active=True,
        ).first()
        if not conversation:
            return Response(
                {
                    'detail':'conversation not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        members=ConversationMember.objects.filter(
            conversation=conversation,
            is_active=True,
        ).select_related(
            'user',
            'mentor'
        )
        serializer=ConversationMemberSerializer(
            members,
            many=True,
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )