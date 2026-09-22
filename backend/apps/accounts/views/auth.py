from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from apps.skills.models import UserSkill

from ..serializers.auth import (
    RegisterSerializer,
    VerifyRegistrationOTPSerializer,
    LoginSerializer,
    LogoutSerializer,
    ForgotPasswordSerializer,
    VerifyResetOTPSerializer, 
    ResetPasswordSerializer,
    ResendRegistrationOTPSerializer,
    ChangePasswordSerializer,
    ChangeEmailSerializer,
    VerifyEmailChangeOTPSerializer,
    GoogleLoginSerializer
) 
from ..services import (
    start_user_registration,
    verify_registration_otp,
    generate_tokens,
    start_password_reset,
    verify_password_reset_otp,
    reset_password,
    resend_registration_otp,
    change_password,
    start_email_change,
    verify_email_change_otp,
    google_login
)   

from ..permissions import IsAdmin

class RegisterView(APIView):
    def post(self,request): 
        serializer=RegisterSerializer(
            data=request.data
        ) 
        serializer.is_valid(raise_exception=True) 
        success,message=start_user_registration(
            full_name=serializer.validated_data['full_name'],
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'], 
            phone_number=serializer.validated_data['phone_number'],
        )
        if not success:
            return Response(
                {'detail':message},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        return Response(
            {
                'message':(
                    'registration initiated'
                    'otp has been sent to your email'
                )
            },
            status=status.HTTP_200_OK
        )  

class VerifyRegistrationOTPView(APIView):
    def post(self,request):
        serializer=VerifyRegistrationOTPSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True) 
        try:
            user=verify_registration_otp(
            email=serializer.validated_data['email'],
            otp_code=serializer.validated_data['otp'],
        ) 
        except ValueError as error:
            return Response(
                {
                    'error':str(error)
                }, 
                status=status.HTTP_400_BAD_REQUEST
            ) 
        refresh=RefreshToken.for_user(user)
        return Response(
            {
                'message':'registration successful',
                'user':{
                    'id':user.id,
                    'username':user.username,
                    'email':user.email,
                },
                'tokens':{
                    'access':str(refresh.access_token),
                    'refresh':str(refresh),
                },
            },
            status=status.HTTP_201_CREATED
        ) 

class LoginView(APIView):
    def post(self,request):
        serializer=LoginSerializer(data=request.data,context={'request':request}) 
        serializer.is_valid(raise_exception=True)
        user=serializer.validated_data['user']
        tokens=generate_tokens(user)
        return Response(
            {
                'message':'login successful',
                'user':{
                    'id':user.id,
                    'username':user.username,
                    'email':user.email,
                },
                'tokens':tokens,
            },
            status=status.HTTP_200_OK,
        ) 

class LogoutView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        return Response(
            {
                'message':'logout successful'
            }, 
            status=status.HTTP_200_OK
        )

class ForgotPasswordView(APIView):
    def post(self,request):
        serializer=ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        email=serializer.validated_data['email']
        start_password_reset(email)
        return Response(
            {
                'message':(
                    'if an account exists with this email,'
                    'a password reset otp has been sent'
                )
            },
            status=status.HTTP_200_OK,
        )
class VerifyResetOTPView(APIView):
    def post(self,request):
        serializer=VerifyResetOTPSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True) 
        email=serializer.validated_data['email'] 
        otp=serializer.validated_data['otp']
        reset_token,error=verify_password_reset_otp(
            email,
            otp
        )
        if error:
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'otp verified successfully',
                'reset_token':reset_token,
            },
            status=status.HTTP_200_OK,
        )
class ResetPasswordView(APIView):
    def post(self,request):
        serializer=ResetPasswordSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        success,error=reset_password(
            serializer.validated_data['reset_token'],
            serializer.validated_data['new_password'],
        )
        if not success:
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'password reset successful' 
            },
            status=status.HTTP_200_OK,
        )
class ResendRegistrationOTPView(APIView):
    def post(self,request):
        serializer=ResendRegistrationOTPSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        success,error=resend_registration_otp(
            serializer.validated_data['email']
        )
        if not success: 
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {'message':'a new otp has been sent'},
            status=status.HTTP_200_OK,
        ) 
class ChangePasswordView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=ChangePasswordSerializer(
            data=request.data,
            context={'request':request}
        )
        serializer.is_valid(raise_exception=True)
        change_password(
            request.user,
            serializer.validated_data['new_password']
        )
        return Response(
            {
                'message':'password changed successfully'
            },
            status=status.HTTP_200_OK,
        )
class ChangeEmailView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=ChangeEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        success,error=start_email_change(request.user,serializer.validated_data['new_email'])
        if not success:
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'otp has been sent to your new email'
            },
            status=status.HTTP_200_OK,
        ) 
class VerifyEmailChangeOTPView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=VerifyEmailChangeOTPSerializer(
            data=request.data
        ) 
        serializer.is_valid(raise_exception=True)
        success,error=verify_email_change_otp(
            request.user,
            serializer.validated_data['otp']
        )
        if not success:
            return Response(
                {'error':error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'email changed successfully'
            },
            status=status.HTTP_200_OK,
        )
class AdminTestView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        return Response({
            'message':'admin access granted',
            'role':request.user.role,
        })
class GoogleLoginView(APIView):
    def post(self,request):
        serializer=GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token=serializer.validated_data['token']
        try:
            user=google_login(token)
        except ValueError as e:
            return Response(
                {
                    'error':str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        tokens=generate_tokens(user)
        has_skills=UserSkill.objects.filter(
            user=user
        ).exists()
        return Response(
            {
                'message':'google login successful',
                'user':{
                    'id':user.id,
                    'username':user.username,
                    'email':user.email,
                    'role':user.role,
                },
                'tokens':tokens,
                'has_skills':has_skills,
            },
            status=status.HTTP_200_OK,
        )