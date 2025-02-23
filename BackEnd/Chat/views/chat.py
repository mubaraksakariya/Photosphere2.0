from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from Chat.models import ChatRoom, ChatRoomMember, Message
from Chat.pagination import CustomPageNumberPagination
from Chat.serializers import MessageSerializer

from rest_framework.response import Response

from Chat.services import get_private_chat_room
from Users.models import User
from Chat.serializers import ChatRoomSerializer
from rest_framework import status


class MessageViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing messages in a chat room.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        """
        Filter messages to only those in the chat room the user is a member of.
        """
        chat_room_id = self.kwargs.get('chat_room_id')
        current_user = self.request.user

        # Check if the chat room exists
        chat_room = ChatRoom.objects.filter(id=chat_room_id).first()
        if not chat_room:
            raise PermissionDenied("Chat room does not exist.")

        # Check if the user is a member of the chat room
        is_member = ChatRoomMember.objects.filter(
            user=current_user, chat_room=chat_room
        ).exists()

        if not is_member:
            raise PermissionDenied("You are not a member of this chat room.")

        # Return messages for the chat room
        return Message.objects.filter(chat_room=chat_room)


class GetOrCreateChatRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        """
        Gets or creates a private chat room between the current user and another user.
        """
        current_user = request.user

        # Validate the other user
        try:
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if current_user.id == other_user.id:
            return Response({'error': 'Cannot create a chat room with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # get chat room
        try:
            chat_room = get_private_chat_room(
                current_user=current_user, other_user=other_user)
        except Exception as e:
            # Log the exception if needed
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'chat_room': ChatRoomSerializer(chat_room, context={'request': request}).data,
            'name': chat_room.name or f"Room {chat_room.id}"
        }, status=status.HTTP_200_OK)
