from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.renderers import JSONRenderer
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import (Conversation,ConversationMember,Message,MessageAttachment)
from apps.mentors.models import Mentor
from apps.accounts.models import User
from apps.courses.models import CourseEnrollment

from .serializers import (MentorGroupSerializer,ChatMessageSerializer,ConversationMemberSerializer,ConversationSerializer)

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
            'sender_user',
            'sender_mentor',
        ).order_by('created_at')
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

class ConversationListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        conversations=(Conversation.objects.filter(conversation_type=Conversation.ConversationType.DIRECT,members__user=user,members__is_active=True).distinct().prefetch_related('members').order_by('-updated_at'))
        serializer=ConversationSerializer(
            conversations,
            many=True,
            context={'request':request}
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class DirectConversationMessagesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,conversation_id):
        conversation=get_object_or_404(
            Conversation,
            id=conversation_id,
        )
        is_member=ConversationMember.objects.filter(
            conversation=conversation,
            user=request.user,
            is_active=True,
        ).exists()
        if not is_member:
            return Response(
                {
                    'detail':'you are not a member of this conversation'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        messages=(Message.objects.filter(conversation=conversation).select_related('sender_user','sender_mentor').order_by('created_at'))
        print(
    "MESSAGE HISTORY:",
    list(
        messages.values(
            'id',
            'conversation_id',
            'content'
        )
    )
        )
        serializer=ChatMessageSerializer(
            messages,
            many=True,
            context={'request':request}
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class DirectConversationView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        other_user_id=request.data.get('user_id')
        if not other_user_id:
            return Response(
                {
                    'error':'user id is required'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if int(other_user_id)==request.user.id:
            return Response(
                {
                    'error':'you cannot start a conversation with yourself'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        other_user=get_object_or_404(
            User,
            id=other_user_id
        )
        conversation=(Conversation.objects.filter(
            conversation_type=Conversation.ConversationType.DIRECT,
            members__user=request.user,
            members__is_active=True,
        ).filter(
            members__user=other_user,
            members__is_active=True
        ).distinct().first())
        if not conversation:
            conversation=Conversation.objects.create(
                conversation_type=Conversation.ConversationType.DIRECT,
            )
            ConversationMember.objects.create(
                conversation=conversation,
                user=request.user
            )
            ConversationMember.objects.create(
                conversation=conversation,
                user=other_user,
            )
        return Response(
            {
                'id':conversation.id,
                'conversation_type':conversation.conversation_type
            },
            status=status.HTTP_200_OK,
        )

class MentorConversationListView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[MentorJWTAuthentication]
    def get(self,request):
        mentor=request.user
        conversations=(Conversation.objects.filter(
            conversation_type=Conversation.ConversationType.DIRECT,
            members__mentor=mentor,
            members__is_active=True
        ).distinct().prefetch_related('members__user','members__mentor').order_by('-updated_at'))
        serializer=ConversationSerializer(
            conversations,
            many=True,
            context={'request':request}
        )
        print("SERIALIZED CONVERSATIONS:", serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class MentorDirectConversationMessagesView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[MentorJWTAuthentication]
    def get(self,request,conversation_id):
        mentor=request.user
        conversation=(Conversation.objects.filter(
            id=conversation_id,
            conversation_type=Conversation.ConversationType.DIRECT,
            members__mentor=mentor,
            members__is_active=True
        ).first())
        if not conversation:
            return Response(
                {
                    'detail':'conversation not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        messages=(Message.objects.filter(
            conversation=conversation,
            is_deleted=False,
        ).select_related('sender_user','sender_mentor').order_by('created_at'))
        serializer=ChatMessageSerializer(
            messages,
            many=True,
            context={'request':request}
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class MentorStartDirectChatView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        mentor=request.user
        student_id=request.data.get('user_id')
        if not student_id:
            return Response(
                {
                    'detail':'user_id is required'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        is_enrolled=CourseEnrollment.objects.filter(
            user_id=student_id,
            course__mentor=mentor,
            course__is_active=True,
        ).exists()
        if not is_enrolled:
            return Response(
                {
                    'detail':'student is not enrolled in your courses'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        conversation=(
            Conversation.objects.filter(
                conversation_type=Conversation.ConversationType.DIRECT,
                members__mentor=mentor,
                members__is_active=True
            ).filter(
                members__user_id=student_id,
                members__is_active=True,
            ).distinct().first()
        )
        if conversation:
            return Response(
                {
                    'id':conversation.id,
                    'conversation_type':conversation.conversation_type
                },
                status=status.HTTP_200_OK,
            )
        conversation=Conversation.objects.create(
            conversation_type=Conversation.ConversationType.DIRECT
        )
        ConversationMember.objects.create(
            conversation=conversation,
            mentor=mentor,
        )
        ConversationMember.objects.create(
            conversation=conversation,
            user_id=student_id,
        )
        return Response(
            {
                'id':student_id,
                'conversation_type':conversation.conversation_type
            },
            status=status.HTTP_201_CREATED
        )

class ChatAttachmentUploadView(APIView):
    parser_classes=[MultiPartParser,FormParser]
    permission_classes=[IsAuthenticated]
    @transaction.atomic
    def post(self,request,conversation_id):
        user=request.user
        uploaded_files=request.FILES.getlist('files')
        content=request.data.get('content','').strip()
        if not uploaded_files:
            return Response(
                {
                    'detail':'please select at least one file'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(uploaded_files)>5:
            return Response(
                {
                    'detail':'you can upload at most 5 files per message'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        conversation=Conversation.objects.filter(
            id=conversation_id
        ).first()
        if not conversation:
            return Response(
                {
                    'detail':'conversation not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if isinstance(user,Mentor):
            mentor=user
        else:
            mentor=None
        membership_filter={
            'conversation':conversation,
            'is_active':True,
        }
        if mentor:
            membership_filter['mentor']=mentor
        else:
            membership_filter['user']=user
        is_member=ConversationMember.objects.filter(
            **membership_filter
        ).exists()
        if not is_member:
            return Response(
                {
                    'detail':'you are not a member of this conversation'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        max_size=10*1024*1024
        for file in uploaded_files:
            if file.size>max_size:
                return Response(
                    {
                        'detail':f'{file.name} exceeds 10mb size limit'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        if mentor:
            message=Message.objects.create(
                conversation=conversation,
                sender_mentor=mentor,
                content=content
            )
        else:
            message=Message.objects.create(
                conversation=conversation,
                sender_user=user,
                content=content,
            )
        for file in uploaded_files:
            MessageAttachment.objects.create(
                message=message,
                file=file,
                original_name=file.name[:255],
                file_size=file.size,
            )
        serialized_message=ChatMessageSerializer(
            message,
            context={'request':request}
        ).data
        message_data=json.loads(
            JSONRenderer().render(serialized_message)
        )
        channel_layer=get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{conversation_id}',{
                'type':'chat_message',
                'message':message_data
            }
        )
        return Response(
            serialized_message,
            status=status.HTTP_201_CREATED,
        )

class VideoCallDetailsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,conversation_id):
        try:
            conversation=Conversation.objects.select_related(
                'course_session__enrollment__user',
                'course_session__enrollment__course',
                'course_session__mentor',
                'skill_exchange_session__requester',
                'skill_exchange_session__recipient',
            ).get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(
                {
                    'detail':'conversation not found'
                },status=status.HTTP_404_NOT_FOUND,
            )
        if conversation.skill_exchange_session_id:
            session=conversation.skill_exchange_session
            participant_ids={
                session.requester_id,
                session.recipient_id,
            }
            if request.user.id not in participant_ids:
                return Response(
                    {
                        'detail':'you are not a participant in this session'
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            remote_user=(
                session.recipient 
                if request.user.id==session.requester_id
                else session.requester
            )
            session_type='SKILL_EXCHANGE'
        elif conversation.course_session_id:
            session=conversation.course_session
            is_student=session.enrollment.user_id==request.user.id
            is_mentor=(
                getattr(request.user,'role',None)=='MENTOR'
                and session.mentor_id==request.user.id
            )
            if not (is_student or is_mentor):
                return Response(
                    {
                        'detail':'you are not a participant in this session'
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            if is_mentor:
                remote_user=session.enrollment.user
            else:
                remote_user=session.mentor
            session_type='COURSE'
        else:
            return Response(
                {
                    'detail':'no session is linked to this conversation'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'conversation_id':conversation.id,
                'session_type':session_type,
                'duration_minutes':session.duration_minutes,
                'scheduled_start':session.scheduled_start,
                'actual_started_at':session.actual_started_at,
                'current_username':request.user.username,
                'remote_username':remote_user.username,
                'status':session.status,
            }
        )