from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.skills.models import SuggestedSkill,Skill

class SuggestSkillView(APIView):
    def post(self,request):
        name=request.data.get('name','').strip()
        description=request.data.get('description','').strip()
        suggested_for=request.data.get('suggested_for','').strip()
        if not name:
            return Response({
                'name':'skill name is required'
            },status=status.HTTP_400_BAD_REQUEST)
        if suggested_for not in [
            SuggestedSkill.SuggestedFor.OFFER,
            SuggestedSkill.SuggestedFor.WANT
        ]:
            return Response(
                {
                    'suggested_for':'invalid skill type'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_skill=Skill.objects.filter(
            name__iexact=name
        ).first()
        if existing_skill:
            return Response(
                {
                    'error':'this skill already exists'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_suggestion=SuggestedSkill.objects.filter(
            suggested_by=request.user,
            name__iexact=name,
            suggested_for=suggested_for,
            status=SuggestedSkill.Status.PENDING,
        ).first()
        if existing_suggestion:
            return Response(
                {
                    'error':'you already suggested this skill'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        suggestion=SuggestedSkill.objects.create(
            suggested_by=request.user,
            name=name,
            description=description,
            suggested_for=suggested_for,
        )
        return Response(
            {
                'message':'skill suggestion submitted successfully',
                'id':suggestion.id,
            },
            status=status.HTTP_201_CREATED,
        )