from django.urls import path
from .views import CourseListView,StartAssessmentView,MentorCourseManagementView,MentorStudentsView,CourseCategoryListView,MentorCourseDetailView,UserCourseDetailView,CourseEnrollView,MentorCourseUpdateView

urlpatterns=[
    path("", CourseListView.as_view(), name="course-list"),
    path(
        '<int:course_id>/assessment/start/',
        StartAssessmentView.as_view(),
        name='start-assessment',
    ),  
    path(
        'mentor/management/',
        MentorCourseManagementView.as_view(),
        name='mentor-course-management',
    ),
    path(
        'mentor/students/',
        MentorStudentsView.as_view(),
        name='mentor-students'
    ),
    path(
        'categories/',
        CourseCategoryListView.as_view(),
        name='course-category-list'
    ),
    path(
        'mentor/courses/<int:course_id>',
        MentorCourseDetailView.as_view(),
        name='mentor-course-detail',
    ),
    path(
        '<int:course_id>/',
        UserCourseDetailView.as_view(),
        name='user-course-detail',
    ),
    path(
        '<int:course_id>/enroll/',
        CourseEnrollView.as_view(),
        name='course-enroll',
    ),
    path(
        'mentor/courses/<int:course_id>/edit',
        MentorCourseUpdateView.as_view(),
        name='mentor-course-update',
    ),
]