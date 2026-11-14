from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import Mentor 

class MentorJWTAuthentication(JWTAuthentication):
    def get_user(self,validated_token):
        mentor_id=validated_token.get('mentor_id')  
        account_type=validated_token.get('account_type')
        if account_type!='MENTOR' or not mentor_id: 
            raise AuthenticationFailed(
                'invalid mentor authentication token',
                code='invalid_token',
            )
        try:
            mentor=Mentor.objects.get(
                id=mentor_id,
                is_active=True,
            )
        except Mentor.DoesNotExist:
            raise AuthenticationFailed(
                'Mentor account not found',
                code='user_not_found',
            )
        return mentor

class ChatJWTAuthentication(JWTAuthentication):
    def authenticate(self,request):
        header=self.get_header(request)
        if header is None:
            return None
        raw_token=self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token=self.get_validated_token(raw_token)
        account_type=validated_token.get('account_type')
        if account_type=='MENTOR':
            mentor_auth=MentorJWTAuthentication()
            user=mentor_auth.get_user(validated_token)
        else:
            user=self.get_user(validated_token)
        return (user,validated_token)

class DualAccountJWTAuthentication(JWTAuthentication):
    def authenticate(self,request):
        header=self.get_header(request)
        if header is None:
            return None
        raw_token=self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token=self.get_validated_token(raw_token)
        account_type=validated_token.get('account_type')
        if account_type=='MENTOR':
            user=MentorJWTAuthentication().get_user(
                validated_token
            )
        else:
            user=super().get_user(
                validated_token
            )
        return (user,validated_token)