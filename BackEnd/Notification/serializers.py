from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from Users.serializers import UserSerializer
from .models import Notification
from django.apps import apps
import importlib


class NotificationSerializer(serializers.ModelSerializer):
    action_object_type = serializers.SerializerMethodField()
    action_object_id = serializers.SerializerMethodField()
    action_object_details = serializers.SerializerMethodField()  # Full object details
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'sender', 'message',
            'notification_type', 'is_read', 'created_at',
            'action_object_type', 'action_object_id', 'action_object_details'  # Include details
        ]
        read_only_fields = ['id', 'created_at', 'sender',
                            'action_object_type', 'action_object_id', 'action_object_details']

    def get_action_object_type(self, obj):
        """Returns the type of the action object."""
        return obj.content_type.model if obj.content_type else None

    def get_action_object_id(self, obj):
        """Returns the ID of the related action object."""
        return obj.object_id if obj.object_id else None

    def get_action_object_details(self, obj):
        """Returns the serialized details of the related action object."""
        if obj.content_type and obj.object_id:
            model_class = obj.content_type.model_class()
            if model_class:
                try:
                    action_object = model_class.objects.get(id=obj.object_id)
                    serializer_class = self.get_serializer_for_model(
                        model_class)
                    if serializer_class:
                        request = self.context.get('request')
                        if request:
                            return serializer_class(action_object, context={'request': request}).data
                        return serializer_class(action_object).data
                except model_class.DoesNotExist:
                    return None
        return None

    def get_serializer_for_model(self, model_class):
        """Dynamically fetches the serializer for a given model."""
        # print(model_class)
        try:
            app_label = model_class._meta.app_label
            serializer_module_path = f"{app_label}.serializers"
            serializer_class_name = f"{model_class.__name__}Serializer"

            # Dynamically import the serializers module
            serializers_module = importlib.import_module(
                serializer_module_path)

            # Get the serializer class dynamically
            serializer_class = getattr(
                serializers_module, serializer_class_name, None)

            return serializer_class
        except ModuleNotFoundError as e:
            print(f"Module not found: {e}")
            return None
        except Exception as e:
            print(f"Error loading serializer for {model_class.__name__}: {e}")
            return None
