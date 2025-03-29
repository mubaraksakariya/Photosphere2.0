import os
from django.db import transaction, IntegrityError
from rest_framework import serializers

from Users.serializers import UserSerializer
from .models import Like, Post, Hashtag, PostHashtag, Comment, Share
from rest_framework.exceptions import ValidationError


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'tag']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['user', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    hashtags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        write_only=True
    )
    user = UserSerializer(read_only=True)
    BACK_END_BASE_URL = os.environ.get("BACK_END_BASE_URL")

    class Meta:
        model = Post
        fields = ['id', 'user', 'description',
                  'media_type', 'media', 'hashtags']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        if not user.is_authenticated:
            raise ValidationError("User is not authenticated")

        hashtags = validated_data.pop('hashtags', [])
        with transaction.atomic():
            post = Post.objects.create(user=user, **validated_data)

            hashtag_objects = set()
            for tag in hashtags:
                hashtag_obj, _ = Hashtag.objects.get_or_create(tag=tag)
                hashtag_objects.add(PostHashtag(
                    post=post, hashtag=hashtag_obj))

            # Bulk insert to reduce database hits
            PostHashtag.objects.bulk_create(
                hashtag_objects, ignore_conflicts=True)

        return post

    def to_representation(self, instance):
        """Customize the output to include detailed hashtags."""
        user = getattr(self.context.get('request'), 'user', None)
        is_liked = Like.objects.filter(post=instance, user=user).exists()
        representation = super().to_representation(instance)
        hashtags = instance.posthashtag_set.all().select_related('hashtag')
        likes_count = Like.objects.filter(post=instance).count()
        share_count = Share.objects.filter(post=instance).count()
        comments_count = Comment.objects.filter(post=instance).count()
        representation['hashtags'] = [
            {'id': h.hashtag.id, 'tag': h.hashtag.tag} for h in hashtags
        ]
        representation['likes_count'] = likes_count
        representation['is_liked'] = is_liked
        representation['comments_count'] = comments_count
        representation['share_count'] = share_count
        if instance.media and not self.context.get("request"):
            representation['media'] = f"{self.BACK_END_BASE_URL}{instance.media.url}"
        return representation
