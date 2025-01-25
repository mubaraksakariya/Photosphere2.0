from rest_framework import serializers
from .models import ChatRoom, ChatRoomMember, FavoriteChat, Message


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_group', 'created_at']


class ChatRoomMemberSerializer(serializers.ModelSerializer):
    chat_room = ChatRoomSerializer()

    class Meta:
        model = ChatRoomMember
        fields = ['id', 'chat_room', 'is_favorite', 'joined_at']


class RecentChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'timestamp']


class FavoriteChatSerializer(serializers.ModelSerializer):
    # Optionally customize the chat room representation
    chat_room = serializers.StringRelatedField()

    class Meta:
        model = FavoriteChat
        fields = ['id', 'chat_room', 'added_at']
