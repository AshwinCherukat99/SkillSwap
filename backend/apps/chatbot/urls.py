from django.urls import path
from .views import (
    ChatConversationListCreateView,
    ChatConversationDetailView,
    ChatMessageCreateView
)

urlpatterns=[
    path(
        'conversations/',
        ChatConversationListCreateView.as_view(),
        name='chatbot-conversations'
    ),
    path(
        'conversations/<int:conversation_id>/',
        ChatConversationDetailView.as_view(),
        name='chatbot-conversation-detail'
    ),
    path(
        'conversations/<int:conversation_id>/messages/',
        ChatMessageCreateView.as_view(),
        name='chatbot-send-message'
    )
]