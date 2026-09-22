from django.contrib.auth.backends import BaseBackend
from .models import Mentor

class MentorEmailBackend(BaseBackend):
    def authenticate(self,request,username=None,password=None,**kwargs):
        email=kwargs.get('email') or username
        if not email or not password:
            return None
        try:
            mentor=Mentor.objects.get(email=email)
        except Mentor.DoesNotExist:
            return None
        if not mentor.is_active: 
            return None
        if mentor.check_password(password):
            return mentor
        return None
    def get_user(self,user_id):
        try:
            return Mentor.objects.get(pk=user_id)
        except Mentor.DoesNotExist:
            return None