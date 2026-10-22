from django.urls import path

from .views import BadgeDashboardView,AdminBadgeListCreateView,AdminBadgeDetailView,EvaluateMyBadgesView

urlpatterns=[
    path(
        '',
        BadgeDashboardView.as_view(),
        name='badge-dashboard',
    ),
    path(
        'evaluate/',
        EvaluateMyBadgesView.as_view(),
        name='evaluate-my-badges',
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