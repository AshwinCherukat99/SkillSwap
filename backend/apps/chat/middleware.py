from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError
from django.contrib.auth import get_user_model

User=get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self,scope,receive,send):
        scope['user']=AnonymousUser()
        query_string=scope.get('query_string',b'').decode()
        query_params=parse_qs(query_string)
        token=query_params.get('token',[None])[0]
        print("JWT TOKEN RECEIVED:", bool(token))
        if token:
            try:
                access_token=AccessToken(token)
                user_id=access_token['user_id']
                print("JWT USER ID:", user_id)
                user=await self.get_user(user_id)
                if user:
                    scope['user']=user
                    print("JWT USER AUTHENTICATED:", user)
                else:
                    print("JWT USER NOT FOUND")
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
    def get_user(self,user_id):
        try:
            return User.objects.get(
                id=user_id,
                is_active=True
            )
        except User.DoesNotExist:
            return None