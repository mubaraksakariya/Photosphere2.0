"""
URL configuration for Photosphere project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from Chat.views.chat import GetOrCreateChatRoomView, MessageViewSet
from Chat.views.chat_room_messages import MessageListCreateView
from Chat.views.favorites import FavoriteChatListView
from Chat.views.recent_chats import RecentChatUsersView
from Notification.views import NotificationViewSet
from Posts.views import CommentViewSet, LikeViewSet, PostViewSet
from Stories.views import StoryViewSet
from Users.CustomTokenObtain import CustomTokenObtainPairView
from Users.views.profile_views import ProfileViewSet
from Users.views.user_account_views import PasswordResetConfirmView, PasswordResetRequestView
from Users.views.user_block_view import UserBlockViewSet
from Users.views.user_follow_views import FollowRequestViewSet
from Users.views.user_settings_view import UserSettingsViewSet
from Users.views.user_views import GoogleSignInView, ResendOTPView, SignupView, UserViewSet, VerifyOTPView

router = routers.DefaultRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/posts', PostViewSet, basename='post')
router.register(r'api/likes', LikeViewSet, basename='like')
router.register(r'api/comments', CommentViewSet, basename='comment')
router.register(r'api/stories', StoryViewSet, basename='story')
# router.register(r'chat/(?P<chat_room_id>\d+)/messages',
#                 MessageViewSet, basename='message')
router.register(r'api/notifications', NotificationViewSet,
                basename='notifications')
router.register(r'api/profiles', ProfileViewSet, basename='profile')
router.register(r'api/user-settings', UserSettingsViewSet,
                basename='user-settings')
router.register('api/user-blocks', UserBlockViewSet, basename="userblock")
router.register(r'api/follow-requests', FollowRequestViewSet,
                basename='follow-requests')


urlpatterns = [
    path('api/signin/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/google-signin/', GoogleSignInView.as_view(), name='google_signin'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/verify/', VerifyOTPView.as_view(), name='verify'),
    path('api/resend-otp/', ResendOTPView.as_view(), name='resend_otp'),

    # Chat
    path('api/chat/favorites/', FavoriteChatListView.as_view(),
         name='favorite-chats'),
    path('api/chat/recent/', RecentChatUsersView.as_view(),
         name='recent-chats'),
    path('api/chat/get-or-create-room/<int:user_id>/',
         GetOrCreateChatRoomView.as_view(), name='get-or-create-chat-room'),
    path('api/chat/<int:chat_room_id>/messages/',
         MessageListCreateView.as_view(), name='message-list-create'),

    path("api/password-reset/", PasswordResetRequestView.as_view(),
         name="password_reset"),
    path("api/password-reset-confirm/", PasswordResetConfirmView.as_view(),
         name="password_reset_confirm"),

]+router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
