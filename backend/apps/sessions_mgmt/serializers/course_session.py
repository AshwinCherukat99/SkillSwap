from rest_framework import serializers
from ..models import CourseSession

class MentorCourseSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseSession
        fields=[
            'id',
            'enrollment',
            'scheduled_start',
            'duration_minutes',
            'message',
        ]
        read_only_fields=[
            'id'
        ]
    def validate_duration_minutes(self,value):
        valid_durations=[
            choice[0]
            for choice in CourseSession.Duration.choices
        ]
        if value not in valid_durations:
            raise serializers.ValidationError(
                'invalid session duration'
            )
        return value

