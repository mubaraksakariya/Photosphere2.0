from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling user notifications.
    Provides:
    - List of all notifications
    - Fetching only unread notifications
    - Marking notifications as read
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Fetch notifications for the authenticated user."""
        return Notification.objects.filter(user=self.request.user).select_related('sender').order_by('-created_at')

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Fetch latest 10 notifications, prioritizing unread."""
        queryset = self.get_queryset()

        # Prioritize unread notifications
        unread_queryset = queryset.filter(is_read=False)[:10]

        # If we already have 10 unread, return them
        if unread_queryset.count() >= 10:
            serializer = self.get_serializer(unread_queryset, many=True)
            return Response(serializer.data)

        # Get additional latest notifications excluding already fetched unread ones
        latest_queryset = queryset.exclude(is_read=False).order_by(
            '-created_at')[:10 - unread_queryset.count()]

        # Use union() to ensure uniqueness at DB level
        final_queryset = unread_queryset.union(
            latest_queryset).order_by('-created_at')

        serializer = self.get_serializer(final_queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'], url_path='mark-as-read')
    def mark_as_read(self, request):
        """Marks the first 10 unread notifications as read."""
        notifications = list(self.get_queryset().filter(
            is_read=False)[:10])  # Fetch as a list

        updated_count = len(notifications)  # Get count before updating
        for notification in notifications:
            notification.is_read = True
        Notification.objects.bulk_update(
            notifications, ["is_read"])  # Bulk update

        return Response({"message": f"{updated_count} notifications marked as read."}, status=200)
