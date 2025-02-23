from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Max
from django.db import DatabaseError
from Chat.models import ChatRoom
from Chat.serializers import ChatRoomSerializer


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
