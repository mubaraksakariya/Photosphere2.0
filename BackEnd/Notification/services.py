from django.contrib.contenttypes.models import ContentType

from Notification.serializers import NotificationSerializer
from Users.models import User
from .models import Notification
from django.core.exceptions import ValidationError
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def create_notification(sender, recipient, action_object, notif_type, custom_message=None):
    if not recipient or not isinstance(recipient, User):
        raise ValidationError("Invalid recipient: None received.")

    if not action_object:
        raise ValidationError("Invalid action_object: None received.")

    try:
        content_type = ContentType.objects.get_for_model(action_object)
    except ContentType.DoesNotExist:
        raise ValidationError("Invalid content type for the action_object.")

    try:
        notification = Notification.objects.create(
            user=recipient,
            sender=sender,
            message=custom_message if custom_message else f"{sender.username} {notif_type} your {action_object._meta.model_name}.",
            content_type=content_type,
            object_id=action_object.id,
            notification_type=notif_type
        )
        serialized_notification = NotificationSerializer(notification).data

        # Send notification via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{recipient.id}",
            {
                "type": "send_notification",
                "message": serialized_notification,
            },
        )
        return notification
    except Exception as e:
        raise ValidationError(
            f"An error occurred while creating the Notification object: {e}")
