from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from Chat.models import FavoriteChat, ChatRoom
from Chat.serializers import FavoriteChatSerializer


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
