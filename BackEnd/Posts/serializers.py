from rest_framework import serializers
from .models import Post, Hashtag, PostHashtag
from django.db import transaction


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'tag']


class PostSerializer(serializers.ModelSerializer):
    hashtags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True
    )

    class Meta:
        model = Post
        fields = ['id', 'user', 'description',
                  'media_type', 'media', 'hashtags']
        read_only_fields = ['user']

    def create(self, validated_data):
        """
        Handle creation of a post, including processing hashtags.
        """
        # Assign the user from the validated data
        user = self.context['request'].user
        print(user)
        if not user:
            raise serializers.ValidationError("User is required")

        hashtags = validated_data.pop('hashtags', [])
        with transaction.atomic():
            post = Post.objects.create(user=user, **validated_data)
            for tag in hashtags:
                hashtag_obj, _ = Hashtag.objects.get_or_create(tag=tag)
                PostHashtag.objects.create(post=post, hashtag=hashtag_obj)
        return post

    def to_representation(self, instance):
        """Customize the output to include detailed hashtags."""
        representation = super().to_representation(instance)
        hashtags = instance.posthashtag_set.all().select_related('hashtag')
        representation['hashtags'] = [
            {'id': h.hashtag.id, 'tag': h.hashtag.tag} for h in hashtags
        ]
        return representation
