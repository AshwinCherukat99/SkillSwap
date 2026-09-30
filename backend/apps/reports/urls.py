from django.urls import path
from .views import (CreateReportView,AdminReportListView,AdminReportDetailView,AdminReportStatsView)

urlpatterns=[
    path(
        'create/',
        CreateReportView.as_view(),
        name='create-report'
    ),
    path(
       'admin/',
       AdminReportListView.as_view(),
       name='admin-report-list',
    ),
    path(
        'admin/<int:report_id>/',
        AdminReportDetailView.as_view(),
        name='admin-report-detail',
    ),
    path(
        'admin/stats/',
        AdminReportStatsView.as_view(),
        name='admin-report-stats',
    ),
]