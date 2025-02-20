from channels.layers import get_channel_layer
import redis.asyncio as aioredis

REDIS_ONLINE_USERS_KEY = "online_users"


async def notify_chat_members(user_id, online):
    """
    Notify chat members that a user is online/offline.
    """
    from Chat.services import get_related_chat_users

    channel_layer = get_channel_layer()
    redis = await aioredis.from_url("redis://localhost")

    # Get all chat members
    chat_members = await get_related_chat_users(user_id)

    # Send update to each chat member's WebSocket group
    for member_id in chat_members:
        await channel_layer.group_send(
            f"user_{member_id}",
            {
                "type": "chat_message",
                "message": {
                    "type": "userStatus",
                    "user_id": user_id,
                    "status": "online" if online else "offline",
                },
            },
        )

    await redis.close()


async def send_is_typing(message, chat_room_id, current_user):
    """
    send typing indication message
    """
    from Chat.services import get_chat_room_members_id

    channel_layer = get_channel_layer()
    members = await get_chat_room_members_id(chat_room_id, current_user)
    message['chat_room_id'] = chat_room_id
    message['user_id'] = current_user.id
    # print(chat_members)
    for member_id in members:
        await channel_layer.group_send(
            f"user_{member_id}",
            {
                "type": "chat_message",
                'message': message,
            })
