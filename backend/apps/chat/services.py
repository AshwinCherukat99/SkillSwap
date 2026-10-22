from django.db import transaction

from .models import Conversation,ConversationMember

@transaction.atomic
def create_skill_conversation(session):
    conversation,_=Conversation.objects.get_or_create(
        skill_exchange_session=session,
        defaults={
            'conversation_type':Conversation.ConversationType.VIDEO_CALL,
            'name':f'Skill Exchange Session {session.id}'
        }
    )
    if conversation.conversation_type!=Conversation.ConversationType.VIDEO_CALL:
        conversation.conversation_type=Conversation.ConversationType.VIDEO_CALL
        conversation.save(update_fields=['conversation_type'])
    for user in (session.requester,session.recipient):
        membership,created=ConversationMember.objects.get_or_create(
            conversation=conversation,
            user=user,
            defaults={'is_active':True}
        )
        if not membership.is_active:
            membership.is_active=True
            membership.left_at=None
            membership.save(update_fields=['is_active','left_at'])
    return conversation

@transaction.atomic
def create_course_conversation(session):
    conversation,_=Conversation.objects.get_or_create(
        course_session=session,
        defaults={
            'conversation_type':Conversation.ConversationType.VIDEO_CALL,
            'name':'Course Session - {session.id}'
        }
    )
    if conversation.conversation_type!=Conversation.ConversationType.VIDEO_CALL:
        conversation.conversation_type=Conversation.ConversationType.VIDEO_CALL
        conversation.save(update_fields=['conversation_type'])
    participants=(
        ('user',session.enrollment.user),
        ('mentor',session.mentor),
    )
    for member_type,participant in participants:
        lookup={
            'conversation':conversation,
            member_type:participant,
        }
        membership,created=ConversationMember.objects.get_or_create(
            **lookup,
            defaults={'is_active':True}
        )
        if not membership.is_active:
            membership.is_active=True
            membership.left_at=None
            membership.save(update_fields=['is_active','left_at'])
    return conversation