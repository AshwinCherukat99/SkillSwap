from django.core.mail import EmailMultiAlternatives
from django.utils.html import format_html
from django.conf import settings

def send_admin_notification_email(
    admin_notification,
    recipients
):
    emails=set()
    for user in recipients['users']:
        if user.email:
            emails.add(user.email.strip().lower())
    for mentor in recipients['mentors']:
        if mentor.email:
            emails.add(mentor.email.strip().lower())
    if not emails:
        return 0
    subject=admin_notification.title
    text_content=admin_notification.message
    html_content=format_html(
        """
    <html>
        <body>
            <h2>{}</h2>
            <p>{}</p>
            <p>SkillSwap Team</p>
        </body>
    </html>
    """,
    admin_notification.title,
    admin_notification.message
    )
    email_count=0
    email_list=list(emails)
    for start in range(0,len(email_list),50):
        batch=email_list[start:start+50] 
        email=EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        bcc=batch,
    )
        email.attach_alternative(
        html_content,
        'text/html'
    )
        email_count+=email.send(fail_silently=False)
    return email_count