from django.urls import path
from .views import UserCertificateDetailView,UserCertificatesView,UserCertificateDownloadView,UserCertificateViewAPIView

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
    path(
            '<uuid:certificate_id>/view/',
            UserCertificateViewAPIView.as_view(),
            name='user-certificate-view'
        ),
]