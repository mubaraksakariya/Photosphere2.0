from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from Users.models import UserBlock
from Users.serializers import UserBlockSerializer


class UserBlockViewSet(viewsets.ModelViewSet):
    serializer_class = UserBlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBlock.objects.filter(blocker=self.request.user)

    def perform_create(self, serializer):
        serializer.save(blocker=self.request.user)

    @action(detail=False, methods=['post'])
    def unblock(self, request):
        """ Unblock a user """
        blocked_id = request.data.get("blocked_id")
        if not blocked_id:
            return Response({"error": "blocked_id is required"}, status=400)

        UserBlock.objects.filter(blocker=request.user,
                                 blocked_id=blocked_id).delete()
        return Response({"message": "User unblocked successfully"})
