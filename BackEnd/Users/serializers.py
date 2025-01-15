from rest_framework import serializers
import re
from datetime import date
from Users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    date_of_birth = serializers.DateField()
    profile_image = serializers.ImageField(
        required=False)  # Optional profile image

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'username', 'last_name',
                  'date_of_birth', 'password', 'profile_image']

    # Validate password length and strength
    def validate_password(self, value):
        """
        Custom validation for the password field to ensure it meets certain criteria.
        """
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long.")
        # Uncomment these lines if you want additional password validation rules
        # if not any(char.isdigit() for char in value):
        #     raise serializers.ValidationError(
        #         "Password must contain at least one number.")
        # if not any(char.isupper() for char in value):
        #     raise serializers.ValidationError(
        #         "Password must contain at least one uppercase letter.")
        return value

    # Validate email using regex
    def validate_email(self, value):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zAZ0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError('Enter a valid email address.')
        return value

    # Validate the age limit of 18 years or older
    def validate_date_of_birth(self, value):
        today = date.today()
        age = today.year - value.year - \
            ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError(
                'You must be at least 18 years old to register.')
        return value

    # Create the user and hash the password
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()  # Save the user instance
        return user

    # Optional: Custom validation for profile_image
    def validate_profile_image(self, value):
        # You can add additional checks for image size or type here if needed
        if value.size > 5 * 1024 * 1024:  # Maximum image size: 5MB
            raise serializers.ValidationError("Image size must be under 5MB.")
        return value
