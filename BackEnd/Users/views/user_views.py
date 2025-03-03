from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Users.models import Follow, FollowRequest, User
from Users.services import follow_user, get_all_followers, get_all_followings, get_or_create_google_user, get_suggested_users, get_user, send_otp_email, validate_otp, verify_google_id_token
from Users.serializers import ChangePasswordSerializer, UserSerializer
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
import logging
from django.core.files.base import ContentFile
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from requests.exceptions import RequestException
from django.db.models import Q
from django.contrib.auth.password_validation import validate_password


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
            print(f"IntegrityError: {e}")
            return Response({"errors": {"email": ["This email is already registered"]}},
                            status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            # Handle custom validation exceptions
            print(f"ValidationError: {e}")
            return Response({"errors": {"message": "Invalid data provided."}}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle unexpected errors
            print(f"Unexpected error occurred: {e}")
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
            user, profile = get_or_create_google_user(
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
        """
        Filters the queryset by excluding the current user and admin users.
        Optionally filters by 'search' query parameter.
        """
        queryset = super().get_queryset()
        current_user = self.request.user

        # Exclude the current user and admin users
        queryset = queryset.exclude(Q(id=current_user.id) | Q(
            is_staff=True) | Q(is_superuser=True))

        # Apply search filter if provided
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(username__icontains=search_query) |
                Q(email__icontains=search_query)
            )
        return queryset

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
                request, follower=current_user, followed=user_to_follow)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'error': 'An internal error occurred while processing the request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'follow_data': follow_data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='check-follow')
    def is_following(self, request, pk=None):
        followed_user = get_object_or_404(User, id=pk)
        follow_status = "none"

        # Check if following
        if Follow.objects.filter(follower=request.user, followed=followed_user).exists():
            follow_status = "followed"
        elif FollowRequest.objects.filter(requester=request.user, target=followed_user, status='pending').exists():
            follow_status = "requested"

        return Response({
            "follow_status": follow_status}, status=status.HTTP_200_OK)

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

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Custom action to search for users by username or email.
        Excludes current user and admin users.
        """
        search_query = request.query_params.get('search', None)
        if not search_query:
            return Response({"error": "Please provide a search query parameter"}, status=400)

        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='followers')
    def get_followers(self, request, pk=None):
        try:
            if pk:
                user = User.objects.get(id=pk)
            else:
                user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        followers = get_all_followers(user)
        serialized_followers = self.get_serializer(followers, many=True).data

        return Response({'followers': serialized_followers}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='followings')
    def get_followings(self, request, pk=None):
        try:
            if pk:
                user = User.objects.get(id=pk)
            else:
                user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        followings = get_all_followings(user)
        serialized_followings = self.get_serializer(followings, many=True).data

        return Response({'followings': serialized_followings}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='set-password')
    def set_password(self, request):
        """
        Allows OAuth users to set a password so they can log in with email/password later.
        """
        user = request.user
        print(request.data)
        print(user)
        # Ensure the user signed in via OAuth (not email)
        if user.auth_provider == "email":
            return Response({"error": "You already have a password set."}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # Validate input
        if not new_password or not confirm_password:
            return Response({"error": "Both password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except Exception as e:
            print("Password validation error:", e)  # Debugging
            return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        # Set password and change auth provider to 'email'
        user.set_password(new_password)
        user.auth_provider = "email"
        user.save()

        return Response({"message": "Password set successfully. You can now log in with email."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='change-password', permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request})

        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
