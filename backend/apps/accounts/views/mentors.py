from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.mentors.models import Mentor
from ..serializers.mentor import MentorListSerializer

class MentorListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        mentors = Mentor.objects.filter(
            is_active=True,
            is_verified=True
        ).select_related("profile").prefetch_related('courses')

        serializer = MentorListSerializer(
            mentors,
            many=True,
            context={"request": request}
        )

        return Response(
            {
                "mentors": serializer.data
            },
            status=status.HTTP_200_OK
        )