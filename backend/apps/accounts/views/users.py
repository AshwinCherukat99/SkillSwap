from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.users import PublicUserProfileSerializer

User=get_user_model()

class PublicUserProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,user_id):
        profile_user=get_object_or_404(
            User.objects.prefetch_related(
                'user_badges__badge'
            ),
            pk=user_id,
            role=User.Role.USER,
            status=User.Status.ACTIVE,
            is_active=True,
        )
        serializer=PublicUserProfileSerializer(
            profile_user,
            context={'requet':request}
        )
        return Response(serializer.data)