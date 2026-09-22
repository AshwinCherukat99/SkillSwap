"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

print("ASGI FILE LOADED")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import apps.sessions_mgmt.routing
import apps.chat.routing

from apps.chat.middleware import JWTAuthMiddleware

application = get_asgi_application()

application=ProtocolTypeRouter({
    'http':application,
    'websocket':JWTAuthMiddleware(
        URLRouter(
            apps.sessions_mgmt.routing.websocket_urlpatterns+
            apps.chat.routing.websocket_urlpatterns
        )
    )
})