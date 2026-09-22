from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Notification

from .serilaizers.initialization import NotificationSerializer

class NotificationListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        notifications=Notification.objects.filter(
            recipient=request.user
        )
        serializer=NotificationSerializer(
            notifications,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class MarkNotificationReadView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,notification_id):
        try:
            notification=(
                Notification.objects.get(
                    id=notification_id,
                    recipient=request.user
                )
            )
        except Notification.DoesNotExist:
            return Response(
                {
                    'error':'notification not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        notification.is_read=True
        notification.save(
            update_fields=[
                'is_read'
            ]
        )
        serializer=NotificationSerializer(
            notification
        ) 
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class MarkAllNotificationsReadView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request):
        Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(
            is_read=True
        )
        return Response(
            {
                'message':'all notifications marked as read'
            },
            status=status.HTTP_200_OK,
        )

class UnreadNotificationCountView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        count=(
            Notification.objects.filter(
                recipient=request.user,
                is_read=False,
            ).count()
        )
        return Response(
            {
                'unread_count':count
            },
            status=status.HTTP_200_OK
        )

class ClearReadNotificationsView(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request):
        deleted_count,_=Notification.objects.filter(
            recipient=request.user,
            is_read=True
        ).delete()
        return Response(
            {
                'message':'read notifications cleared successfully',
                'deleted_count':deleted_count
            },
            status=status.HTTP_200_OK
        )