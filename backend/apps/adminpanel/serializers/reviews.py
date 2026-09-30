from rest_framework import serializers
from apps.accounts.models import UserRating
from apps.reports.models import Report

class AdminReviewSerializer(serializers.ModelSerializer):
    reviewer_id=serializers.IntegerField(
        source='rated_by.id',
        read_only=True,
    )
    reviewer_name=serializers.SerializerMethodField()
    reviewer_username=serializers.CharField(
        source='rated_by.username',
        read_only=True,
    )
    reviewed_user_id=serializers.IntegerField(
        source='rated_user.id',
        read_only=True,
    )
    reviewed_user_name=serializers.SerializerMethodField()
    reviewed_user_username=serializers.CharField(
        source='rated_user.username',
        read_only=True
    )
    report_count=serializers.IntegerField(
        read_only=True
    )
    pending_report_count=serializers.IntegerField(
        read_only=True
    )
    class Meta:
        model=UserRating
        fields=[
            'id',
            'reviewer_id',
            'reviewer_name',
            'reviewer_username',
            'reviewed_user_id',
            'reviewed_user_username',
            'rating',
            'review',
            'is_hidden',
            'report_count',
            'pending_report_count',
            'created_at',
        ]
        read_only_fields=fields
    def get_reviewer_name(self,obj):
        user=obj.rated_by
        return (user.full_name or user.get_full_name() or user.username)
    def get_reviewed_user_name(self,obj):
        user=obj.rated_user
        return (user.username or user.get_user_name() or user.username)

class ReviewReportSerializer(serializers.ModelSerializer):
    reporter_name=serializers.SerializerMethodField()
    reporter_username=serializers.CharField(
        source='reporter.username',
        read_only=True
    )
    class Meta:
        model=Report
        fields=[
            'id',
            'reporter_name',
            'reporter_username',
            'target_type',
            'target_id',
            'report_type',
            'priority',
            'description',
            'status',
            'admin_notes',
            'resolution',
            'created_at',
            'reviewed_at',
            'resolved_at',
        ]
        read_only_fields=fields
    def get_reporter_name(self,obj):
        user=obj.reporter
        return (
            user.full_name or
            user.get_full_name() or
            user.username
        )