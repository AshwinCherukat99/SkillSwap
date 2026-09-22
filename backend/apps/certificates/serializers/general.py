from rest_framework import serializers
from ..models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    course_title=serializers.CharField(
        source='course.title',
        read_only=True
    )
    course_slug=serializers.CharField(
        source='course.slug',
        read_only=True
    )
    course_category=serializers.CharField(
        source='course.category.name',
        read_only=True
    )
    username=serializers.CharField(
        source='user.username',
        read_only=True
    )
    class Meta:
        model=Certificate
        fields=[
            'certificate_id',
            'certificate_number',
            'username',
            'course_title',
            'course_slug',
            'course_category',
            'issued_at',
            'is_valid',
            'score'
        ]
        read_only_fields=fields