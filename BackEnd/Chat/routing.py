from django.urls import path
from .consumers import ChatConsumer

chat_socket_urlpatterns = [
    path('ws/chat/', ChatConsumer.as_asgi()),
]
