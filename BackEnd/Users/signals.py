from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Follow, User, Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=Follow)
def increase_count(sender, instance, created, **kwargs):
    if created:
        # Increase the following count of the follower's profile
        instance.follower.profile.following_count += 1
        instance.follower.profile.save()

        # Increase the followers count of the followed user's profile
        instance.followed.profile.followers_count += 1
        instance.followed.profile.save()


@receiver(pre_delete, sender=Follow)
def decrease_count(sender, instance, **kwargs):
    # Decrease the following count of the follower's profile
    instance.follower.profile.following_count = max(
        0, instance.follower.profile.following_count - 1
    )
    instance.follower.profile.save()

    # Decrease the followers count of the followed user's profile
    instance.followed.profile.followers_count = max(
        0, instance.followed.profile.followers_count - 1
    )
    instance.followed.profile.save()
