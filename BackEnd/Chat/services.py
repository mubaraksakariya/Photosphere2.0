from Chat.serializers import MessageSerializer
from .models import ChatRoom, ChatRoomMember
from Chat.models import ChatRoom, ChatRoomMember
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import ChatRoom, ChatRoomMember, Message, MessageStatus
from django.db.models import Count
from django.core.exceptions import ValidationError
from asgiref.sync import sync_to_async


User = get_user_model()


def get_private_chat_room(current_user, other_user):
    """
    Retrieves or creates a private chat room between the current user and another user.

    Args:
        current_user (User): The currently authenticated user.
        other_user (User): The other user to create a chat room with.

    Returns:
        ChatRoom: The existing or newly created private chat room.

    Raises:
        ValidationError: If the current user tries to create a chat room with themselves.
    """
    # Prevent a user from creating a chat room with themselves
    if current_user == other_user:
        raise ValidationError("You cannot create a chat room with yourself.")

    with transaction.atomic():
        # Check if a private chat room already exists between the two users
        chat_room = ChatRoom.objects.filter(
            is_group=False,
            members__user__in=[current_user, other_user]
        ).annotate(
            num_members=Count('members')
        ).filter(
            num_members=2
        ).first()

        if not chat_room:
            # Create a new private chat room
            chat_room = ChatRoom.objects.create(is_group=False)
            # Add both users as members of the chat room
            ChatRoomMember.objects.bulk_create([
                ChatRoomMember(user=current_user, chat_room=chat_room),
                ChatRoomMember(user=other_user, chat_room=chat_room)
            ])

    return chat_room


@sync_to_async
def save_message(current_user, chat_room_id, content):
    """
    Saves a message in a chat room and creates MessageStatus entries for all members
    of the chat room (excluding the sender).

    Args:
        current_user (User): The currently authenticated user (sender).
        chat_room_id (int): The ID of the chat room.
        content (str): The content of the message.

    Returns:
        dict: The serialized message object.

    Raises:
        ValueError: If the chat room does not exist or any recipients are invalid.
        Exception: For any other errors.
    """
    try:
        # Fetch the chat room
        chat_room = ChatRoom.objects.get(id=chat_room_id)

        # Create and save the message
        message = Message.objects.create(
            chat_room=chat_room,
            sender=current_user,
            content=content
        )

        # Get all recipients (excluding the sender)
        members = get_room_member(
            chat_room=chat_room, current_user=current_user)

        if not members:
            raise ValueError("No valid recipients found for the chat room.")

        # Create MessageStatus entries for all recipients
        for member in members:
            MessageStatus.objects.create(
                user=member.user,  # The recipient user
                message=message,
                is_read=False
            )

        return MessageSerializer(message).data

    except ChatRoom.DoesNotExist:
        raise ValueError("Chat room does not exist.")
    except Exception as e:
        raise e


def get_room_member(chat_room, current_user):
    """
    Get the recipient(s) of a chat room.

    Args:
        chat_room (ChatRoom): The chat room object.
        current_user (User): The currently authenticated user.

    Returns:
        list: A list of recipient(s). For private chats, it will contain one user.
              For group chats, it will return all other users in the room.
    """
    # Get all members of the chat room except the current user
    members = ChatRoomMember.objects.filter(
        chat_room=chat_room).exclude(user=current_user)

    # Return the list of members (even for private chat)
    return members
