from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import CourseEnrollment
from .services.chat import create_course_study_group

from apps.chat.models import ConversationMember

@receiver(post_save,sender=CourseEnrollment)
def add_student_to_course_group(sender,instance,created,**kwargs):
    if not created:
        return
    conversation=create_course_study_group(instance.course)
    ConversationMember.objects.get_or_create(
        conversation=conversation,
        user=instance.user,
    )