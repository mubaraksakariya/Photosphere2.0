import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        from django.contrib.auth.models import AnonymousUser

        if self.scope["user"] == AnonymousUser():
            await self.close()
        else:
            self.user = self.scope["user"]
            self.group_name = f"notifications_{self.user.id}"

            # Add the user to their notification group
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        from .models import Notification

        data = json.loads(text_data)
        action = data.get("action")

        if action == "mark_as_read":
            await self.mark_notifications_as_read()

    # @sync_to_async
    # def mark_notifications_as_read(self):
    #     Notification.objects.filter(
    #         user=self.user, is_read=False).update(is_read=True)

    async def send_notification(self, event):
        """Send a notification to the frontend."""
        await self.send(text_data=json.dumps(event["message"]))
