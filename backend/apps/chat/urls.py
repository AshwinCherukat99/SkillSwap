from django.urls import path

from .views import (MentorGroupListView,ConversationMembersView,ConversationMessagesView,UserConversationMembersView,UserConversationMessagesView,UserGroupListView)

urlpatterns=[
    path(
        'mentor/groups/',
        MentorGroupListView.as_view(),
        name='mentor-chat-groups',
    ),
    path(
        'mentor/conversations/<int:conversation_id>/messages/',
        ConversationMessagesView.as_view(),
        name='conversation-messages',
    ),
    path(
        'mentor/conversations/<int:conversation_id>/members/',
        ConversationMembersView.as_view(),
        name='conversation-members',
    ),
    path(
        'groups/',
        UserGroupListView.as_view(),
        name='user-group-list',
    ),
    path(
        'conversations/<int:conversation_id>/messages/',
        UserConversationMessagesView.as_view(),
        name='user-conversation-messages',
    ),
    path(
        'conversations/<int:conversation_id>/members/',
        UserConversationMembersView.as_view(),
        name='user-conversation-members',
    ),
]