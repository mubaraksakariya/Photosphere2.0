from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from Users.models import User


class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications")  # Recipient
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_notifications")  # Who performed the action
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Generic Foreign Key to reference any model (Post, Comment, etc.)
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE)  # Model
    object_id = models.PositiveIntegerField()  # ID of the object
    content_object = GenericForeignKey(
        "content_type", "object_id")  # Reference to the object

    notification_type = models.CharField(max_length=50, choices=[
        ('liked', 'Like'),
        ('commented', 'Comment'),
        ('followed', 'Follow'),
        ('mentioned', 'Mention'),
        ('general', 'General'),
        ('follow_request', 'Follow request')
    ])

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message}"
