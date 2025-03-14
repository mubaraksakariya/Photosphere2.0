from django.db import models
from Users.models import User
from datetime import timedelta
from django.utils.timezone import now


class Story(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='stories')
    media_file = models.FileField(upload_to='stories/', blank=True)
    media_type = models.CharField(max_length=10, choices=[
        ('image', 'Image'), ('video', 'Video')], default='image')
    caption = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Set expires_at to 24 hours after created_at if not already set
        if not self.expires_at:
            self.expires_at = now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}'s story - {self.created_at}"

    class Meta:
        verbose_name_plural = "Stories"
        ordering = ['-created_at']


class StoryView(models.Model):
    story = models.ForeignKey(
        Story, on_delete=models.CASCADE, related_name='story_views')
    viewer = models.ForeignKey(User, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('story', 'viewer')
        ordering = ['-viewed_at']


class StoryLike(models.Model):
    story = models.ForeignKey(
        Story, on_delete=models.CASCADE, related_name='story_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('story', 'user')
        ordering = ['-created_at']


class StoryComment(models.Model):
    story = models.ForeignKey(
        Story, on_delete=models.CASCADE, related_name='story_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
