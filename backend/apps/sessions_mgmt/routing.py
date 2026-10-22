from django.urls import re_path

from .consumers import VideoCallConsumer

print('VIDEO ROUTING LOADED')

websocket_urlpatterns=[
    re_path(
        r"ws/video/(?P<room_name>[-\w]+)/(?P<conversation_id>\d+)/$",
        VideoCallConsumer.as_asgi(),
    ),
]