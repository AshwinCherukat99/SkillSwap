from django.urls import path

from .views import (
    CreateCoursePaymentOrderView,
    VerifyCoursePaymentView,
    MentorRevenueView,
    MentorRequestPayoutView,
)

urlpatterns=[
    path(
        'course/create_order/',
        CreateCoursePaymentOrderView.as_view(),
        name='create-course-payment-order',
    ),
    path(
        'course/verify/',
        VerifyCoursePaymentView.as_view(),
        name='verify-course-payment',
    ),
    path(
        'mentor/revenue/',
        MentorRevenueView.as_view(),
        name='mentor-revenue',
    ),
    path(
        'mentor/payout/',
        MentorRequestPayoutView.as_view(),
        name='mentor-request-payout',
    ),
]