from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["user"].id
        self.group_name = f"user_{self.user_id}"
        print(f"Connected user: {self.group_name}")

        # Add user to their own Redis channel
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        from Chat.services import save_message

        data = json.loads(text_data)
        message = data["message"]
        chat_room_id = data["chat_room_id"]
        current_user = self.scope['user']

        message_object = await save_message(current_user=current_user, chat_room_id=chat_room_id, content=message)

        message_object['type'] = 'acknowledgement'
        message_object['status'] = 'send'
        # print(message_object)

        # Send aknoledge to the sender
        recipient_group_name = f"user_{current_user.id}"
        await self.channel_layer.group_send(
            recipient_group_name,
            {
                "type": "chat_message",
                "message": message_object,
            },
        )

    async def chat_message(self, event):
        message = event["message"]

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({"message": message}))
