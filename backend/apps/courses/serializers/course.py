from rest_framework import serializers
from ..models import Course

class CourseListSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(
        source='category.name',
        read_only=True
    )
    mentor_name=serializers.SerializerMethodField()
    mentor_rating=serializers.DecimalField(
        source='mentor.rating',
        max_digits=3,
        decimal_places=2,
        read_only=True,
    )
    thumbnail_url=serializers.SerializerMethodField()
    progress=serializers.SerializerMethodField()
    student_count=serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "thumbnail_url",
            "category",
            "category_name",
            "level",
            "price",
            "estimated_duration",
            "mentor_name",
            "mentor_rating",
            "student_count",
            "progress",
        ]
    def get_mentor_name(self,obj):
        return obj.mentor.full_name or obj.mentor.username
    def get_thumbnail_url(self,obj):
        if not obj.thumbnail:
            return None
        request=self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail.url
    def get_student_count(self,obj):
        return obj.enrollments.count()
    def get_progress(self,obj):
        request=self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        enrollment=obj.enrollments.filter(
            user=request.user
        ).first()
        if enrollment:
            return enrollment.progress
        return None