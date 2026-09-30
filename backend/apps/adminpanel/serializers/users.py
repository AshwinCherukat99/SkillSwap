from rest_framework import serializers
from apps.accounts.models import User

class AdminUserSerializer(serializers.ModelSerializer):
    profile_image=serializers.SerializerMethodField()
    status_display=serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    class Meta:
        model=User
        fields=[
            'id',
            'username',
            'email',
            'full_name',
            'bio',
            'location',
            'phone_number',
            'profile_image',
            'role',
            'status',
            'status_display',
            'xp',
            'current_streak',
            'date_joined',
            'last_login',
            'is_active',
        ]
    def get_profile_image(self,obj):
        if not obj.profile_image:
            return None
        request=self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.profile_image.url)
        return obj.profile_image.url