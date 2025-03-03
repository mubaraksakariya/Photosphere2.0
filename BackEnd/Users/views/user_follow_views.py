from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db import transaction
from Users.models import FollowRequest, Follow
from Notification.services import create_notification
from Users.serializers import FollowRequestSerializer, FollowSerializer


class FollowRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing follow requests.
    """
    serializer_class = FollowRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve only follow requests where the user is the recipient.
        """
        return FollowRequest.objects.filter(target=self.request.user).select_related("requester", "target")

    @action(detail=True, methods=['POST'])
    def accept(self, request, pk=None):
        """
        Accepts a follow request and establishes a follower relationship.
        """
        follow_request = get_object_or_404(FollowRequest, id=pk)

        if follow_request.target != request.user:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        with transaction.atomic():
            # Create a follow relationship
            follow = Follow.objects.create(
                follower=follow_request.requester, followed=follow_request.target)

            # Delete the follow request
            follow_request.delete()

            # Send notification
            create_notification(
                sender=request.user,
                recipient=follow_request.requester,
                action_object=follow,
                notif_type="follow-accept",
                custom_message=f'you are now following {request.user.username}',
                request=request
            )

        return Response({"message": "Follow request accepted.", 'follow': FollowSerializer(follow).data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'])
    def reject(self, request, pk=None):
        """
        Rejects a follow request.
        """
        follow_request = get_object_or_404(FollowRequest, id=pk)

        if follow_request.target != request.user:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        follow_request.delete()

        return Response({"message": "Follow request rejected."}, status=status.HTTP_200_OK)
