from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import MentorDocument,Mentor

class MentorLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        email = attrs["email"].lower().strip()
        password = attrs["password"]

        user = authenticate(
            username=email,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        try:
            mentor = user.mentor_profile
        except Mentor.DoesNotExist:
            raise serializers.ValidationError(
                "No mentor account is associated with this user."
            )

        attrs["user"] = user
        attrs["mentor"] = mentor

        return attrs

class MentorRegisterSerializer(serializers.Serializer):
    full_name=serializers.CharField(
        max_length=255
    )
    username=serializers.CharField(
        max_length=150
    )
    email=serializers.EmailField()
    password=serializers.CharField(
        write_only=True,
        min_length=8
    )
    password2=serializers.CharField(
        write_only=True
    )
    phone_number=serializers.CharField(
        max_length=15
    )
    current_profession=serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )
    organization=serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )
    experience_years=serializers.IntegerField(
        required=False,
        allow_null=True,
    )
    professional_summary=serializers.CharField(
        required=False,
        allow_blank=True,
    )
    teaching_niche=serializers.CharField(
        required=False,
        allow_blank=True,
    )
    documents=serializers.ListField(
        child=serializers.FileField(
            allow_empty_file=False
        ),
        required=False,
        allow_empty=True
    )
    document_types = serializers.ListField(
        child=serializers.CharField(
            max_length=100
        ),
        required=False,
        allow_empty=True
    )
    def validate_username(self,value):
        if Mentor.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'username is already taken'
            )
        return value
    def validate_email(self,value):
        value=value.lower()
        if Mentor.objects.filter(
            email=value
        ).exists():
            raise serializers.ValidationError(
                'a mentor account with this email already exists'
            )
        return value
    def validate(self,attrs):
        if attrs['password']!=attrs['password2']:
            raise serializers.ValidationError({
                'password':'passwords do not match'
            })
        documents = attrs.get(
            "documents",
            []
        )

        document_types = attrs.get(
            "document_types",
            []
        )

        if not documents:

            raise serializers.ValidationError({
                "documents":
                    "At least one verification document is required."
            })

        if len(documents) != len(document_types):

            raise serializers.ValidationError({
                "document_types":
                    "Each document must have a document type."
            })
        return attrs
    def validate_documents(self, files):

        allowed_types = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        ]

        max_size = 20 * 1024 * 1024

        for file in files:

            if file.content_type not in allowed_types:
                raise serializers.ValidationError(
                "Only PDF, JPEG and PNG files are allowed."
            )

            if file.size > max_size:
                raise serializers.ValidationError(
                "Document size must not exceed 20 MB."
            )

        return files

class MentorDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model=MentorDocument
        fields=[
            'id',
            'document',
            'external_url',
            'document_type',
            'status',
            'rejection_reason',
            'uploaded_at',
            'reviewed_at',
        ]
        read_only_fields=[
            'id',
            'status',
            'rejection_reason',
            'uploaded_at',
            'reviewed_at',
        ] 
    def validate(self,attrs):
        document=attrs.get('document') 
        external_url=attrs.get('external_url') 
        if not external_url and not document:
            raise serializers.ValidationError(
                'provide either an external url or document file'
            )  
        if document and external_url:
            raise serializers.ValidationError(
                'provide either an external url or document file, not both'
            )
        return attrs
    def validate_document(self,file):
        allowed_types=[
            'application/pdf',
            'image/jpeg',
            'image/png',
        ]
        if file.content_type not in allowed_types:
            raise serializers.ValidationError(
                'only pdf, jpeg and png files are allowed'
            )
        max_size=10*1024*1024
        if file.size>max_size:
            raise serializers.ValidationError(
                'document size must not exceed 10 mb'
            )
        return file

class VerifyMentorRegistrationOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(
        max_length=6,
        min_length=6,
    )
    def validate_email(self,value):
        return value.lower().strip()

class MentorForgotPasswordSerialzer(serializers.Serializer):
    email=serializers.EmailField()

class MentorVerifyResetOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(
        min_length=6,
        max_length=6
    )

class MentorResetPasswordSerializer(serializers.Serializer):
    reset_token=serializers.CharField()
    new_password=serializers.CharField(
        write_only=True,
        min_length=8
    )
    confirm_password=serializers.CharField(
        write_only=True
    )
    def validate(self,attrs):
        if (attrs['new_password']!=attrs['confirm_password']):
            raise serializers.ValidationError({
                'error':'passwords do not match'
            })
        return attrs

class MentorProfileUpdateSerializer(serializers.Serializer):
    full_name = serializers.CharField(
        max_length=255,
        required=False
    )

    username = serializers.CharField(
        max_length=150,
        required=False
    )

    phone_number = serializers.CharField(
        max_length=15,
        required=False,
        allow_blank=True
    )

    teaching_niche = serializers.CharField(
        required=False,
        allow_blank=True
    )

    profile_image = serializers.ImageField(
        required=False,
        allow_null=True
    )

    remove_profile_image = serializers.BooleanField(
        required=False
    )