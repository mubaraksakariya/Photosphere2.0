from rest_framework import serializers
from datetime import date
from Users.models import Profile, User


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
            return request.user.followers.filter(follower=request.user).exists()
        return False

    def get_is_own_profile(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj == request.user
        return False


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'username',
                  'password', 'profile', 'date_joined']

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
