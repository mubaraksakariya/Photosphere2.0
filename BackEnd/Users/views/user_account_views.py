import os
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.urls import reverse
from django.utils.http import urlencode
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from Users.services import send_email


User = get_user_model()
signer = TimestampSigner()


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        front_end_base_url = os.environ.get(
            "FRONT_END_BASE_URL", "https://example.com")

        # Ensure the base URL has no trailing slash
        front_end_base_url = front_end_base_url.rstrip("/")

        # Generate a signed token with expiry
        signed_data = signer.sign(user.pk)

        # Construct the reset URL properly
        reset_url = f"{front_end_base_url}/password-reset?{urlencode({'token': signed_data})}"

        # Send email with reset link
        send_email(
            "Password Reset Request",
            f"Click the link below to reset your password (valid for 1 hour):\n{reset_url}",
            [email],
        )

        return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response({"error": "Token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate token and extract user ID
            # Expires after 1 hour
            user_id = signer.unsign(token, max_age=3600)
            user = User.objects.get(pk=user_id)
        except (BadSignature, SignatureExpired):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Set new password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
