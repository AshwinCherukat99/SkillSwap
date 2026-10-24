"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

print("ASGI FILE LOADED")

application = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter

import apps.sessions_mgmt.routing
import apps.chat.routing
import apps.notifications.routing

from apps.chat.middleware import JWTAuthMiddleware

application=ProtocolTypeRouter({
    'http':application,
    'websocket':JWTAuthMiddleware(
        URLRouter(
            apps.sessions_mgmt.routing.websocket_urlpatterns+
            apps.chat.routing.websocket_urlpatterns+
            apps.notifications.routing.websocket_urlpatterns
        )
    )
})