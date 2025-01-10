from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Users.models import OTP, User
from Users.services import send_otp_email
from .serializers import UserSerializer
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
import logging

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
            # Handle validation errors (e.g., database issues, etc.)
            logger.error(f"ValidationError: {e}")
            return Response({"message": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # General exception handling (database issues, other errors)
            logger.exception(f"Unexpected error occurred: {e}")
            return Response({"message": "An unexpected error occurred. Please try again later."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')
        print(email, code)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            otp = OTP.objects.get(user=user, code=code)
            if not otp.is_valid():
                raise ValidationError("OTP has expired.")
            user.is_verified = True  # Mark the user as verified
            # OTP is valid, delete after use
            otp.delete()
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        print(email)
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response({"message": "User is already verified."}, status=status.HTTP_400_BAD_REQUEST)
            # Send OTP email through service
            send_otp_email(user)
            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(f"Unexpected error occurred: {e}")
            return Response({"message": "An unexpected error occurred. Please try again later."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
