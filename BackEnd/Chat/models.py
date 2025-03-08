from django.db import models
from django.conf import settings

from Posts.models import Post


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
    Represents a message in a chat room, storing only metadata.
    """
    TEXT = 'text'
    IMAGE = 'image'
    SHARED_POST = 'shared_post'
    FILE = 'file'

    MESSAGE_TYPES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (SHARED_POST, 'Shared Post'),
        (FILE, 'File'),
    ]

    chat_room = models.ForeignKey(
        ChatRoom, related_name='messages', on_delete=models.CASCADE
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    type = models.CharField(
        max_length=20, choices=MESSAGE_TYPES, default=TEXT
    )  # Stores the type of message
    content = models.OneToOneField(
        'MessageContent', null=True, blank=True, on_delete=models.CASCADE, related_name="message"
    )  # Reference to actual content
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.sender.username} - {self.get_message_type_display()}"


class MessageContent(models.Model):
    """
    Stores the actual message content separately to support different message types.
    """
    text = models.TextField(blank=True, null=True)  # For text messages
    image = models.ImageField(upload_to='chat_images/',
                              blank=True, null=True)  # For images
    shared_post = models.ForeignKey(
        Post, null=True, blank=True, on_delete=models.SET_NULL, related_name="shared_messages"
    )  # For shared posts
    file = models.FileField(upload_to='chat_files/',
                            blank=True, null=True)  # For file messages

    def __str__(self):
        if self.text:
            return f"Text: {self.text[:30]}"
        elif self.image:
            return f"Image: {self.image.url}"
        elif self.shared_post:
            return f"Shared Post: {self.shared_post.id}"
        elif self.file:
            return f"File: {self.file.name}"
        return "Empty Message"


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
