from django.shortcuts import render
from rest_framework import status  
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.permissions import IsAdmin

from .models import Skill,UserSkill,SuggestedSkill
from .serializers import (
    ManageSkillSerializer,
    SkillSerializer,
    UserSkillSerializer,
    SuggestSkillSerializer,
)  
from .services import (
    add_user_skill,
    remove_user_skill,
    create_skill_suggestion,
    approve_skill_suggestion,
)
# Create your views here.

class SkillListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        skills=Skill.objects.filter(
            is_active=True
        ).order_by('name')
        serializer=SkillSerializer(
            skills,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class SkillsIWantView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        skills=UserSkill.objects.filter(
            user=request.user,
            skill_type=UserSkill.SkillType.WANT,
        ).select_related('skill')
        serializer=UserSkillSerializer(skills,many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )  
    def post(self,request):
        serializer=ManageSkillSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)   
        skill,created=add_user_skill(
            user=request.user,
            skill_id=serializer.validated_data['skill_id'],
            skill_type=UserSkill.SkillType.WANT,
        )
        response_serializer=UserSkillSerializer(skill)
        return Response(
            response_serializer.data,
            status=(
                status.HTTP_201_CREATED
                if created else status.HTTP_200_OK
            ),
        )

class SkillsIOfferView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        skills=UserSkill.objects.filter(
            user=request.user,
            skill_type=UserSkill.SkillType.OFFER,
        ).select_related('skill')
        serializer=UserSkillSerializer(skills,many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    def post(self,request):
        serializer=ManageSkillSerializer(
            data=request.data
        ) 
        serializer.is_valid(raise_exception=True) 
        skill,created=add_user_skill(
            user=request.user,
            skill_id=serializer.validated_data['skill_id'],
            skill_type=UserSkill.SkillType.OFFER,
        ) 
        response_serializer=UserSkillSerializer(skill)
        return Response(
            response_serializer.data,
            status=(
                status.HTTP_201_CREATED
                if created 
                else status.HTTP_200_OK
            ),
        )

class RemoveSkillView(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,skill_id,skill_type):
        deleted=remove_user_skill(
            user=request.user,
            skill_id=skill_id,
            skill_type=skill_type.upper(),
        )
        if not deleted:
            return Response(
                {'error':'skill not found in your list'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {'message':'skill removed successfully'}, 
            status=status.HTTP_204_NO_CONTENT,
        )

class SuggestSkillView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=SuggestSkillSerializer(
            data=request.data,
        )
        serializer.is_valid(
            raise_exception=True,
        )
        try:
            suggestion=create_skill_suggestion(
                user=request.user,
                name=serializer.validated_data['name'], 
                description=serializer.validated_data.get(
                    'description',
                    ''
                ),
                suggested_for=serializer.validated_data['suggested_for'],
            )
        except ValueError as error:
            return Response(
                {'error':str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':(
                    'skill suggestion submitted' 
                    'for admin approval'
                ),
                'suggestion':{
                    'id':suggestion.id,
                    'name':suggestion.name,
                    'suggested_for':suggestion.suggested_for,
                    'status':suggestion.status,
                },
            },
            status=status.HTTP_201_CREATED,
        )

class ApproveSkillSuggestionView(APIView):
    permission_classes=[IsAdmin]
    def post(self,request,suggestion_id):
        try:
            suggestion=SuggestedSkill.objects.get(
                id=suggestion_id
            )
        except SuggestedSkill.DoesNotExist:
            return Response(
                {'error':'skill suggestion not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            skill=approve_skill_suggestion(
                suggestion=suggestion,
            )
        except ValueError as error:
            return Response(
                {'error':str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                'message':'skill suggestion approved',
                'skill':{
                    'id':skill.id,
                    'name':skill.name,
                    'slug':skill.slug,
                },
            },
            status=status.HTTP_200_OK,
        )