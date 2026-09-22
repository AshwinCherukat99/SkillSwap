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