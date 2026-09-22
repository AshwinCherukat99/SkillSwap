from django.urls import path

from .views import (
    NotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    UnreadNotificationCountView,
    ClearReadNotificationsView
)

urlpatterns=[
    path(
        '',
        NotificationListView.as_view(),
        name='notification-list',
    ),
    path(
        'unread_count/',
        UnreadNotificationCountView.as_view(),
        name='unread-notification-count',
    ),
    path(
            'read_all/',
            MarkAllNotificationsReadView.as_view(),
            name='mark-all-notifications-read',
        ),
    path(
            'clear_read/',
            ClearReadNotificationsView.as_view(),
            name='clear-read-notifications',
        ),
    path(
        '<int:notification_id>/read',
        MarkNotificationReadView.as_view(),
        name='mark-notification-read',
    ),
]