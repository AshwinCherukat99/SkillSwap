from django.urls import path
from .views import AdminLoginView,MentorVerificationDetailView,ApproveMentorView,RequestMentorInfoView,RejectMentorView,MentorVerificationListView,AdminCourseManagementView,AdminCourseDetailView,AdminCourseApproveView,AdminCourseRejectView,AdminSkillListCreateView,AdminSkillDeleteView,AdminSuggestedSkillListView,AdminApproveSuggestedSkillView,AdminRejectSuggestedSkillView,AdminReviewManagementView,AdminHideReviewView,AdminRevealReviewView,AdminRemoveReviewView,AdminReviewReportsView,AdminReviewReportUpdateView

urlpatterns=[
    path('login/',AdminLoginView.as_view(),name='admin-login'),
    path('mentor-verification/',MentorVerificationListView.as_view(),name='mentor-verification-list'),
    path('mentors/<int:mentor_id>/verification/',MentorVerificationDetailView.as_view(),name='mentor-verification-detail'),
    path('mentors/<int:mentor_id>/verification/reject/',RejectMentorView.as_view(),name='reject-mentor',),
    path('mentors/<int:mentor_id>/verification/approve/',ApproveMentorView.as_view(),name='approve-mentor',),
    path('mentors/<int:mentor_id>/verification/request-info/',RequestMentorInfoView.as_view(),name='request-mentor-info',),
    path('courses/',AdminCourseManagementView.as_view(),name='admin-course-management'),
    path('courses/<int:course_id>/',AdminCourseDetailView.as_view(),name='admin-course-detail'),
    path('courses/<int:course_id>/approve/',AdminCourseApproveView.as_view(),name='admin-course-approve'),
    path('courses/<int:course_id>/reject/',AdminCourseRejectView.as_view(),name='admin-course-reject'),
    path('admin/skills',AdminSkillListCreateView.as_view(),name='admin-skill-list-create'),
    path('admin/skills/<int:skill_id>/',AdminSkillDeleteView.as_view(),name='admin-skill-delete'),
    path('admin/skill-suggestions/',AdminSuggestedSkillListView.as_view(),name='admin-skill-suggestions'),
    path('admin/skill-suggestions/<int:suggestion_id>/approve',AdminApproveSuggestedSkillView.as_view(),name='admin-approve-suggested-skill'),
    path('admin/skill-suggestions/<int:suggestion_id>/reject',AdminRejectSuggestedSkillView.as_view(),name='admin-reject-suggested-skill'),
    path('reviews/',AdminReviewManagementView.as_view(),name='admin-review-management'),
    path('reviews/<int:review_id>/hide/',AdminHideReviewView.as_view(),name='admin-hide-review'),
    path('reviews/<int:review_id>/reveal/',AdminRevealReviewView.as_view(),name='admin-reveal-review'),
    path('reviews/<int:review_id>/',AdminRemoveReviewView.as_view(),name='admin-remove-review'),
    path('reviews/<int:review_id>/reports/',AdminReviewReportsView.as_view(),name='admin-review-reports'),
    path('reviews/<int:review_id>/reports/<int:report_id>/',AdminReviewReportUpdateView.as_view(),name='admin-review-report-update'),
]