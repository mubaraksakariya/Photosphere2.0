from django.contrib.contenttypes.models import ContentType
from Notification.serializers import NotificationSerializer
from Users.models import User
from .models import Notification
from django.core.exceptions import ValidationError
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def create_notification(sender, recipient, action_object, notif_type, custom_message=None, request=None):
    """
    Creates a notification for a recipient and sends it via WebSocket.

    Args:
        sender (User): The user who triggered the notification.
        recipient (User): The user who will receive the notification.
        action_object (Model): The related object for the notification.
        notif_type (str): The type of notification (e.g., 'liked', 'commented').
        custom_message (str, optional): Custom message override.
        request (HttpRequest, optional): Request object to pass context to the serializer.

    Returns:
        Notification: The created notification instance.
    """
    if not recipient or not isinstance(recipient, User):
        raise ValidationError("Invalid recipient: None received.")

    if not action_object:
        raise ValidationError("Invalid action_object: None received.")

    try:
        content_type = ContentType.objects.get_for_model(action_object)
    except ContentType.DoesNotExist:
        raise ValidationError("Invalid content type for the action_object.")

    try:
        # Create notification
        notification = Notification.objects.create(
            user=recipient,
            sender=sender,
            message=custom_message if custom_message else f"{sender.username} {notif_type} your {action_object._meta.model_name}.",
            content_type=content_type,
            object_id=action_object.id,
            notification_type=notif_type
        )

        # Serialize with context if request is available
        context = {"request": request} if request else {}
        serialized_notification = NotificationSerializer(
            notification, context=context).data

        # Send notification via WebSocket
        channel_layer = get_channel_layer()
        group_name = f"notifications_{recipient.id}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "message": serialized_notification,
            },
        )
        return notification

    except Exception as e:
        raise ValidationError(
            f"An error occurred while creating the Notification object: {e}")
