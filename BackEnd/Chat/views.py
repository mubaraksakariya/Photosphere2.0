from django.db.models import Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from Chat.services import get_private_chat_room
from Users.models import User
from .models import ChatRoom, FavoriteChat
from .serializers import ChatRoomSerializer, FavoriteChatSerializer
from rest_framework import status
from django.db import DatabaseError


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


class RecentChatUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Fetch latest message timestamp for each chat room the user is part of
            recent_chats = (
                ChatRoom.objects.filter(members__user=user)
                .annotate(last_message=Max('messages__timestamp'))
                .order_by('-last_message')
            )

            # Serialize the recent chat rooms with the latest message data
            serializer = ChatRoomSerializer(
                recent_chats, many=True, context={'request': request}
            )
            return Response(serializer.data)

        except DatabaseError as e:
            # Handle database errors
            return Response(
                {"error": "Database error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            # Handle any other unexpected errors
            print(e)
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class FavoriteChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        favorites = FavoriteChat.objects.filter(user=user)
        serializer = FavoriteChatSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        chat_room_id = request.data.get('chat_room_id')
        if not chat_room_id:
            return Response({"error": "chat_room_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_room = ChatRoom.objects.get(id=chat_room_id)
            favorite, created = FavoriteChat.objects.get_or_create(
                user=user, chat_room=chat_room)
            if created:
                return Response({"message": "Chat room added to favorites"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Chat room is already in favorites"}, status=status.HTTP_200_OK)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat room does not exist"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        user = request.user
        chat_room_id = request.data.get('chat_room_id')
        if not chat_room_id:
            return Response({"error": "chat_room_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            favorite = FavoriteChat.objects.get(
                user=user, chat_room_id=chat_room_id)
            favorite.delete()
            return Response({"message": "Chat room removed from favorites"}, status=status.HTTP_200_OK)
        except FavoriteChat.DoesNotExist:
            return Response({"error": "Chat room is not in favorites"}, status=status.HTTP_404_NOT_FOUND)
