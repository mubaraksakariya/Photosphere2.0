from django.contrib.contenttypes.models import ContentType

from Notification.serializers import NotificationSerializer
from .models import Notification
from django.core.exceptions import ValidationError
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def create_notification(sender, recipient, action_object, notif_type, custom_message=None):
    """
    Creates a notification for a given recipient.

    Args:
        sender (User): The user who is sending the notification.
        recipient (User): The user who will receive the notification.
        action_object (Model): The object that the notification is related to.
        notif_type (str): The type of notification (e.g., 'liked', 'commented').
        custom_message (str, optional): A custom message for the notification. Defaults to None.

    Returns:
        Notification: The created Notification object.

    Raises:
        ContentType.DoesNotExist: If the content type for the action_object does not exist.
        ValidationError: If there is an error creating the Notification object.
    """

    try:
        notification = Notification.objects.create(
            user=recipient,
            sender=sender,
            message=custom_message if custom_message else f"{sender.username} {notif_type} your {action_object._meta.model_name}.",
            content_type=ContentType.objects.get_for_model(action_object),
            object_id=action_object.id,
            notification_type=notif_type
        )
        serialized_notification = NotificationSerializer(notification).data
        # Send the notification via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{recipient.id}",
            {
                "type": "send_notification",
                "message": serialized_notification,
            },
        )
        return notification
    except ContentType.DoesNotExist:
        raise ValidationError("Invalid content type for the action_object.")

    except Exception as e:
        raise ValidationError(
            f"An error occurred while creating the Notification object: {e}")
