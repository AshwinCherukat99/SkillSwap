from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.exceptions import AuthenticationFailed

from apps.accounts.models import User
from apps.mentors.models import Mentor

class ChatbotJWTAuthentication(JWTAuthentication):
    def get_user(self,validated_token):
        account_type=validated_token.get('account_type')
        if account_type=='MENTOR':
            mentor_id=validated_token.get('mentor_id')
            if not mentor_id:
                raise AuthenticationFailed(
                    'invalid mentor authentication token',
                    code='invalid_token'
                )
            try:
                return Mentor.objects.get(
                    id=mentor_id,
                    is_active=True
                )
            except Mentor.DoesNotExist:
                raise AuthenticationFailed(
                    'mentor account not found',
                    code='user_not_found'
                )
        elif account_type=='USER':
            user_id=validated_token.get('user_id')
            if not user_id:
                raise AuthenticationFailed(
                    'invalid user authentication token',
                    code='invalid_token'
                )
            try:
                return User.objects.get(
                    id=user_id,
                    is_active=True,
                )
            except User.DoesNotExist:
                raise AuthenticationFailed(
                    'user account not found',
                    code='user_not_found'
                )
        raise AuthenticationFailed(
            'invalid account type',
            code='invalid_token'
        )