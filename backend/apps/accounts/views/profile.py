from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..serializers.profile import UserProfileSerializer,ProfileImageSerializer,PublicProfileSerializer

from django.contrib.auth import get_user_model

User=get_user_model()

class UserProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        serializer=UserProfileSerializer(request.user)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    def put(self,request):
        serializer=UserProfileSerializer(
            request.user,
            data=request.data
        )
        serializer.is_valid(raise_exception=True) 
        serializer.save()
        return Response(
            {
                'message':'profile updated successfully',
                'user':serializer.data
            },
            status=status.HTTP_200_OK
        )
    def patch(self,request):
        serializer=UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(
            raise_exception=True
        )
        serializer.save()
        return Response({
            'message':'profile updated successfully',
            'user':serializer.data
        },
        status=status.HTTP_200_OK,
        )


class ProfileImageView(APIView):
    permission_classes=[IsAuthenticated]
    def put(self,request):
        serializer=ProfileImageSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                'message':'profile image updated successfully',
                'profile_image':serializer.data['profile_image']
            },
            status=status.HTTP_200_OK
        )

class PublicProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,user_id):
        try:
            user=User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return Response(
                {
                    'error':'user not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=PublicProfileSerializer(user)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )