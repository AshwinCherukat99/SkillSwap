from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from apps.accounts.services import check_otp_rate_limit
from apps.accounts.utils import generate_otp,send_otp_email
from apps.accounts.models import OTP,User
from django.db import transaction  
from django.core.files.storage import default_storage
from .models import Mentor,MentorProfile,MentorVerification,MentorDocument
import secrets

def generate_mentor_tokens(mentor):
    if not mentor.user:
        raise ValueError(
            "Mentor is not linked to a User account."
        )
    refresh=RefreshToken.for_user(mentor.user)
    refresh['account_type']='MENTOR'
    refresh['mentor_id']=mentor.id
    access=refresh.access_token 
    access['account_type']='MENTOR'
    access['mentor_id']=mentor.id
    return {
        'refresh':str(refresh),
        'access':str(access),
    }

def start_mentor_registration(full_name,username,email,password,phone_number,current_profession='',organization='',experience_years=None,professional_summary='',teaching_niche='',documents=None,document_types=None):
    print(
    "SERVICE RECEIVED EMAIL:",
    email
)
    documents = documents or []
    document_types = document_types or []
    if not check_otp_rate_limit(
        f'mentor_registration:{email}'
    ):
        return False,(
            'please wait before requesting another otp'
        )
    if len(documents)!=len(document_types):
        return False,'each document must have a document type'
    otp_code=generate_otp()
    OTP.objects.filter(
    email=email,
    purpose=OTP.Purpose.MENTOR_REGISTER,
).delete()

    print("ABOUT TO CREATE MENTOR OTP")

    mentor_otp=OTP.objects.create(
    email=email,
    otp=otp_code,
    purpose=OTP.Purpose.MENTOR_REGISTER,
)

    print(
    "CREATED OTP:",
    mentor_otp.id,
    mentor_otp.email,
    mentor_otp.otp,
    mentor_otp.purpose,
)
    
    print("MENTOR REGISTRATION EMAIL:", email)
    print("MENTOR REGISTRATION OTP:", otp_code)
    saved_documents=[]
    try:
        for document, document_type in zip(
            documents,
            document_types
        ):
            file_path = default_storage.save(
                f"mentor_registration/{email}/{document.name}",
                document
            )

            saved_documents.append({
                "file_path": file_path,
                "document_type": document_type,
            })

        registration_data={
        'full_name':full_name,
        'username':username,
        'email':email,
        'password':password,
        'phone_number':phone_number,
        'current_profession':current_profession,
        'organization':organization,
        'experience_years':experience_years,
        'professional_summary':professional_summary,
        'teaching_niche':teaching_niche,
        'documents':saved_documents,
    }
        cache.set(
        f'mentor_registration:{email}',
              registration_data,
              timeout=900,
              )
        print(
    "REGISTRATION CACHE KEY:",
    f"mentor_registration:{email}"
)

        print(
    "REGISTRATION CACHE DATA:",
    cache.get(
        f"mentor_registration:{email}"
    )
)
        cache.set(
        f'mentor_registration_otp:{email}',
        otp_code,
        timeout=300,
    )   
        send_otp_email(email,otp_code,)
        return True,None
    except Exception:
        # Remove files if registration setup fails
        for item in saved_documents:
            try:
                default_storage.delete(
                    item["file_path"]
                )
            except Exception:
                pass

        raise

@transaction.atomic
def verify_mentor_registration_otp(email,otp_code):
    email=email.lower().strip()
    otp=OTP.objects.filter(
        email=email,
        purpose=OTP.Purpose.MENTOR_REGISTER,
    ).first()
    if not otp:
        raise ValueError(
            'no mentor registration otp found'
        )
    if otp.is_expired():
        otp.delete()
        cache.delete(
            f'mentor_registration:{email}'
        )
        raise ValueError(
            'OTP has expired'
        )
    if otp.otp!=otp_code:
        print(
    "STORED OTP:",
    otp.otp
)

        print(
    "ENTERED OTP:",
    otp_code
)
        print(
    "OTP EXPIRED:",
    otp.is_expired()
)
        raise ValueError(
            'invalid otp'
        ) 
    print(
    "VERIFY CACHE KEY:",
    f"mentor_registration:{email}"
)

    print(
    "VERIFY CACHE DATA:",
    cache.get(
        f"mentor_registration:{email}"
    )
)
    registration_data=cache.get(
        f'mentor_registration:{email}'
    )
    if not registration_data:
        otp.delete()
        raise ValueError(
            'mentor registration session has expired'
        )
    user=User.objects.filter(
        email__iexact=registration_data['email']
    ).first()
    if not user:
        user = User.objects.create_user(
    username=registration_data["username"],
    email=registration_data["email"],
    password=registration_data["password"],
    full_name=registration_data["full_name"],
    phone_number=registration_data["phone_number"],
    role=User.Role.USER,
)

    mentor = Mentor(
    user=user,
    full_name=registration_data["full_name"],
    username=registration_data["username"],
    email=registration_data["email"],
    phone_number=registration_data["phone_number"],
    is_verified=False,
    is_active=True,
)

    mentor.set_password(
    registration_data["password"]
)

    mentor.save()
    MentorProfile.objects.create(
        mentor=mentor,
        current_profession=registration_data.get(
            "current_profession",
            "",
        ),
        organization=registration_data.get(
            "organization",
            "",
        ),
        experience_years=registration_data.get(
            "experience_years"
        ),
        professional_summary=registration_data.get(
            "professional_summary",
            "",
        ),
        teaching_niche=registration_data.get(
            "teaching_niche",
            "",
        ),
    )
    MentorVerification.objects.create(
        mentor=mentor,
        status=MentorVerification.Status.PENDING,
    ) 
    for document_data in registration_data.get(
        "documents",
        []
    ):
        MentorDocument.objects.create(
            mentor=mentor,
            document=document_data["file_path"],
            document_type=document_data["document_type"],
            status=MentorDocument.Status.PENDING,
        )
    otp.delete()
    cache.delete(
        f'mentor_registration:{email}'
    )
    cache.delete(
        f'mentor_registration_otp:{email}'
    )
    return mentor

def resend_mentor_registration_otp(email):

    if not check_otp_rate_limit(
        f"mentor_registration:{email}"
    ):
        return False, "Please wait before requesting another OTP."

    registration_data = cache.get(
        f"mentor_registration:{email}"
    )

    if not registration_data:
        return False, "Mentor registration session has expired."

    otp_code = generate_otp()

    OTP.objects.filter(
        email=email,
        purpose=OTP.Purpose.MENTOR_REGISTER,
    ).delete()

    OTP.objects.create(
        email=email,
        otp=otp_code,
        purpose=OTP.Purpose.MENTOR_REGISTER,
    )

    cache.set(
        f"mentor_registration_otp:{email}",
        otp_code,
        timeout=300,
    )

    send_otp_email(
        email,
        otp_code,
    )

    return True, None 

def start_mentor_password_reset(email):    
    email=email.lower().strip()
    mentor=Mentor.objects.filter(email=email,is_active=True).first()
    if not mentor:
        return
    if not check_otp_rate_limit(
        f'mentor-password-reset:{email}'
    ):
        return
    otp=generate_otp()
    cache.set(
        f'mentor_password_reset_otp:{email}',
        otp,
        timeout=300
    )
    send_otp_email(email,otp)

def reset_mentor_password(reset_token,new_password):
    email=cache.get(f'mentor_password_reset_token:{reset_token}')
    if not email:
        return False, 'invalid or expired reset token' 
    try:
        mentor=Mentor.objects.select_related('user').get(email=email,is_active=True)
    except Mentor.DoesNotExist:
        return False, 'mentor not found'
    mentor.user.set_password(new_password)
    mentor.user.save(update_fields=['password'])
    cache.delete(f'mentor_password_reset_token:{reset_token}')
    return True,None

def verify_mentor_password_reset_otp(email,otp):
    stored_otp=cache.get(f'mentor_password_reset_otp:{email}') 
    if not stored_otp:
        return None, 'otp has expired or does not exist' 
    attempts_key=(
        f'mentor_password_reset_otp_attempts:{email}'
    )
    attempts=cache.get(
        attempts_key,
        0
    )
    if attempts>=5:
        cache.delete(
            f'mentor_password_reset_otp:{email}'
        )
        cache.delete(attempts_key)
    if stored_otp!=otp:
        attempts+=1
        cache.set(
            attempts_key,
            attempts,
            timeout=300
        )
        if attempts>=5: 
            cache.delete(
                f'mentor_password_reset_otp:{email}'
            )
            cache.delete(attempts_key)
            return (None,'too many incorrect attempts, please request a new otp')
        return None, 'invalid otp'
    reset_token=secrets.token_urlsafe(32)
    cache.set(
        f'mentor_password_reset_token:{reset_token}',
        email,
        timeout=600
    )
    cache.delete(
        f'mentor_password_reset_otp:{email}'
    )
    cache.delete(attempts_key)
    return reset_token,None