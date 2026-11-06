from io import BytesIO
from django.http import FileResponse 
from django.utils import timezone
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers.general import CertificateSerializer
from .certificate_utils import generate_certificate_pdf
from rest_framework.response import Response
from rest_framework import status

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
# Create your views here.

class UserCertificatesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        certificates=(
        Certificate.objects.filter(
            user=request.user
        ).select_related('course','enrollment','assessment').order_by('-issued_at')
        )
        serializer=CertificateSerializer(
            certificates,
            many=True
        )
        return Response(
            {
                'certificates':serializer.data,
            },
            status=status.HTTP_200_OK
        )

class UserCertificateDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,certificate_id):
        try:
            certificate=(
                Certificate.objects.select_related('course','enrollment','assessment').get(certificate_id=certificate_id,user=request.user)
            )
        except Certificate.DoesNotExist:
            return Response(
                {
                    'error':'certificate not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer=CertificateSerializer(certificate)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class UserCertificateDownloadView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,certificate_id):
        certificate=get_object_or_404(
            Certificate.objects.select_related(
                'user',
                'course',
                'enrollment',
                'assessment',
            ),
            certificate_id=certificate_id,
            user=request.user
        )
        if not certificate.is_valid:
            return Response(
                {
                    'error':'this certificate is no longer valid'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        buffer=generate_certificate_pdf(certificate)
        response=FileResponse(
            buffer,
            as_attachment=True,
            filename=(
                f'Skillswap-Certificate-'
                f'{certificate.certificate_number}.pdf'
            ),
            content_type='application/pdf'
        )
        response['Cache-Control']='private, no-store'
        return response

class UserCertificateViewAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,certificate_id):
        certificate=get_object_or_404(
            Certificate.objects.select_related(
                'user',
                'course',
                'enrollment',
                'assessment',
            ),
            certificate_id=certificate_id,
            user=request.user
        )
        if not certificate.is_valid:
            return Response(
                {
                    'error':'this certificate is no longer valid'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        buffer=generate_certificate_pdf(certificate)
        response=FileResponse(
            buffer,
            as_attachment=False,
            filename=(
                f'SkillSwap-Certificate-'
                f'{certificate.certificate_number}.pdf'
            ),
            content_type='application/pdf'
        )
        response['Cache-Control']='private, no-store'
        return Response