from io import BytesIO
from django.http import FileResponse 
from django.utils import timezone
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers.general import CertificateSerializer
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
    permission_classes = [IsAuthenticated]

    def get(self, request, certificate_id):
        certificate = get_object_or_404(
            Certificate.objects.select_related(
                'user',
                'course',
                'enrollment',
                'assessment',
            ),
            certificate_id=certificate_id,
            user=request.user,
        )

        # Never generate a valid-looking PDF for a revoked certificate.
        if not certificate.is_valid:
            return Response(
                {'error': 'This certificate is no longer valid.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=22 * mm,
            leftMargin=22 * mm,
            topMargin=25 * mm,
            bottomMargin=22 * mm,
            title=f'{certificate.course.title} Certificate',
            author='SkillSwap',
        )

        styles = getSampleStyleSheet()

        styles.add(ParagraphStyle(
            name='Brand',
            parent=styles['Title'],
            fontName='Helvetica-Bold',
            fontSize=25,
            leading=32,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1769FF'),
            spaceAfter=8 * mm,
        ))

        styles.add(ParagraphStyle(
            name='CertificateHeading',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=19,
            leading=25,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#172554'),
            spaceAfter=8 * mm,
        ))

        styles.add(ParagraphStyle(
            name='Recipient',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=23,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#111827'),
            spaceAfter=5 * mm,
        ))

        styles.add(ParagraphStyle(
            name='Centered',
            parent=styles['Normal'],
            fontSize=11,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#4B5563'),
        ))

        styles.add(ParagraphStyle(
            name='CourseName',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=17,
            leading=23,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1769FF'),
            spaceBefore=4 * mm,
            spaceAfter=5 * mm,
        ))

        story = []

        # Escape user/course text before inserting it into ReportLab markup.
        from xml.sax.saxutils import escape

        learner_name = escape(
            certificate.user.full_name
            or certificate.user.username
        )
        course_title = escape(certificate.course.title)
        certificate_number = escape(
            certificate.certificate_number
        )

        issued_date = timezone.localtime(
            certificate.issued_at
        ).strftime('%B %d, %Y')

        story.append(Spacer(1, 12 * mm))
        story.append(Paragraph('SkillSwap', styles['Brand']))
        story.append(Paragraph(
            'CERTIFICATE OF COMPLETION',
            styles['CertificateHeading'],
        ))
        story.append(Spacer(1, 5 * mm))

        story.append(Paragraph(
            'This certificate is proudly presented to',
            styles['Centered'],
        ))
        story.append(Spacer(1, 5 * mm))

        story.append(Paragraph(
            learner_name,
            styles['Recipient'],
        ))

        story.append(Paragraph(
            'for successfully completing the course',
            styles['Centered'],
        ))
        story.append(Paragraph(
            course_title,
            styles['CourseName'],
        ))

        story.append(Spacer(1, 8 * mm))
        story.append(HRFlowable(
            width='100%',
            thickness=1,
            color=colors.HexColor('#D1D5DB'),
        ))
        story.append(Spacer(1, 8 * mm))

        story.append(Paragraph(
            f'<b>Certificate Number:</b> {certificate_number}',
            styles['Centered'],
        ))
        story.append(Paragraph(
            f'<b>Assessment Score:</b> {certificate.score}%',
            styles['Centered'],
        ))
        story.append(Paragraph(
            f'<b>Issued On:</b> {issued_date}',
            styles['Centered'],
        ))

        story.append(Spacer(1, 12 * mm))
        story.append(Paragraph(
            'Certificate status: VALID',
            styles['Centered'],
        ))
        story.append(Spacer(1, 10 * mm))
        story.append(Paragraph(
            'SkillSwap Learning Platform',
            styles['Centered'],
        ))

        document.build(story)

        buffer.seek(0)

        response = FileResponse(
            buffer,
            as_attachment=True,
            filename=f'SkillSwap-Certificate-{certificate.certificate_number}.pdf',
            content_type='application/pdf',
        )

        response['Cache-Control'] = 'private, no-store'
        return response
