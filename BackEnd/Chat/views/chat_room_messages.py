from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from Chat.models import Message, ChatRoom, ChatRoomMember
from Chat.serializers import MessageSerializer
from Chat.pagination import CustomPageNumberPagination


class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_chat_room(self, chat_room_id, user):
        """
        Helper method to check if the user is a member of the chat room.
        """
        chat_room = ChatRoom.objects.filter(id=chat_room_id).first()
        if not chat_room:
            raise PermissionDenied("Chat room does not exist.")

        if not ChatRoomMember.objects.filter(user=user, chat_room=chat_room).exists():
            raise PermissionDenied("You are not a member of this chat room.")

        return chat_room

    def get(self, request, chat_room_id):
        """
        Get paginated messages for a chat room.
        """
        chat_room = self.get_chat_room(chat_room_id, request.user)
        messages = Message.objects.filter(
            chat_room=chat_room).order_by("-timestamp")

        # Initialize paginator
        paginator = self.pagination_class()
        paginated_messages = paginator.paginate_queryset(messages, request)

        # Serialize the paginated messages
        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, chat_room_id):
        """
        Send a message in a chat room.
        """
        chat_room = self.get_chat_room(chat_room_id, request.user)
        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(sender=request.user, chat_room=chat_room)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
