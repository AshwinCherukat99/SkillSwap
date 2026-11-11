from django.urls import path
from .views import StoryListCreateView,StoryDetailView,StoryViewCreateView,StoryViewerListView,StoryReactionView,MyStoriesView

urlpatterns=[
    path(
        '',
        StoryListCreateView.as_view(),
        name='story-list-create'
    ),
    path(
        'me/',
        MyStoriesView.as_view(),
        name='my-stories'
    ),
    path(
        '<int:story_id>/',
        StoryDetailView.as_view(),
        name='story-detail'
    ),
    path(
        '<int:story_id>/view/',
        StoryViewCreateView.as_view(),
        name='story-view'
    ),
    path(
        '<int:story_id>/viewers/',
        StoryViewerListView.as_view(),
        name='story-viewers'
    ),
    path(
        '<int:story_id>/react/',
        StoryReactionView.as_view(),
        name='story-reaction'
    )
]