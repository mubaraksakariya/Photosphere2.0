from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from Stories.pagination import CustomPagination
from .models import Story, StoryView, StoryLike, StoryComment
from .serializers import StorySerializer, StoryCommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist


class StoryViewSet(ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='view')
    def register_view(self, request, pk=None):
        story = self.get_object()

        # Register a view by the user for the story
        StoryView.objects.get_or_create(story=story, viewer=request.user)

        # Fetch the updated story object
        updated_story = Story.objects.get(id=story.id)

        # Return the response with the serialized story data
        return Response(
            {
                'message': 'Story view registered successfully.',
                'story': self.get_serializer(updated_story).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='like')
    def toggle_like(self, request, pk=None):
        story = self.get_object()

        like, created = StoryLike.objects.get_or_create(
            story=story, user=request.user)

        if created:
            status_type = status.HTTP_201_CREATED
            message = 'Story liked successfully.',
        else:
            like.delete()
            status_type = status.HTTP_200_OK
            message = 'Story unliked successfully.'
        serialized_story = StorySerializer(
            self.get_object(), context={'request': request}).data

        return Response({'message': message, 'story': serialized_story}, status=status_type)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='comments')
    def add_comment(self, request, pk=None):
        try:
            # Get the story object; this could raise an ObjectDoesNotExist exception
            story = self.get_object()
        except ObjectDoesNotExist:
            return Response({"error": "Story not found."}, status=status.HTTP_404_NOT_FOUND)
        print(request.data)
        # Validate the request data using the serializer
        serializer = StoryCommentSerializer(data=request.data)
        try:
            # Raise exception if invalid
            serializer.is_valid(raise_exception=True)
            serializer.save(story=story, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ve:
            print(f"Validation error for comment on story {pk}: {ve}")
            return Response({"error": "Invalid data.", "details": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return Response({"error": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
