from django.urls import path
from .views import AdminLoginView,MentorVerificationDetailView,ApproveMentorView,RequestMentorInfoView,RejectMentorView,MentorVerificationListView

urlpatterns=[
    path('login/',AdminLoginView.as_view(),name='admin-login'),
    path('mentor-verification/',MentorVerificationListView.as_view(),name='mentor-verification-list'),
    path('mentors/<int:mentor_id>/verification/',MentorVerificationDetailView.as_view(),name='mentor-verification-detail'),
    path('mentors/<int:mentor_id>/verification/reject/',RejectMentorView.as_view(),name='reject-mentor',),
    path('mentors/<int:mentor_id>/verification/approve/',ApproveMentorView.as_view(),name='approve-mentor',),
    path('mentors/<int:mentor_id>/verification/request-info/',RequestMentorInfoView.as_view(),name='request-mentor-info',),
]