from django.core.mail import send_mail
from django.conf import settings
import random
import string
from django.utils.timezone import now
from datetime import timedelta

from Users.models import OTP


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
