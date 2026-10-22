from django.core.cache import cache
from django.contrib.auth.hashers import make_password 
from django.contrib.auth import get_user_model
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken,BlacklistedToken
from django.db import transaction

from .models import OTP
from apps.skills.models import UserSkill
from .utils import generate_otp,send_otp_email
import secrets

User=get_user_model()

def start_user_registration(full_name,username,email,password,phone_number): 
    if not check_otp_rate_limit(f'registration:{email}'):
        return False,'please wait before requesting another otp'
    otp_code=generate_otp()
    print("REGISTRATION EMAIL:", email)
    print("REGISTRATION OTP:", otp_code)
    registration_data={
        'full_name':full_name,
        'email':email,
        'username':username,
        'password':password,
        'phone_number':phone_number,
    }
    cache.set(f'registration:{email}',
              registration_data,
    timeout=900,
    )
    cache.set(f'registration_otp:{email}',
              otp_code,
              timeout=300)
    print(
    "CACHED REGISTRATION:",
    cache.get(f'registration:{email}')
)

    print(
    "CACHED OTP:",
    cache.get(f'registration_otp:{email}')
)
    send_otp_email(email,otp_code) 
    return True,None

def verify_registration_otp(email,otp_code):
    registration_data=cache.get(
        f'registration:{email}'
    )
    stored_otp=cache.get(
        f'registration_otp:{email}'
    )
    print("VERIFY EMAIL:", repr(email))
    print("VERIFY OTP:", repr(otp_code))
    print("STORED REGISTRATION:", registration_data)
    print("STORED OTP:", stored_otp)
    if not stored_otp: 
        raise ValueError('no registration otp found') 
    if not registration_data:
        cache.delete(f'registration_otp:{email}')
        raise ValueError(
            'registration session has expired. please register again.'
        )
    if str(stored_otp)!=str(otp_code):
        raise ValueError('invalid otp')
    user=User.objects.create_user(
        username=registration_data['username'],
        email=registration_data['email'],
        password=registration_data['password'],
        role=User.Role.USER,
        full_name=registration_data['full_name'],
        phone_number=registration_data['phone_number'],
    )
    cache.delete(f'registration:{email}')
    cache.delete(f'registration_otp:{email}')
    return user  

def generate_tokens(user):
    refresh=RefreshToken.for_user(user)  
    return {
        'refresh':str(refresh),
        'access':str(refresh.access_token)
    }

def start_password_reset(email):
    user=get_user_model().objects.filter(
        email=email,
        is_active=True
    ).first()
    if not user:
        return
    if not check_otp_rate_limit(f'password-reset:{email}'):
        return
    otp=generate_otp()
    cache.set(
        f'password_reset_otp:{email}',
        otp,
        timeout=300
    ) 
    send_otp_email(email,otp)

def verify_password_reset_otp(email,otp):
    stored_otp=cache.get(f'password_reset_otp:{email}') 
    if not stored_otp:
        return None,'otp has expired or does not exist'
    attempts_key=f'password_reset_otp_attempts:{email}'
    attempts=cache.get(attempts_key,0)
    if attempts>=5:
        cache.delete(f'password_reset_otp:{email}')
        cache.delete(attempts_key)
    if stored_otp!=otp:
        attempts+=1
        cache.set(
            attempts_key,
            attempts,
            timeout=300,
        )
        if attempts>=5:
            cache.delete(f'password_reset_otp:{email}')
            cache.delete(attempts_key) 
            return None,'too many incorrect attempts, please request a new otp'
        return None,'invalid otp'
    reset_token=secrets.token_urlsafe(32)
    cache.set(
        f'password_reset_token:{reset_token}',
        email, 
        timeout=600,
    )
    cache.delete(f'password_reset_otp:{email}') 
    cache.delete(attempts_key)
    return reset_token,None

def reset_password(reset_token,new_password):
    email=cache.get(
        f'password_reset_token:{reset_token}'
    )
    if not email:
        return False,'invalid or expired reset token'
    User=get_user_model()
    try:
        user=User.objects.get(email=email)
    except User.DoesNotExist:
        return False,'user not found' 
    user.set_password(new_password)
    user.save(update_fields=['password'])
    cache.delete(
        f'password_reset_token:{reset_token}'
    ) 
    return True,None

def resend_registration_otp(email):
    registration_data=cache.get(
        f'registration:{email}'
    )
    if not registration_data:
        return False,'registration session has expired, please register again' 
    if not check_otp_rate_limit(f'registration:{email}'):
        return False, 'please wait before requesting another otp'
    otp=generate_otp()
    cache.set(
        f'registration_otp:{email}',
        otp,
        timeout=300
    )
    send_otp_email(email,otp)
    return True,None 

def change_password(user,new_password): 
    user.set_password(new_password)
    user.save(updated_fields=['password'])
    blacklist_user_refresh_tokens(user)

def start_email_change(user,new_email):
    User=get_user_model() 
    if User.objects.filter(email=new_email).exclude(
        pk=user.pk
    ).exists():
        return False,'this email is already in use' 
    if not check_otp_rate_limit(
        f'email-change:{user.id}'
    ):
        return False,'please wait before requesting an otp'
    otp=generate_otp()
    cache.set(
        f'email_change:{user.id}',
        new_email,
        timeout=900
    )
    cache.set(
        f'email_change_otp:{user.id}',
        otp,
        timeout=300,
    )
    send_otp_email(new_email,otp)
    return True,None
def verify_email_change_otp(user,otp):
    stored_otp=cache.get(f'email_change_otp={user.id}')
    if not stored_otp:
        return False,'otp has expired or does not exist'
    attempts_key=f'email_change_otp_attempts:{user.id}'
    attempts=cache.get(
        attempts_key,
        0
    ) 
    if attempts>=5:
        cache.delete(
            f'email_change_otp:{user.id}'
        )
        cache.delete(attempts_key)
        return False,'too many incorrect attempts, please request a new otp'
    if stored_otp!=otp: 
        attempts+=1 
        cache.set(
            attempts_key,
            attempts,
            timeout=300,
        )
        if attempts>=5:
            cache.delete(f'email_change_otp:{user.id}')
            cache.delete(attempts_key)
            return False, 'too many incorrect attempts, request a new otp' 
        return False,'invalid otp'
    new_email=cache.get(
        f'email_change:{user.id}'
    )
    if not new_email:
        cache.delete(f'email_change_otp:{user.id}')
        cache.delete(attempts_key)
        return False,'email change request has expired'
    User=get_user_model()
    if User.objects.filter(email=new_email).exclude(pk=user.pk).exists:
        cache.delete(f'email_change_otp:{user.id}') 
        cache.delete(f'email_change:{user.id}') 
        cache.delete(attempts_key)
        return False,'this email is already in use'
    user.email=new_email
    user.save(updated_fields=['email'])
    cache.delete(f'email_change_otp:{user.id}')
    cache.delete(f'email_change:{user.id}')
    cache.delete(attempts_key)
    return True,None
def check_otp_rate_limit(key):
    cooldown_key=f'otp_cooldown:{key}'
    if cache.get(cooldown_key):
        return False
    cache.set(
        cooldown_key,
        True,
        timeout=60,
    )  
    return True

def check_otp_attempt(key):
    attempts_key=f'otp_attempts:{key}'
    attempts=cache.get(attempts_key,0)
    if attempts>=5:
        return False
    cache.set(
        attempts_key,
        attempts+1,
        timeout=300,
    )
    return True

def clear_otp_attempts(key):
    cache.delete(f'otp_attemps:{key}')

def blacklist_user_refresh_tokens(user):
    tokens=OutstandingToken.objects.filter(
        user=user
    ) 
    for token in tokens: 
        BlacklistedToken.objects.get_or_create(
            token=token
        )

def verify_google_token(token):
    try:
        idinfo=id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        return None
    return idinfo

def google_login(token):
    idinfo=verify_google_token(token)
    if not idinfo:
        raise ValueError('invalid google token')
    google_id=idinfo.get('sub')
    email=idinfo.get('email')
    email_verified=idinfo.get('email_verified')
    if not google_id or not email: 
        raise ValueError('google account information is incomplete')
    if not email_verified:
        raise ValueError('google email is not verified')
    user=User.objects.filter(
        google_id=google_id
    ).first()
    if user:
        return user
    user=User.objects.filter(
        email=email
    ).first()
    if user:
        if user.google_id:
            raise ValueError(
                'this email is already linked to another google account'
            )
        user.google_id=google_id
        user.save(update_fields=['google_id'])
        return user
    username=email.split("@")[0]
    if User.objects.filter(username=username).exists():
        username=f'{username}_{google_id[-6:]}'
    user=User.objects.create_user(
        username=username,
        email=email,
        password=None,
        role=User.Role.USER,
    )
    user.google_id=google_id
    user.is_active=True
    user.save(
        update_fields=[
            'google_id',
            'is_active'
        ]
    )
    return user
def get_recommended_users(user):
    wanted_skill_ids=set(
        UserSkill.objects.filter(
            user=user,
            skill_type='WANT'
        ).values_list(
            'skill_id',
            flat=True
        )
    )
    offered_skill_ids=set(
        UserSkill.objects.filter(
            user=user,
            skill_type='OFFER'
        ).values_list(
            'skill_id',
            flat=True
        )
    )
    if not wanted_skill_ids or not offered_skill_ids:
        return []
    recommendations=[]
    other_users=User.objects.exclude(
        id=user.id
    )
    for other_user in other_users:
        other_offered_ids=set(
            UserSkill.objects.filter(
                user=other_user,
                skill_type='OFFER',
            ).values_list(
                'skill_id',
                flat=True
            )
        )
        other_wanted_ids=set(
                    UserSkill.objects.filter(
                        user=other_user,
                        skill_type='WANT',
                    ).values_list(
                        'skill_id',
                        flat=True
                    )
                )
        user_can_learn=(
            wanted_skill_ids & other_offered_ids
        )
        user_can_teach=(
            offered_skill_ids & other_wanted_ids
        )
        total_skills=len(wanted_skill_ids)+len(offered_skill_ids)
        other_total_skills=len(other_offered_ids)+len(other_wanted_ids)
        if total_skills>other_total_skills:
            total=total_skills
        else:
            total=other_total_skills
        if user_can_learn and user_can_teach:
            match_score=(len(user_can_learn)+len(user_can_teach))/total*100
            recommendations.append(
                {
                    'user':other_user,
                    'skills_to_learn_ids':list(user_can_learn),
                    'skills_to_teach_ids':list(user_can_teach),
                    'match_score':match_score,
                }
            )
    recommendations.sort(
        key=lambda recommendation:recommendation['match_score'],
        reverse=True
    )
    return recommendations

@transaction.atomic
def add_xp(user,amount):
    if amount<=0:
        return user
    user.xp+=amount
    user.save(update_fields=['xp'])
    return user