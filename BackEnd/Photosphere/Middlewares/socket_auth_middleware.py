from channels.middleware import BaseMiddleware
from jwt import decode as jwt_decode, InvalidTokenError
from channels.db import database_sync_to_async


class SocketJWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser
        from django.contrib.auth import get_user_model

        User = get_user_model()
        # Get the token from query params or headers
        token = None
        query_string = scope.get('query_string', b'').decode('utf-8')
        headers = dict(scope['headers'])

        # Check for token in query string
        if query_string:
            query_params = dict(param.split('=')
                                for param in query_string.split('&'))
            token = query_params.get('token')

        # Check for token in headers
        if not token and b'authorization' in headers:
            auth_header = headers[b'authorization'].decode('utf-8')
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        # Validate the token
        scope['user'] = AnonymousUser()
        if token:
            try:
                scope['user'] = await self.get_user(token) if token else AnonymousUser()
            except (InvalidTokenError, User.DoesNotExist):
                pass  # Token is invalid or user doesn't exist

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token_key):
        from django.contrib.auth.models import AnonymousUser
        from rest_framework_simplejwt.tokens import AccessToken
        from django.contrib.auth import get_user_model

        User = get_user_model()

        try:
            token = AccessToken(token_key)
            user_id = token['user_id']
            return User.objects.get(pk=user_id)
        except Exception:
            return AnonymousUser()
