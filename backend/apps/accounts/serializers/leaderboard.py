from rest_framework import serializers

from apps.accounts.models import User

class LeaderBoardUserSerializer(serializers.ModelSerializer):
    rank=serializers.IntegerField(read_only=True)
    rating=serializers.FloatField(read_only=True)
    rating_count=serializers.IntegerField(read_only=True)
    level=serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=[
            'id',
            'username',
            'full_name',
            'profile_image',
            'xp',
            'current_streak',
            'level',
            'rating',
            'rating_count',
            'rank',
        ]
    def get_level(self,obj):
        return (obj.xp//500)+1