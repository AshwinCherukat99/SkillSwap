import secrets 

from django.conf import settings
from django.core.mail import send_mail

def generate_otp():
    return str(secrets.randbelow(900000)+100000) 

def send_otp_email(email,otp):
    message=(
                f"Your SkillSwap verification OTP is {otp}\n\n" 
                "This OTP is valid for 5 minutes\n" 
                "If you did not request this, please ignore this email"
            )
    send_mail(
        subject="SkillSwap - Email Verification OTP",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )