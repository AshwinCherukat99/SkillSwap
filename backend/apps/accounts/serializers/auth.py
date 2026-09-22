from django.contrib.auth import get_user_model  
from rest_framework import serializers
from django.contrib.auth import authenticate 
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Avg

User=get_user_model()

class RegisterSerializer(serializers.Serializer):
    full_name=serializers.CharField(max_length=150)
    username=serializers.CharField(max_length=150)
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True,min_length=8)  
    password2=serializers.CharField(write_only=True) 
    phone_number=serializers.CharField(max_length=20)
    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('username is already taken')
        return value
    def validate_email(self,value):
        value=value.lower() 
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('an account with this email already exists') 
        return value
    def validate(self,attrs): 
        if attrs['password']!=attrs['password2']: 
            raise serializers.ValidationError({'password':'passwords do not match'})
        return attrs 
class VerifyRegistrationOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(
        min_length=6,
        max_length=6
    )
    def validate_email(self,value): 
        return value.lower()
    def validate_otp(self,value):
        if not value.isdigit():
            raise serializers.ValidationError('OTP must contain only digits') 
        return value
class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(
        write_only=True,
        style={"input_type":"password"}
    )
    def validate(self,attrs):
        email=attrs['email']
        password=attrs['password'] 
        user=authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if user is None:
            raise serializers.ValidationError(
                {'error':'invalid email or password'}
            ) 
        if not user.is_active:
            raise serializers.ValidationError(
                {'error':'this account is inactive'}
            )
        attrs['user']=user
        return attrs

class LogoutSerializer(serializers.Serializer):
    refresh=serializers.CharField()
    def validate(self,attrs):
        refresh_token=attrs['refresh']
        try:
            token=RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            raise serializers.ValidationError(
                {'error':'invalid or expired refresh token'}
            )
        return attrs
class ForgotPasswordSerializer(serializers.Serializer):
    email=serializers.EmailField() 
class VerifyResetOTPSerializer(serializers.Serializer):
    email=serializers.EmailField() 
    otp=serializers.CharField(
        min_length=6,
        max_length=6
    )
class ResetPasswordSerializer(serializers.Serializer):
    reset_token=serializers.CharField()
    new_password=serializers.CharField(
        write_only=True,
        min_length=8
    )
    confirm_password=serializers.CharField(
        write_only=True
    )
    def validate(self,attrs):
        if attrs['new_password']!=attrs['confirm_password']:
            raise serializers.ValidationError(
                {'error':'passwords do not match'}
            )
        return attrs
class ResendRegistrationOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
class ChangePasswordSerializer(serializers.Serializer):
    current_password=serializers.CharField(
        write_only=True
    )
    new_password=serializers.CharField(
        write_only=True,
        min_length=8
    )
    confirm_password=serializers.CharField(
        write_only=True
    )
    def validate(self,attrs):
        user=self.context['request'].user
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError(
                {'current_password':'current password is incorrect'}
            )
        if attrs['new_password']!=attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password':'passwords do not match'}
            )
        if attrs['current_password']==attrs['new_password']: 
            raise serializers.ValidationError(
                {'new_password':'new password must be different from current password'}
            )
        return attrs
class ChangeEmailSerializer(serializers.Serializer):
    new_email=serializers.EmailField() 
class VerifyEmailChangeOTPSerializer(serializers.Serializer):
    otp=serializers.CharField(
        min_length=6,
        max_length=6
    )
class GoogleLoginSerializer(serializers.Serializer):
    token=serializers.CharField(write_only=True)