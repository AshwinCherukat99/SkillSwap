from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.accounts.models import User
from .models import Report
from .serializers import ReportSerializer,CreateReportSerializer,AdminReportUpdateSerializer

from apps.accounts.permissions import IsAdmin

class CreateReportView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=CreateReportSerializer(
            data=request.data,
            context={'request':request}
        )
        serializer.is_valid(raise_exception=True)
        report=serializer.save()
        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_201_CREATED,
        )

class AdminReportListView(APIView):
    permission_classes=[IsAuthenticated,IsAdmin]
    def get(self,request):
        reports=Report.objects.select_related('reporter','reported_user','reported_mentor')
        search=request.query_params.get('search','').strip()
        report_type=request.query_params.get('report_type')
        target_type=request.query_params.get('target_type')
        priority=request.query_params.get('priority')
        report_status=request.query_params.get('report_status')
        if search:
            reports=reports.filter(
                Q(reporter__username__icontains=search)|
                Q(reported_user__username__icontainse=search)|
                Q(description__icontains=search)|
                Q(id__icontains=search)
            )
        if report_type:
            reports=reports.filter(report_type=report_type)
        if target_type:
            reports=reports.filter(target_type=target_type)
        if priority:
            reports=reports.filter(priority=priority)
        if report_status:
            reports=reports.filter(status=report_status)
        serializer=ReportSerializer(
            reports,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    
class AdminReportDetailView(APIView):
    permission_classes=[
        IsAuthenticated,
        IsAdmin
    ]
    def get_object(self,report_id):
        return get_object_or_404(
            Report,
            id=report_id
        )
    def get(self,request,report_id):
        report=self.get_object(report_id)
        serializer=ReportSerializer(report)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    def patch(self,request,report_id):
        report=self.get_object(report_id)
        serializer=AdminReportUpdateSerializer(report,
                                               data=request.data,
                                               partial=True)
        serializer.is_valid(raise_exception=True)
        report=serializer.save()
        from django.utils import timezone
        if report.status==Report.Status.IN_REVIEW:
            report.reviewed_at=timezone.now()
        if report.status in [Report.Status.RESOLVED,Report.Status.DISMISSED]:
            report.resolved_at=timezone.now()
        report.save()
        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )

class AdminReportStatsView(APIView):
    permission_classes=[IsAuthenticated,IsAdmin]
    def get(self,request):
        total_reports=Report.objects.count()
        pending_reports=Report.objects.filter(status=Report.Status.PENDING).count()
        reported_users=Report.objects.filter(reported_user__isnull=False).values('reported_user').distinct().count()
        reported_mentors=Report.objects.filter(reported_mentor__isnull=False).values('reported_mentor').distinct().count()
        flagged_messages=Report.objects.filter(target_type=Report.TargetType.MESSAGE).count()
        fraud_alerts=Report.objects.filter(report_type=Report.ReportType.FRAUD).count()
        active_bans=User.objects.filter(is_active=False).count()
        return Response(
            {
                'total_reports':total_reports,
                'pending_reports':pending_reports,
                'reported_users':reported_users,
                'reported_mentors':reported_mentors,
                'flagged_messages':flagged_messages,
                'fraud_alerts':fraud_alerts,
                'active_bans':active_bans
            }
        )