from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from Users.models import UserBlock
from Users.serializers import UserBlockSerializer
from rest_framework import status


class UserBlockViewSet(viewsets.ModelViewSet):
    serializer_class = UserBlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBlock.objects.filter(blocker=self.request.user)

    def perform_create(self, serializer):
        blocked_id = self.request.data.get("blocked")
        if not blocked_id:
            return Response({"error": "Blocked user ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(blocker=self.request.user, blocked_id=blocked_id)

    @action(detail=False, methods=['post'])
    def unblock(self, request):
        """ Unblock a user """
        blocked_id = request.data.get("blocked_id")
        if not blocked_id:
            return Response({"error": "blocked_id is required"}, status=400)

        UserBlock.objects.filter(blocker=request.user,
                                 blocked_id=blocked_id).delete()
        return Response({"message": "User unblocked successfully"})

    @action(detail=False, methods=['get'])
    def is_blocked(self, request):
        """ Check if a user is blocked """
        blocked_id = request.query_params.get("blocked_id")
        if not blocked_id:
            return Response({"error": "blocked_id is required"}, status=400)

        is_blocked = UserBlock.objects.filter(
            blocker=request.user, blocked_id=blocked_id).exists()
        return Response({"is_blocked": is_blocked})
