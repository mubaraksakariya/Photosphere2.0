from rest_framework import serializers

from Posts.serializers import PostSerializer
from Users.serializers import UserSerializer
from .models import ChatRoom, ChatRoomMember, FavoriteChat, Message, MessageContent


class ChatRoomSerializer(serializers.ModelSerializer):
    """
    Must send context={'request': request} with seriailizer,
    Or call serializer using the self.get_serializer

    """

    members = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_group', 'created_at', 'members']

    def get_members(self, obj):
        """
        Retrieves the list of members in a chat room.
        """
        request = self.context['request']

        members = ChatRoomMember.objects.filter(
            chat_room=obj).select_related('user')
        return UserSerializer([member.user for member in members if member.user != request.user or obj.is_group], context={'request': request}, many=True).data


class ChatRoomMemberSerializer(serializers.ModelSerializer):
    chat_room = ChatRoomSerializer()

    class Meta:
        model = ChatRoomMember
        fields = ['id', 'chat_room', 'is_favorite', 'joined_at']


class RecentChatSerializer(serializers.ModelSerializer):
    chat_room = ChatRoomSerializer()

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'timestamp']


class MessageContentSerializer(serializers.ModelSerializer):
    shared_post = PostSerializer(read_only=True, required=False)

    class Meta:
        model = MessageContent
        fields = ['id', 'text', 'image', 'shared_post', 'file']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    content = MessageContentSerializer()

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'timestamp', 'type']


class FavoriteChatSerializer(serializers.ModelSerializer):
    # Optionally customize the chat room representation
    chat_room = serializers.StringRelatedField()

    class Meta:
        model = FavoriteChat
        fields = ['id', 'chat_room', 'added_at']
