from apps.chat.models import Conversation,ConversationMember

def create_course_study_group(course):
    conversation,created=Conversation.objects.get_or_create(
        course=course,
        defaults={
            'conversation_type':Conversation.ConversationType.GROUP,
            'name':f'{course.title}-study group'
        }
    )
    if created:
        ConversationMember.objects.create(
            conversation=conversation,
            mentor=course.mentor,
        )
    return conversation