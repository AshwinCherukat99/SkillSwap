from django.urls import path

from .views import (
    SkillsIWantView,
    SkillsIOfferView, 
    RemoveSkillView,
    SuggestSkillView,
    ApproveSkillSuggestionView,
    SkillListView,
) 

urlpatterns=[
    path('',
         SkillListView.as_view(),
         name='skill-list',
         ),
    path(
        'want/',
        SkillsIWantView.as_view(),
        name='skills-i-want',
    ),
    path(
        'offer/',
        SkillsIOfferView.as_view(),
        name='skills-i-offer',
    ),
    path(
        '<str:skill_type>/<int:skill_id>/',
        RemoveSkillView.as_view(),
        name='remove-user-skill',
    ),
    path(
        'suggest/',
        SuggestSkillView.as_view(),
        name='suggest-skill',
    ),
    path(
        'suggestions/<int:suggestion_id>/approve/',
        ApproveSkillSuggestionView.as_view(),
        name='approve-skill-suggestion',
    ),
]