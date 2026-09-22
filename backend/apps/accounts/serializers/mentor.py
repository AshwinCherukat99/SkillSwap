from apps.mentors.models import Mentor
from apps.courses.models import Course
from rest_framework import serializers

class MentorListSerializer(serializers.ModelSerializer):

    experience_years = serializers.SerializerMethodField()
    current_profession = serializers.SerializerMethodField()
    professional_summary = serializers.SerializerMethodField()
    teaching_niche = serializers.SerializerMethodField()
    qualification = serializers.SerializerMethodField()
    courses=serializers.SerializerMethodField()

    class Meta:
        model = Mentor

        fields = [
            "id",
            "username",
            "profile_image",
            "is_verified",

            # Mentor fields
            "rating",
            "total_reviews",

            # MentorProfile fields
            "experience_years",
            "current_profession",
            "professional_summary",
            "teaching_niche",
            "qualification",
            'courses',
        ]

    def get_experience_years(self, obj):
        return getattr(
            obj.profile,
            "experience_years",
            None
        )

    def get_current_profession(self, obj):
        return getattr(
            obj.profile,
            "current_profession",
            ""
        )

    def get_professional_summary(self, obj):
        return getattr(
            obj.profile,
            "professional_summary",
            ""
        )

    def get_teaching_niche(self, obj):
        return getattr(
            obj.profile,
            "teaching_niche",
            ""
        )

    def get_qualification(self, obj):
        return getattr(
            obj.profile,
            "qualification",
            ""
        )
    def get_courses(self, obj):

        courses = obj.courses.filter(
            status=Course.Status.PUBLISHED,
            is_active=True
        )

        return [
            {
                "id": course.id,
                "title": course.title,
            }
            for course in courses
        ]