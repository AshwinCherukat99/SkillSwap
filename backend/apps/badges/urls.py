from django.urls import path

from .views import BadgeDashboardView

urlpatterns=[
    path(
        '',
        BadgeDashboardView.as_view(),
        name='badge-dashboard',
    ),
]