"""
ASGI config for Photosphere project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

from Chat.routing import chat_socket_urlpatterns
from Notification.routing import notification_socket_urlpatterns
from channels.routing import ProtocolTypeRouter, URLRouter
import os

from django.core.asgi import get_asgi_application

from Photosphere.Middlewares.socket_auth_middleware import SocketJWTAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Photosphere.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": SocketJWTAuthMiddleware(
        URLRouter(
            chat_socket_urlpatterns + notification_socket_urlpatterns
        )
    ),
})
