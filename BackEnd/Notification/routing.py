from django.urls import re_path
from .consumers import NotificationConsumer

notification_socket_urlpatterns = [
    re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
]
