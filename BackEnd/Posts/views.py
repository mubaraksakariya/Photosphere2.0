from rest_framework.response import Response
from rest_framework import status, viewsets

from Notification.services import create_notification
from Posts.pagination import CustomCommentPagination, CustomPagination
from Users.models import Follow
from Users.services import get_user
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

        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]

        return super().get_permissions()

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        user = self.request.user  # Requesting user
        # get posts of specific user, for profile page
        if user_id:
            target_user = get_user(identifier=user_id)
            # Check if the target user is public or if the requesting user follows them
            is_following = Follow.objects.filter(
                follower=user, followed=target_user).exists()
            # Fetch directly from UserSettings
            is_public = target_user.settings.is_profile_public

            if is_public or is_following or user == target_user:
                return Post.objects.filter(user=target_user)

            # If private and not following, return empty queryset
            return Post.objects.none()

        if not user:
            # Fetch only public profile posts for unauthenticated users
            return Post.objects.filter(user__settings__is_profile_public=True)

        # Step 1: Get followed users
        followed_users = Follow.objects.filter(
            follower=user).values_list('followed', flat=True)

        # Step 2: Fetch posts from followed users (including private profiles)
        followed_posts = Post.objects.filter(user_id__in=followed_users)

        # Step 3: Fetch posts from public profiles (checking UserSettings)
        public_posts = Post.objects.filter(
            user__settings__is_profile_public=True)
        # step 4: Fetch user's own posts
        self_posts = Post.objects.filter(user=user)
        # Step 5: Combine both queries (avoiding duplicates)
        queryset = followed_posts | public_posts | self_posts

        return queryset.distinct().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """
        Creates a new post with hashtags and media files.

        This method overrides the default create behavior to handle hashtags and file uploads.
        It processes the hashtags, creates a mutable copy of the request data, and handles
        file uploads separately.

        Args:
            request: The HTTP request object containing post data and files
            *args: Variable length argument list
            **kwargs: Arbitrary keyword arguments

        Returns:
            Response: HTTP response with:
                - 201 Created and serialized post data on success
                - 400 Bad Request with error details on validation failure

        Example request data:
            {
                'description': 'Post text',
                'media_type': 'image',
                'media': [file],
                'hashtags': ['tag1', 'tag2']
            }
        """
        hashtags_data = request.data.getlist('hashtags')
        cleaned_hashtags = [tag.strip()
                            for tag in hashtags_data if tag.strip()]

        # Create a mutable copy of request.data
        mutable_data = request.data.dict()
        mutable_data['hashtags'] = cleaned_hashtags

        # Include files separately
        files = request.FILES

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
        return Response({'is_liked': created, 'post': PostSerializer(post, context={'request': request}).data}, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomCommentPagination

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
                post=post).order_by('-created_at')[:3]
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        serialized_comments = self.get_serializer(comments, many=True).data
        return Response({'comments': serialized_comments}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='paginated-comments')
    def paginated_comments(self, request, pk=None):
        """
        Returns paginated comments of a specific post.
        """
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        comments = Comment.objects.filter(
            post=post).order_by('-created_at')  # Newest first
        paginator = self.pagination_class()
        paginated_comments = paginator.paginate_queryset(comments, request)

        serialized_comments = self.get_serializer(
            paginated_comments, many=True)
        return paginator.get_paginated_response(serialized_comments.data)
