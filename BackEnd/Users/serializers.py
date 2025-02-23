from rest_framework import serializers
from datetime import date
import re
from Users.models import Follow, Profile, User
from datetime import date
from rest_framework import serializers
from .models import Profile, Follow, UserSettings, UserBlock
from django.contrib.auth.password_validation import validate_password


class UserProfileSerializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField()
    is_own_profile = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'profile_image',
            'followers_count',
            'following_count',
            'is_followed',
            'post_count',
            'bio',
            'is_own_profile',
        ]

    def validate_date_of_birth(self, value):
        today = date.today()
        age = today.year - value.year - \
            ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError(
                "You must be at least 18 years old to register.")
        return value

    def get_is_followed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, followed=obj.user).values_list('id', flat=True).exists()
        return False

    def get_is_own_profile(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request, "user") or request.user.is_anonymous:
            return False  # Return False if there's no valid request or user
        return obj.user == request.user


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    profile = UserProfileSerializer(read_only=True)
    is_blocked_by_current_user = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username',
                  'password', 'profile', 'date_joined', 'is_blocked_by_current_user', 'auth_provider']

    def validate_password(self, value):
        """
        Validate that the password is at least 8 characters long.
        """
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long.")
        return value

    def validate_email(self, value):
        """
        Validate that the email format is correct.
        """
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def create(self, validated_data):
        """
        Create a new user and hash the password before saving.
        """
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def get_is_blocked_by_current_user(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request, "user") or request.user.is_anonymous:
            return None  # Return None if there's no valid request or user

        return UserBlock.objects.filter(blocker=request.user, blocked=obj).exists()


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = '__all__'
        read_only_fields = ['user']


class UserBlockSerializer(serializers.ModelSerializer):
    blocker = UserSerializer(read_only=True)
    blocked = UserSerializer(read_only=True)

    class Meta:
        model = UserBlock
        fields = "__all__"


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        """Check if the old password is correct."""
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password.")
        return value

    def validate_new_password(self, value):
        """Validate new password against Django's password validators."""
        validate_password(value)
        return value
