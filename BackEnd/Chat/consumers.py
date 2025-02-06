from channels.generic.websocket import AsyncWebsocketConsumer
import json
import redis.asyncio as aioredis

from Chat.utils import notify_chat_members

REDIS_ONLINE_USERS_KEY = "online_users"


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Ensures user ID exists
        self.user_id = getattr(self.scope["user"], "id", None)
        if not self.user_id:
            await self.close()
            return

        self.group_name = f"user_{self.user_id}"
        self.redis = await aioredis.from_url("redis://localhost")

        print(f"Connected user: {self.group_name}")

        # Add user to Redis online users set
        await self.redis.sadd(REDIS_ONLINE_USERS_KEY, self.user_id)

        # Add user to WebSocket channel group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()
        # Call external function to notify chat members
        await notify_chat_members(self.user_id, online=True)

    async def disconnect(self, close_code):
        if hasattr(self, "redis"):  # Ensure redis connection exists before using it
            await self.redis.srem(REDIS_ONLINE_USERS_KEY, self.user_id)
            await self.redis.close()

        await self.channel_layer.group_discard(self.group_name, self.channel_name)

        # Call external function to notify chat members
        await notify_chat_members(self.user_id, online=False)

    async def receive(self, text_data):
        from Chat.services import save_message, get_chat_room_members_id
        import redis.asyncio as aioredis

        data = json.loads(text_data)
        message = data.get("message")
        chat_room_id = data.get("chat_room_id")
        current_user = self.scope["user"]

        if not message or not chat_room_id:
            return  # Ignore invalid messages

        message_object = {}

        if message["type"] == "text":
            message_object = await save_message(
                current_user=current_user, chat_room_id=chat_room_id, content=message["data"]
            )
            message_object["type"] = "acknowledgement"
            message_object["status"] = "send"

        elif message["type"] == "isOnline":
            members = await get_chat_room_members_id(chat_room_id)
            online_users = [
                member_id for member_id in members if await self.redis.sismember(REDIS_ONLINE_USERS_KEY, member_id)
            ]

            # print(online_users)
            message_object["users"] = online_users
            message_object["type"] = "isOnline"
        else:
            return
        # Send acknowledgment or online users to sender
        recipient_group_name = f"user_{current_user.id}"
        await self.channel_layer.group_send(
            recipient_group_name,
            {
                "type": "chat_message",
                "message": message_object,
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))
