from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from Chat.serializers import MessageSerializer
from Chat.services import get_room_member
from .models import Message


@receiver(post_save, sender=Message)
def send_message_to_consumer(sender, instance, created, **kwargs):
    """
    Signal handler to send a message to the WebSocket consumer when a Message is created.
    """
    if created:
        # Get the channel layer
        channel_layer = get_channel_layer()

        # Get all recipients of the chat room, excluding the sender
        room_members = get_room_member(
            current_user=instance.sender, chat_room=instance.chat_room)

        if not room_members:
            raise ValueError("No valid recipients found for the chat room.")

        # Create message payload to send
        message_data = {
            "type": "chat_message",  # Event type handled in the consumer
            "message": MessageSerializer(instance).data
        }

        # Send the message to all recipients
        for member in room_members:
            # Group name for each recipient
            recipient_group_name = f"user_{member.user.id}"

            # Send message to the recipient's group asynchronously
            async_to_sync(channel_layer.group_send)(
                recipient_group_name, message_data)
