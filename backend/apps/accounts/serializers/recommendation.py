from rest_framework import serializers
from django.db.models import Avg,Q
from apps.skills.models import Skill
from apps.accounts.models import Friendship

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
    friendship_status=serializers.SerializerMethodField()
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
    def get_friendship_status(self,obj):
         current_user=self.context['request'].user
         recommended_user=obj['user']
         friendship=Friendship.objects.filter(
              Q(sender=current_user,receiver=recommended_user)|
              Q(sender=recommended_user,receiver=current_user)
         ).first()
         if not friendship:
            return 'NONE'
         return friendship.status