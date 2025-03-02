from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now
from datetime import timedelta


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        print(user)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


class AuthProvider(models.TextChoices):
    EMAIL = "email", "Email"
    GOOGLE = "google", "Google"
    FACEBOOK = "facebook", "Facebook"
    GITHUB = "github", "GitHub"


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    auth_provider = models.CharField(
        max_length=20, choices=AuthProvider.choices, default=AuthProvider.EMAIL
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to='profile_images/', default='profile_images/default_user_profile_image.png', blank=True
    )

    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    post_count = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class UserSettings(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="settings")

    # General Preferences
    language = models.CharField(max_length=10, choices=[(
        'en', 'English'), ('es', 'Spanish')], default='en')

    # Notification Settings
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)

    # Privacy Settings
    is_profile_public = models.BooleanField(default=True)
    allow_messages_from_strangers = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"


class UserBlock(models.Model):
    blocker = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="blocking")
    blocked = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="blocked_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensure a user can't block the same person multiple times
        unique_together = ("blocker", "blocked")

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"


def default_expires_at():
    return now() + timedelta(minutes=5)


class OTP(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='otp')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expires_at)

    def is_valid(self):
        return now() < self.expires_at


class Follow(models.Model):
    follower = models.ForeignKey(
        User, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(
        User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"


class FollowRequest(models.Model):
    requester = models.ForeignKey(
        User, related_name="sent_follow_requests", on_delete=models.CASCADE)
    target = models.ForeignKey(
        User, related_name="received_follow_requests", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[("pending", "Pending"), ("accepted", "Accepted"),
                 ("rejected", "Rejected")],
        default="pending",
    )

    class Meta:
        unique_together = ('requester', 'target')  # Prevent duplicate requests

    def __str__(self):
        return f"{self.requester.username} requested to follow {self.target.username}"
