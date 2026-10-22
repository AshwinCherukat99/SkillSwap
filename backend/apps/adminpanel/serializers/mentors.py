from rest_framework import serializers

from apps.mentors.models import Mentor,MentorProfile
from apps.courses.models import Course,CourseEnrollment

class AdminMentorListSerializer(serializers.ModelSerializer):
    mentor_id=serializers.SerializerMethodField()
    profile_image_url=serializers.SerializerMethodField()
    qualification=serializers.SerializerMethodField()
    organization=serializers.SerializerMethodField()
    students_count=serializers.SerializerMethodField()
    courses_count=serializers.SerializerMethodField()
    current_profession=serializers.SerializerMethodField()
    status=serializers.CharField(read_only=True)
    class Meta:
        model=Mentor
        fields=[
            'id',
            'mentor_id',
            'full_name',
            'username',
            'email',
            'profile_image_url',
            'qualification',
            'current_profession',
            'organization',
            'rating',
            'total_reviews',
            'students_count',
            'courses_count',
            'is_verified',
            'is_active',
            'status',
            'created_at',
        ]
    def get_mentor_id(self,obj):
        return f'MNT-{obj.id:04d}'
    def get_profile_image_url(self,obj):
        request=self.context.get('request')
        if not obj.profile_image:
            return None
        if request:
            return request.build_absolute_uri(
                obj.profile_image.url
            )
        return obj.profile_image.url
    def get_qualification(self,obj):
        try:
            return obj.profile.qualification
        except MentorProfile.DoesNotExist:
            return ''
    def get_current_profession(self,obj):
        try:
            return obj.profile.current_profession
        except MentorProfile.DoesNotExist:
            return ''
    def get_organization(self,obj):
        try:
            return obj.profile.organization
        except MentorProfile.DoesNotExist:
            return ''
    def get_students_count(self,obj):
        return CourseEnrollment.objects.filter(
            course__mentor=obj,
        ).values('user').distinct().count()
    def get_courses_count(self,obj):
        return Course.objects.filter(
            mentor=obj
        ).count()

class AdminMentorDetailSerializer(serializers.ModelSerializer):
    mentor_id=serializers.SerializerMethodField()
    profile_image_url=serializers.SerializerMethodField()
    profile=serializers.SerializerMethodField()
    students_count=serializers.SerializerMethodField()
    courses_count=serializers.SerializerMethodField()
    class Meta:
        model=Mentor
        fields=[
            'id',
            'mentor_id',
            'full_name',
            'username',
            'email',
            'phone_number',
            'profile_image_url',
            'is_verified',
            'is_active',
            'status',
            'rating',
            'total_reviews',
            'students_count',
            'courses_count',
            'profile',
            'created_at',
            'updated_at',
        ]
    def get_mentor_id(self,obj):
        return f'MNT-{obj.id:04d}'
    def get_profile_image_url(self,obj):
        request=self.context.get('request')
        if not obj.profile_image:
            return None
        if request:
            return request.build_absolute_uri(
                obj.profile_image.url
            )
        return obj.profile_image.url
    def get_profile(self,obj):
        try:
            profile=obj.profile
        except MentorProfile.DoesNotExist:
            return None
        return {
            'qualification':profile.qualification,
            'current_profession':profile.current_profession,
            'organization':profile.organization,
            'experience_years':profile.experience_years,
            'professional_summary':profile.professional_summary,
            'teaching_niche':profile.teaching_niche,
        }
    def get_students_count(self,obj):
        return CourseEnrollment.objects.filter(
            course__mentor=obj
        ).values('user').distinct().count()
    def get_courses_count(self,obj):
        return Course.objects.filter(
            mentor=obj
        ).count()

class AdminMentorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Mentor
        fields=[
            'full_name',
            'username',
            'email',
            'phone_number',
            'profile_image',
            'is_active',
        ]

class AdminMentorProfileSerializer(serializers.ModelSerializer):
    qualification=serializers.SerializerMethodField()
    current_profession=serializers.SerializerMethodField()
    organization=serializers.SerializerMethodField()
    experience_years=serializers.SerializerMethodField()
    professional_summary=serializers.SerializerMethodField()
    teaching_niche=serializers.SerializerMethodField()
    profile_image=serializers.SerializerMethodField()
    class Meta:
        model=Mentor
        fields=[
            'id',
            'full_name',
            'username',
            'email',
            'profile_image',
            'phone_number',
            'status',
            'is_active',
            'is_verified',
            'rating',
            'total_reviews',
            'qualification',
            'current_profession',
            'organization',
            'experience_years',
            'professional_summary',
            'teaching_niche',
            'created_at',
            'updated_at',
        ]
    def get_profile(self,obj):
        try:
            return obj.profile
        except Mentor.profile.RelatedObjectDoesNotExist:
            return None
    def _profile_value(self,obj,field):
        profile=self.get_profile(obj)
        if profile is None:
            return None
        return getattr(profile,field,None)
    def get_qualification(self,obj):
        return self._profile_value(obj,'qualification')
    def get_current_profession(self,obj):
        return self._profile_value(obj,'current_profession')
    def get_organization(self,obj):
        return self._profile_value(obj,'organization')
    def get_experience_years(self,obj):
        return self._profile_value(obj,'experience_years')
    def get_professional_summary(self,obj):
        return self._profile_value(obj,'professional_summary') 
    def get_teaching_niche(self,obj): 
        return self._profile_value(obj,'teaching_niche')
    def get_profile_image(self,obj):
        request=self.context.get('request')
        if not obj.profile_image:
            return None
        image_url=obj.profile_image.url
        if request:
            return request.build_absolute_uri(image_url)
        return image_url