from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Users.models import Follow, User
from Users.services import follow_user, get_suggested_users, get_user, send_otp_email, validate_otp, verify_google_id_token
from .serializers import UserSerializer
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


# Set up logging for the view
logger = logging.getLogger(__name__)


class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        try:
            if serializer.is_valid():
                # Save the user to the database if valid
                user = serializer.save()
                # Send OTP email through service
                send_otp_email(user)
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            else:
                # Log the validation errors for debugging purposes
                logger.error(f"Validation failed: {serializer.errors}")
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            # Handle duplicate email error or any other unique constraint violations
            logger.error(f"IntegrityError: {e}")
            print(e)
            return Response({"errors": {'email': ["This email is already registered"]}},
                            status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({"message": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # General exception handling (database issues, other errors)
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
            token = request.data.get('token')
            if not token:
                raise ValidationError("ID token is required.")

            id_info = verify_google_id_token(token)
            if id_info:
                email = id_info.get('email')
                first_name = id_info.get('given_name') or 'first_name'
                last_name = id_info.get('last_name') or 'last_name'
                profile_image_url = id_info.get("picture")
                birthdate = id_info.get('birthdate')

                if not birthdate:
                    birthdate = None

                # Get or create user
                user, created = User.objects.get_or_create(username=email, defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'date_of_birth': birthdate,
                })

                if profile_image_url:
                    # stream for larger files
                    response = requests.get(profile_image_url, stream=True)
                    if response.status_code == 200:
                        content = response.raw.read()  # read the content once
                        # Check if user has default image or no image
                        if not user.profile_image or user.profile_image.name == 'profile_images/default_profile.png':
                            # use content and a name
                            file = ContentFile(content, name=f"{email}.jpg")
                            user.profile_image = file
                            user.save()  # important to save the user after the profile picture update

                user.is_verified = id_info.get('email_verified')
                user.save()

                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user, context={'request': request}).data
                })
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as ve:
            return Response({"detail": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Print full exception for debugging
            print(f"Error in GoogleSignInView: {e}")
            return Response({"detail": "An error occurred during sign in."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_follow = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        follow_data = follow_user(
            follower=current_user, followed=user_to_follow)

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
        return Response({'is_following': is_following}, status=status.HTTP_200_OK)
