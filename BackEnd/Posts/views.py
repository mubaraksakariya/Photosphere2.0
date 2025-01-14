from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Post, Hashtag, PostHashtag
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        """
        Override this method to set permissions dynamically based on the action.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]

        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Custom create view logic where authentication and post creation are handled.
        """
        print(request.data)
        serializer = self.get_serializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            # Additional logic can go here before saving, such as checking user status, etc.
            post = serializer.save()  # The save method triggers the create in the serializer
            return Response(self.get_serializer(post).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
