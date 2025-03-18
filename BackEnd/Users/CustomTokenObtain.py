from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers

from Users.models import User
from Users.serializers import UserSerializer


class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        request = self.context.get('request')
        username = attrs.get('username')
        password = attrs.get('password')
        if not username or not password:
            raise AuthenticationFailed(
                'Must include "username" or "email" and "password"')

        # Check if the username is an email or regular username
        user = None
        if '@' in username:  # If the username looks like an email address
            user = User.objects.filter(email=username).first()
        else:
            user = User.objects.filter(username=username).first()
        print(user)
        if not user or not user.check_password(password):
            raise AuthenticationFailed('Invalid credentials....')
        if not user.is_active:
            raise AuthenticationFailed('User is not active')
        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(user, context={'request': request}).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
