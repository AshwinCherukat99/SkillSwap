from django.urls import path

from .views import BadgeDashboardView,AdminBadgeListCreateView,AdminBadgeDetailView

urlpatterns=[
    path(
        '',
        BadgeDashboardView.as_view(),
        name='badge-dashboard',
    ),
    path(
        'admin/',
        AdminBadgeListCreateView.as_view(),
        name='admin-badge-list',
    ),
    path(
        'admin/<int:badge_id>/',
        AdminBadgeDetailView.as_view(),
        name='admin-badge-detail',
    ),
]