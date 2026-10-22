from django.urls import path
from .views import UserCertificateDetailView,UserCertificatesView,UserCertificateDownloadView

urlpatterns=[
    path(
        '',
        UserCertificatesView.as_view(),
        name='user-certificates',
    ),
    path(
        '<uuid:certificate_id>/',
        UserCertificateDetailView.as_view(),
        name='user-certificate-detail',
    ),
    path(
        '<uuid:certificate_id>/download/',
        UserCertificateDownloadView.as_view(),
        name='user-certificate-download'
    ),
]