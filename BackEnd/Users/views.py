from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Users.models import Follow, Profile, User
from Users.services import follow_user, get_or_create_user, get_suggested_users, get_user, send_otp_email, validate_otp, verify_google_id_token
from .serializers import UserProfileSerializer, UserSerializer
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
import logging
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from requests.exceptions import RequestException


# Set up logging for the view
logger = logging.getLogger(__name__)


class SignupView(APIView):
    def post(self, request):
        user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
        }
        profile_data = {
            'first_name': request.data.get('first_name', ''),
            'last_name': request.data.get('last_name', ''),
            'profile_image': request.data.get('profile_image', None),
        }

        serializer = UserSerializer(data=user_data)

        try:
            if serializer.is_valid():
                # Save the user to the database if valid
                user = serializer.save()

                # Update profile with additional data
                profile = user.profile  # Automatically created by signal
                profile.first_name = profile_data['first_name']
                profile.last_name = profile_data['last_name']
                if profile_data['profile_image']:
                    profile.profile_image = profile_data['profile_image']
                profile.save()

                # Send OTP email through service
                send_otp_email(user)

                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

            else:
                # Return validation errors
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            # Handle duplicate email or username errors
            logger.error(f"IntegrityError: {e}")
            return Response({"errors": {"email": ["This email is already registered"]}},
                            status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            # Handle custom validation exceptions
            logger.error(f"ValidationError: {e}")
            return Response({"errors": {"message": "Invalid data provided."}}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle unexpected errors
            logger.exception(f"Unexpected error occurred: {e}")
            return Response({"message": "An unexpected error occurred. Please try again later."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            code = request.data.get('otp')

            if not email or not code:
                raise ValidationError("Email and OTP are required.")

            # Fetch user by email
            user = get_user(email)
            if user.is_verified:
                raise ValidationError("User is already verified.")
            # Validate OTP
            validate_otp(user, code)

            # Mark user as verified
            user.is_verified = True
            user.save()

            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)

        except ValidationError as ve:
            return Response({"detail": ve.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendOTPView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                raise ValidationError("Email is required.")

            user = get_user(email)
            if user.is_verified:
                raise ValidationError("User is already verified.")

            send_otp_email(user)
            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)

        except ValidationError as ve:
            print(ve.__str__())
            return Response({"detail": ve.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"detail": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GoogleSignInView(APIView):
    def post(self, request):
        try:
            token = self.get_token(request)
            id_info = self.verify_token(token)
            if not id_info:
                return self.invalid_token_response()

            email, first_name, last_name, profile_image_url, birthdate = self.extract_user_info(
                id_info)
            user, profile = get_or_create_user(
                email, first_name, last_name, birthdate)
            self.update_profile_image(user, profile_image_url)
            self.update_user_verified_status(user, id_info)

            refresh = RefreshToken.for_user(user)
            serializedUser = UserSerializer(
                user, context={'request': request}).data
            print(user.profile)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializedUser
            })

        except ValidationError as ve:
            print(ve)
            return self.validation_error_response(ve)
        except Exception as e:
            print(f"Error in GoogleSignInView: {e}")
            return Response({"detail": "An error occurred during sign in."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_token(self, request):
        """Extract token from the request data"""
        token = request.data.get('token')
        if not token:
            raise ValidationError("ID token is required.")
        return token

    def verify_token(self, token):
        """Verify the Google ID token and return the info"""
        return verify_google_id_token(token)

    def invalid_token_response(self):
        """Return an error response for invalid token"""
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

    def extract_user_info(self, id_info):
        """Extract relevant user info from the Google ID token"""
        email = id_info.get('email')
        first_name = id_info.get('given_name', 'first_name')
        last_name = id_info.get('last_name', 'last_name')
        profile_image_url = id_info.get("picture")
        birthdate = id_info.get('birthdate') or None
        return email, first_name, last_name, profile_image_url, birthdate

    def update_profile_image(self, user, profile_image_url):
        """Update the profile image if available"""
        if profile_image_url:
            try:
                response = requests.get(profile_image_url, stream=True)
                if response.status_code == 200:
                    content = response.raw.read()
                    # Check if user has default image or no image
                    if not user.profile or not user.profile.profile_image:
                        file = ContentFile(content, name=f"{user.email}.jpg")
                        user.profile.profile_image = file
                        user.profile.save()  # Save after profile picture update
                        user.save()
            except RequestException as e:
                print(f"Error downloading profile image: {e}")
                # Log the error but don't propagate to the user

    def update_user_verified_status(self, user, id_info):
        """Update user's verification status"""
        user.is_verified = id_info.get('email_verified', False)
        user.save()

    def validation_error_response(self, ve):
        """Handle validation errors"""
        return Response({"detail": ve.detail}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='suggested_users')
    def suggested_users(self, request, *args, **kwargs):
        current_user = request.user
        users = get_suggested_users(current_user)
        suggested_users = self.get_serializer(users, many=True).data

        return Response({'suggested_users': suggested_users}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='toggle-follow')
    def toggle_follow_user(self, request):
        current_user = request.user
        user_id = request.data.get('user_id')

        # Validate user_id presence
        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_follow = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid User ID.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            follow_data = follow_user(
                follower=current_user, followed=user_to_follow)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'error': 'An internal error occurred while processing the request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        is_following = follow_data.get('status') == 'followed'
        return Response({'is_following': is_following}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='check-follow')
    def is_following(self, request, pk=None):
        try:
            followed = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        is_following = Follow.objects.filter(
            follower=request.user, followed=followed).exists()
        return Response({'is_followed': is_following}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='user-profile')
    def user_profile(self, request, pk=None):
        try:
            # Attempt to retrieve the user by their ID
            user = get_object_or_404(User, id=pk)

            # Serialize the user data
            serialized_user = self.get_serializer(user).data

            # Return success response with serialized data
            return Response({'user': serialized_user}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            # Explicitly handle the case where the user is not found (extra clarity)
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # Handle unexpected errors and log them for debugging purposes
            return Response(
                {'error': 'An unexpected error occurred.', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
