from rest_framework import serializers
from django.contrib.auth import authenticate,get_user_model

User=get_user_model()

class AdminLoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(
        write_only=True
    )
    def validate(self,attrs):
        email=attrs['email']
        password=attrs['password']
        user=authenticate(
            request=self.context.get('request'),
            email=email,
            password=password,
        )
        if user is None:
            raise serializers.ValidationError(
                {'error':'invalid email or password'}
            )
        if not user.is_active:
            raise serializers.ValidationError(
                {'error':'this account is inactive'}
            )
        if user.role!=User.Role.ADMIN:
            raise serializers.ValidationError(
                {'error':'you are not authorized to access this admin panel'}
            )
        attrs['user']=user
        return attrs