from rest_framework import serializers

from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    reporter_name=serializers.CharField(
        source='reporter.username',
        read_only=True
    )
    reported_user_name=serializers.CharField(
        source='reported_user.username',
        read_only=True,
    )
    reported_user_id=serializers.IntegerField(
        source='reported_user.id',
        read_only=True,
    )
    class Meta:
        model=Report
        fields=[
            'id',
            'reporter',
            'reporter_name',
            'reported_user',
            'reported_user_name',
            'reported_user_id',
            'reported_mentor',
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
        read_only_fields=[
            'reporter',
            'reviewed_at',
            'resolved_at',
            'created_at',
        ]

class AdminReportUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields=[
            'status',
            'priority',
            'admin_notes',
            'resolution',
        ]
    def validate(self,attrs):
        status_value=attrs.get(
            'status',
            self.instance.status
        )
        if status_value in [Report.Status.RESOLVED,Report.Status.DISMISSED]:
            if not attrs.get(
                'resolution',
                self.instance.resolution
            ):
                raise serializers.ValidationError(
                    {
                        'resolution':'resolution is required when closing a report'
                    }
                )
        return attrs

class CreateReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields=[
            'reported_user',
            'reported_mentor',
            'target_type',
            'target_id',
            'report_type',
            'priority',
            'description',
        ]
    def validate(self,attrs):
        reported_user=attrs.get('reported_user')
        reported_mentor=attrs.get('reported_mentor')
        if not reported_user and not reported_mentor:
            raise serializers.ValidationError(
                'a reported user or mentor is required'
            )
        if reported_user and reported_mentor:
            raise serializers.ValidationError(
                'report either a user or a mentor, not both'
            )
        return attrs
    def create(self,validated_data):
        request=self.context['request']
        return Report.objects.create(
            reporter=request.user,
            **validated_data,
        )