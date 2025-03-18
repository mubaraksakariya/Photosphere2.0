from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q

import random
import string
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.exceptions import ValidationError

from Notification.services import create_notification
from Users.models import OTP, AuthProvider, Follow, User, FollowRequest
from Users.serializers import FollowSerializer
from google.oauth2.id_token import verify_oauth2_token
from google.auth.transport.requests import Request
from django.db import IntegrityError


def send_email(subject, message, recipient_list):
    """
    General method to send an email.
    Args:
        subject (str): The subject of the email.
        message (str): The body of the email.
        recipient_list (list): List of recipient email addresses.
    """
    from_email = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, from_email, recipient_list)


def generate_otp(length=6):
    """
    Generate a random OTP of specified length.
    Args:
        length (int): Length of the OTP. Defaults to 6.
    Returns:
        str: A randomly generated OTP.
    """
    return ''.join(random.choices(string.digits, k=length))


def send_otp_email(user):
    """
    Send an OTP to the given user's email.
    Args:
        user (User): The user instance to whom the OTP will be sent.
    """
    otp, created = OTP.objects.update_or_create(
        user=user,
        defaults={
            'code': generate_otp(),
            'expires_at': now() + timedelta(minutes=5),
        }
    )

    subject = 'Your OTP for Email Verification'
    message = f'Hello {user.username},\n\nYour OTP for verification is: {otp.code}\n\nPlease use this to complete your signup.'
    send_email(subject, message, [user.email])


def validate_otp(user, code):
    """Validate the OTP for the given user or raise ValidationError."""
    try:
        otp = OTP.objects.get(user=user, code=code)
        if not otp.is_valid():
            raise ValidationError("OTP has expired.")
        otp.delete()  # Delete OTP after successful validation
    except OTP.DoesNotExist:
        raise ValidationError("Invalid OTP.")


def get_user(identifier):
    """Fetch user by email, username, or ID, or raise ValidationError."""
    try:
        if identifier.isdigit():  # Ensure identifier is a number before using it for `id`
            return User.objects.get(Q(email=identifier) | Q(username=identifier) | Q(id=int(identifier)))
        return User.objects.get(Q(email=identifier) | Q(username=identifier))
    except User.DoesNotExist:
        raise ValidationError(
            "User with this email or username does not exist.")


def verify_google_id_token(token):
    """Verifies a Google ID token.

    Args:
        token: The ID token string.

    Returns:
        A dictionary containing the token claims (decoded payload) if valid,
        or None if invalid.
    """
    try:
        CLIENT_ID = settings.GOOGLE_CLIENT_ID

        # Verify the token
        id_info = verify_oauth2_token(token, Request(), CLIENT_ID)

        # Check if the token is issued to your application
        if id_info['aud'] != CLIENT_ID:
            raise ValueError('Audience mismatch.')

        # Optional: Check if the token is issued by Google
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid token issuer.')

        return id_info

    except ValueError as e:
        print(f"Token verification error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def get_or_create_google_user(email, first_name, last_name, birthdate):
    """Get or create the user and profile"""

    user = User.objects.filter(Q(username=email) | Q(email=email)).first()
    if user:
        return user, user.profile

    user, created = User.objects.get_or_create(
        username=email, auth_provider=AuthProvider.GOOGLE, defaults={'email': email})
    if created:
        profile = user.profile  # Automatically created by signal
        profile.first_name = first_name
        profile.last_name = last_name
        profile.date_of_birth = birthdate
        profile.save()
    else:
        profile = user.profile

    return user, profile


def get_suggested_users(user):
    # Get the users the current user is following
    following_ids = user.following.values_list('followed__id', flat=True)

    # Get the users blocked by the current user
    blocked_ids = user.blocking.values_list('blocked__id', flat=True)

    # Get the users who blocked the current user
    blocked_by_ids = user.blocked_by.values_list('blocker__id', flat=True)

    # Filter users excluding followed, blocked, and blocked-by users, and self
    suggested_users = User.objects.filter(
        is_superuser=False,
        is_staff=False
    ).exclude(
        Q(id=user.id) |  # Exclude self
        Q(id__in=following_ids) |  # Exclude followed users
        Q(id__in=blocked_ids) |  # Exclude users blocked by the current user
        Q(id__in=blocked_by_ids)  # Exclude users who blocked the current user
    ).order_by('-date_joined')[:5]

    return suggested_users


def follow_user(request, follower, followed):
    if follower == followed:
        raise ValidationError("A user cannot follow themselves.")

    if not followed or not isinstance(followed, User):
        raise ValidationError(
            "Invalid recipient: followed user does not exist.")

    # Check if already following
    existing_follow = Follow.objects.filter(
        follower=follower, followed=followed).first()
    if existing_follow:
        existing_follow.delete()
        return {"status": "unfollowed", "message": "Unfollowed successfully"}

    # If the followed user is private, create a follow request instead
    if not followed.settings.is_profile_public:
        follow_request, created = FollowRequest.objects.get_or_create(
            requester=follower, target=followed, defaults={'status': 'pending'}
        )

        if not created:
            follow_request.delete()
            return {"status": "cancelled", "message": "Follow request cencelled"}

        # **Send Follow Request Notification**
        create_notification(
            sender=follower,
            recipient=followed,
            action_object=follow_request,
            notif_type="follow_request",
            custom_message=f"{follower.username} sent you a follow request.",
            request=request
        )

        return {"status": "requested", "message": "Follow request sent"}

    # If public, proceed with normal follow
    try:
        follow, created = Follow.objects.get_or_create(
            follower=follower, followed=followed)
    except IntegrityError:
        raise ValidationError(
            "An error occurred while trying to follow this user.")

    if not created:
        raise ValidationError(
            "Unexpected error: Follow relationship was not created.")

    # **Send Follow Notification**
    create_notification(
        sender=follower,
        recipient=followed,
        action_object=follow,
        notif_type="followed",
        custom_message=f"{follower.username} started following you.",
        request=request
    )

    return {"status": "followed", "message": "Followed successfully", "follow": FollowSerializer(follow).data}


def get_all_followers(user):
    """
    Retrieve all followers of a given user.

    Args:
        user (User): The user instance whose followers are to be retrieved.

    Returns:
        list: A list of serialized follower data.
    """
    followers = User.objects.filter(
        following__followed=user)  # Fetch users who follow `user`
    return followers


def get_all_followings(user):
    """
    Retrieve all users that the given user is following.

    Args:
        user (User): The user instance whose followings are to be retrieved.

    Returns:
        list: A list of serialized following data.
    """
    followings = User.objects.filter(
        followers__follower=user)  # Fetch users whom `user` follows
    return followings
