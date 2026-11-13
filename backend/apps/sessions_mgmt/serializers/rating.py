from rest_framework import serializers
from apps.accounts.models import UserRating

class SkillExchangeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserRating
        fields=['rating']
    def validate_rating(self,value):
        if value<1 or value>5:
            raise serializers.ValidationError(
                'rating must be between 1 and 5'
            )
        return value