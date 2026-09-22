from rest_framework import serializers
from django.db.models import Avg
from apps.skills.models import Skill

class RecommendedUserSerializer(serializers.Serializer):
    id=serializers.IntegerField(
        source='user.id'
    )
    username=serializers.CharField(
        source='user.username'
    )
    full_name=serializers.CharField(
        source='user.full_name'
    )
    profile_image=serializers.ImageField(
        source='user.profile_image',
        required=False,
        allow_null=True
    )
    skills_to_learn=serializers.SerializerMethodField()
    skills_to_teach=serializers.SerializerMethodField()
    match_score=serializers.IntegerField()
    def get_skills_to_learn(self,obj):
        skills=Skill.objects.filter(
            id__in=obj['skills_to_learn_ids']
        )
        return [
            {
                'id':skill.id,
                'name':skill.name,
                'slug':skill.slug,
            }
            for skill in skills
        ]
    def get_skills_to_teach(self,obj):
            skills=Skill.objects.filter(
                id__in=obj['skills_to_teach_ids']
            )
            return [
                {
                    'id':skill.id,
                    'name':skill.name,
                    'slug':skill.slug,
                }
                for skill in skills
            ]
    def get_average_rating(self,obj):
         user=obj['user']
         average_rating=(user.received_rating.aggregate(
              average=Avg('rating')
         )['average'] or 0)
         return round(
              average_rating,
              1
         )