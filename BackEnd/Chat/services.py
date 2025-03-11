from Chat.serializers import MessageSerializer
from Posts.models import Post, Share
from .models import ChatRoom, ChatRoomMember, MessageContent
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
def save_message(current_user, chat_room_id, content, type='text'):
    try:
        with transaction.atomic():
            chat_room = ChatRoom.objects.get(id=chat_room_id)

            if type == 'text':
                content_obj = MessageContent.objects.create(text=content)
            elif type == 'shared-post':
                post = Post.objects.get(id=content)
                share = Share.objects.create(user=current_user, post=post)
                content_obj = MessageContent.objects.create(shared_post=post)
            else:
                raise ValueError("Invalid message type")

            # Create and save the message
            message = Message.objects.create(
                chat_room=chat_room,
                sender=current_user,
                content=content_obj,
                type=type
            )

            # Get all recipients (excluding the sender)
            members = get_room_member(
                chat_room=chat_room, current_user=current_user)

            if not members.exists():
                raise ValueError(
                    "No valid recipients found for the chat room.")

            # Create MessageStatus entries for all recipients
            MessageStatus.objects.bulk_create([
                MessageStatus(user=member.user, message=message, is_read=False)
                for member in members
            ])
            return MessageSerializer(message).data

    except ChatRoom.DoesNotExist:
        raise ValueError("Chat room does not exist.")
    except Post.DoesNotExist:
        raise ValueError("Shared post does not exist.")
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


@sync_to_async
def get_chat_room_members_id(chat_room_id, current_user=None):
    chat_room = ChatRoom.objects.filter(id=chat_room_id).first()
    if chat_room:
        return list(ChatRoomMember.objects.filter(chat_room=chat_room).exclude(user=current_user).values_list('user__id', flat=True))
    return []


@sync_to_async
def get_related_chat_users(user_id):
    """
    Get unique user IDs of all members in the chat rooms the given user participates in,
    excluding the user themselves.
    """
    # Get all chat rooms where the user is a member
    chat_rooms = ChatRoomMember.objects.filter(
        user_id=user_id
    ).values_list("chat_room_id", flat=True)

    # Get all members in these chat rooms, excluding the user itself
    members = ChatRoomMember.objects.filter(
        chat_room_id__in=chat_rooms
    ).exclude(user_id=user_id).values_list("user_id", flat=True)

    return list(set(members))
