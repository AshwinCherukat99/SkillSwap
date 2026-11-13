from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .authentication import ChatbotJWTAuthentication
from .models import ChatConversation,ChatMessage
from .serializers import ChatConversationSerializer,ChatConversationCreateSerializer,ChatMessageCreateSerializer,ChatMessageSerializer
from .services.gemini_service import generate_chat_response
# Create your views here.

class ChatbotBaseView(APIView):
    authentication_classes=[ChatbotJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get_owner_filter(self,request):
        account_type=request.auth.get('account_type')
        if account_type=='MENTOR':
            return {
                'mentor':request.user,
                'account_type':'MENTOR'
            }
        elif account_type=='USER':
            return {
                'user':request.user,
                account_type:'USER'
            }
        return None
    def get_conversation(self,request,conversation_id):
        owner_filter=self.get_owner_filter(request)
        if owner_filter is None:
            return None
        try:
            return ChatConversation.objects.get(
                id=conversation_id,
                is_active=True,
                **owner_filter
            )
        except ChatConversation.DoesNotExist:
            return None

class ChatConversationListCreateView(ChatbotBaseView):
    def get(self,request):
        owner_filter=self.get_owner_filter(request)
        if owner_filter is None:
            return Response(
                {'error':'invalid account type'},
                status=status.HTTP_403_FORBIDDEN
            )
        conversations=ChatConversation.objects.filter(
            is_active=True,
            **owner_filter
        ).order_by('-updated_at')
        serializer=ChatConversationSerializer(
            conversations,
            many=True
        )
        return Response(serializer.data)
    def post(self,request):
        serializer=ChatConversationCreateSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        owner_filter=self.get_owner_filter(request)
        if owner_filter is None:
            return Response(
                {'error':'invalid account type'},
                status=status.HTTP_403_FORBIDDEN
            )
        title=serializer.validated_data.get('title','').strip()
        conversation=ChatConversation.objects.create(
            **owner_filter,
            title=title or 'New Conversation'
        )
        response_serializer=ChatConversationSerializer(
            conversation
        )
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class ChatConversationDetailView(ChatbotBaseView):
    def get(self,request,conversation_id):
        conversation=self.get_conversation(
            request,
            conversation_id
        )
        if conversation is None:
            return Response(
                {'error':'conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=ChatConversationSerializer(
            conversation
        )
        return Response(serializer.data)
    def delete(self,request,conversation_id):
        conversation=self.get_conversation(
            request,
            conversation_id
        )
        if conversation is None:
            return Response(
                {'error':'conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        conversation.is_active=False
        conversation.save(update_fields=['is_active','updated_at'])
        return Response(
            {'message':'conversation deleted successfully'},
            status=status.HTTP_200_OK
        )

class ChatMessageCreateView(APIView):
    def post(self,request,conversation_id):
        conversation=self.get_conversation(
                request,
                conversation_id
            )
        if conversation is None:
            return Response(
                {'error':'conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=ChatMessageCreateSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        user_content=serializer.validated_data['content']
        user_message=ChatMessage.objects.create(
            conversation=conversation,
            role=ChatMessage.Role.USER,
            content=user_content
        )
        if conversation.messages.count()==1:
            conversation.title=user_content[:60]
        conversation.save()
        history=list(
            conversation.messages.order_by('created_at').values(
                'role',
                'content'
            )
        )
        try:
            assistant_content=generate_chat_response(history)
            assistant_message=ChatMessage.objects.create(
                conversation=conversation,
                role=ChatMessage.Role.ASSISTANT,
                content=assistant_content
            )
            conversation.save()
        except Exception:
            print('skillswap chatbot gemini request failed') 
            return Response(
                {
                    'error':'ai assistant is temporarily unavailable',
                    'user_message':ChatMessageSerializer(
                        user_message
                    ).data
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        return Response(
            {
                'user_message':ChatMessageSerializer(
                    user_message
                ).data,
                'assistant_message':ChatMessageSerializer(
                    assistant_message
                ).data,
            },
            status=status.HTTP_200_OK
        )