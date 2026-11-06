from io import BytesIO
from xml.sax.saxutils import escape
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
from django.utils import timezone

def generate_certificate_pdf(certificate):
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

    status_text = (
        'VALID' if certificate.is_valid else 'REVOKED'
    )

    story.append(Paragraph(
        f'Certificate status: {status_text}',
        styles['Centered'],
    ))

    story.append(Spacer(1, 10 * mm))

    story.append(Paragraph(
        'SkillSwap Learning Platform',
        styles['Centered'],
    ))

    document.build(story)

    buffer.seek(0)

    return buffer