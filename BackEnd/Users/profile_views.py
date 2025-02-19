from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Profile
from .serializers import UserProfileSerializer


class ProfileViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Support file uploads

    def get_queryset(self):
        """Allow users to update only their own profile."""
        return Profile.objects.filter(user=self.request.user)

    def get_object(self):
        """Ensure a user can only access their own profile."""
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        remove_image = request.data.get('remove_image', 'false') == 'true'

        if remove_image and profile.profile_image:
            profile.profile_image.delete()  # Deletes the uploaded image from storage
            profile.profile_image = profile._meta.get_field(
                'profile_image').get_default()  # ✅ Set default image
            profile.save()  # ✅ Save changes to the database

        return super().update(request, *args, **kwargs)
