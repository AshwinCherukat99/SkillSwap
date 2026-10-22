from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError
from django.contrib.auth import get_user_model

from apps.mentors.models import Mentor

User=get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self,scope,receive,send):
        print("WEBSOCKET JWT MIDDLEWARE CALLED")
        print("SCOPE TYPE:", scope.get("type"))
        print("WEBSOCKET PATH:", scope.get("path"))
        scope['user']=AnonymousUser()
        scope['account_type']=None
        query_string=scope.get('query_string',b'').decode()
        query_params=parse_qs(query_string)
        token=query_params.get('token',[None])[0]
        print("JWT TOKEN RECEIVED:", bool(token))
        if token:
            try:
                access_token=AccessToken(token)
                account_type=access_token.get('account_type')
                if account_type=='MENTOR':
                    mentor_id=access_token.get('mentor_id')
                    if mentor_id:
                        mentor=await self.get_mentor(mentor_id)
                        if mentor:
                            scope['user']=mentor
                            scope['account_type']='MENTOR'
                else:
                    user_id=access_token.get('user_id')
                    if user_id:
                        user=await self.get_regular_user(user_id)
                        if user:
                            scope['user']=user
                            scope['account_type']='USER'
            except (InvalidToken,TokenError,KeyError,TypeError,ValueError) as e:
                print(
                    'JWT AUTH ERROR:',
                    type(e).__name__,
                    str(e)
                )
        return await super().__call__(
            scope,
            receive,
            send
        )
    @database_sync_to_async
    def get_regular_user(self,user_id):
        try:
            return User.objects.get(
                id=user_id,
                is_active=True
            )
        except User.DoesNotExist:
            return None
    @database_sync_to_async
    def get_mentor(self,mentor_id):
        try:
            return Mentor.objects.get(
                id=mentor_id,
                is_active=True,
            )
        except Mentor.DoesNotExist:
            return None