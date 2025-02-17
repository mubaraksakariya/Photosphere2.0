from rest_framework.response import Response
from rest_framework import status, viewsets

from Notification.services import create_notification
from Posts.pagination import CustomPagination
from .models import Like, Post, Comment
from .serializers import CommentSerializer, LikeSerializer, PostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from .services import update_post_count


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = CustomPagination
    # filter_backends = [OrderingFilter]
    # ordering = ['-created_at']

    def get_permissions(self):
        """
        Override this method to set permissions dynamically based on the action.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]

        return super().get_permissions()

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            # Assuming Post has a foreign key to User
            return Post.objects.filter(user_id=user_id)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        hashtags_data = request.data.getlist('hashtags')
        cleaned_hashtags = [tag.strip()
                            for tag in hashtags_data if tag.strip()]

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()
        mutable_data.setlist('hashtags', cleaned_hashtags)

        serializer = self.get_serializer(
            data=mutable_data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            update_post_count(request.user)
            return Response(self.get_serializer(post).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        """
        Filter likes by post if 'post' query parameter is provided.
        """
        post_id = self.request.query_params.get('post')
        if post_id:
            return Like.objects.filter(post_id=post_id)
        return super().get_queryset()

    @action(detail=True, methods=['post'], url_path='toggle')
    def toggle_like(self, request, pk=None):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(
            user=request.user, post=post)
        if created:
            # Create a notification for the post owner
            if post.user != request.user:  # Avoid notifying self-likes
                create_notification(
                    sender=request.user,
                    recipient=post.user,
                    action_object=post,
                    notif_type="liked"
                )

        else:
            like.delete()
        return Response({'is_liked': created}, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    @action(detail=False, methods=['post'], url_path='write')
    def write_comment(self, request):
        post_id = request.data.get('post_id')
        user = request.user
        comment = request.data.get('comment')

        post = Post.objects.get(id=post_id)

        new_comment = Comment.objects.create(
            post=post,
            user=user,
            text=comment
        )
        # Create a notification for the post owner
        if post.user != request.user:  # Avoid notifying self-likes
            create_notification(
                sender=request.user,
                recipient=post.user,
                action_object=post,
                notif_type="commented"
            )
        serialized_comment = self.get_serializer(new_comment).data
        return Response({'new_comment': serialized_comment}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='recent-post-comments')
    def recent_comments(self, request, pk=None):
        try:
            post = Post.objects.get(id=pk)
            comments = Comment.objects.filter(
                post=post).order_by('created_at')[:3]
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        serialized_comments = self.get_serializer(comments, many=True).data
        return Response({'comments': serialized_comments}, status=status.HTTP_200_OK)
