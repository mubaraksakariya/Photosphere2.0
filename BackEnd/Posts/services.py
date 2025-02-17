from Posts.models import Post
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db import DatabaseError


def update_post_count(user):
    """
    Update the post_count field of the User profile.
    """
    try:
        post_count = Post.objects.filter(user=user).count()
        user.profile.post_count = post_count
        user.profile.save()
        return user
    except ObjectDoesNotExist:
        # Raise an exception if the user profile does not exist
        raise ObjectDoesNotExist("User profile does not exist.")
    except MultipleObjectsReturned:
        # Raise an exception if multiple user profiles are returned
        raise MultipleObjectsReturned("Multiple user profiles found.")
    except DatabaseError as e:
        # Raise an exception for other database errors
        raise DatabaseError(f"Database error: {e}")
    except Exception as e:
        # Raise an exception for any other unexpected errors
        raise Exception(f"An unexpected error occurred: {e}")
