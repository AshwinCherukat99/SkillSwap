from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers.general import CertificateSerializer
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class UserCertificatesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        certificates=(
        Certificate.objects.filter(
            user=request.user
        ).select_related('course','enrollment','assessment').order_by('-issued_at')
        )
        serializer=CertificateSerializer(
            certificates,
            many=True
        )
        return Response(
            {
                'certificates':serializer.data,
            },
            status=status.HTTP_200_OK
        )

class UserCertificateDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,certificate_id):
        try:
            certificate=(
                Certificate.objects.select_related('course','enrollment','assessment').get(certificate_id=certificate_id,user=request.user)
            )
        except Certificate.DoesNotExist:
            return Response(
                {
                    'error':'certificate not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer=CertificateSerializer(certificate)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )