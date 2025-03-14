from rest_framework import serializers

from Users.serializers import UserSerializer
from .models import Story, StoryLike, StoryComment, StoryView
from datetime import timedelta
from django.utils.timezone import now


class StoryCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryComment
        fields = ['story', 'user', 'comment', 'created_at']
        read_only_fields = ['story', 'user', 'created_at']


class StoryLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryLike
        fields = ['story', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']


class StoryViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryView
        fields = ['story', 'viewer', 'viewed_at']
        read_only_fields = ['viewer', 'viewed_at']


class StorySerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()
    is_viewed = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)  # Mark user as read-only

    class Meta:
        model = Story
        fields = [
            'id', 'user', 'caption', 'media_file', 'media_type', 'created_at',
            'expires_at', 'likes_count', 'comments_count', 'views_count', 'is_viewed', 'is_liked'
        ]
        read_only_fields = [
            'user',
            'created_at',
            'expires_at',
            'likes_count',
            'comments_count',
            'views_count',
            'is_viewed',
            'is_liked'
        ]

    def create(self, validated_data):
        # Set the expiration time automatically
        validated_data['expires_at'] = now() + timedelta(hours=24)
        # Assign the user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def get_likes_count(self, obj):
        return obj.story_likes.count()

    def get_comments_count(self, obj):
        return obj.story_comments.count()

    def get_views_count(self, obj):
        return obj.story_views.count()

    def get_is_viewed(self, obj):
        return getattr(obj, "has_viewed", False)  # Use annotated value

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return StoryLike.objects.filter(story=obj, user=request.user).exists()
        return False
