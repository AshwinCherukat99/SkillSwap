from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.accounts.services import get_recommended_users
from apps.accounts.serializers.recommendation import RecommendedUserSerializer

class RecommendedUsersView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        recommendations=get_recommended_users(request.user)
        serializer=RecommendedUserSerializer(
            recommendations,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )