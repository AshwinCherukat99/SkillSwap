from rest_framework import serializers
from apps.accounts.models import UserRating

class MentorReviewSerializer(serializers.ModelSerializer):
    reviewer_name=serializers.SerializerMethodField()
    reviewer_username=serializers.CharField(
        source='rated_by.username',
        read_only=True
    )
    reviewer_image=serializers.SerializerMethodField()
    class Meta:
        model=UserRating
        fields=[
            'id',
            'reviewer_name',
            'reviewer_username',
            'reviewer_image',
            'rating',
            'review',
            'created_at',
        ]
        read_only_fields=[
            'id',
            'reviewer_name',
            'reviewer_username',
            'reviewer_image',
            'created_at',
        ]
    def get_reviewer_name(self,obj):
        return (
            obj.rated_by.get_full_name() or obj.rated_by.username
        )
    def get_reviewer_image(self,obj):
        user=obj.rated_by
        if hasattr(user,'profile_image') and user.profile_image:
            request=self.context.get('request')
            if request:
                return request.build_absolute_uri(
                    user.profile_image.url
                )
        return None