from celery import shared_task

@shared_task
def send_welcome_email(email):
    print(f'sending welcome email to {email}')
    return 'email sent successfully'