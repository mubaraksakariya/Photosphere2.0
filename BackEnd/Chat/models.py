from django.db import models
from django.conf import settings


class ChatRoom(models.Model):
    """
    Represents a chat room that can have multiple members and messages.
    """
    name = models.CharField(max_length=255, null=True,
                            blank=True)  # Optional for named groups
    is_group = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name if self.name else f"Room {self.id}"


class ChatRoomMember(models.Model):
    """
    Links users to chat rooms, representing the members of a room.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    chat_room = models.ForeignKey(
        ChatRoom, related_name='members', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures no duplicate memberships
        unique_together = ('user', 'chat_room')

    # def __str__(self):
    #     return f"{self.user.username} in {self.chat_room}"


class Message(models.Model):
    """
    Represents messages sent in a chat room.
    """
    chat_room = models.ForeignKey(
        ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.sender.username} in {self.chat_room}: {self.content[:20]}"

    class Meta:
        ordering = ['-timestamp']


class MessageStatus(models.Model):
    """
    Tracks read/unread status for messages in chat rooms.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    message = models.ForeignKey(
        Message, related_name='statuses', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        # Each user tracks each message once
        unique_together = ('user', 'message')

    def __str__(self):
        status = "Read" if self.is_read else "Unread"
        return f"{self.user.username}: {status} {self.message}"


class FavoriteChat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    chat_room = models.ForeignKey('ChatRoom', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'chat_room')  # Prevent duplicate favorites

    def __str__(self):
        return f"{self.user.username}'s favorite: {self.chat_room}"
