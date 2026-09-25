from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsAdmin
from rest_framework import status
from django.utils import timezone
from django.db.models import Q,Count
from apps.accounts.models import User

from .models import Notification,AdminNotification

from .serilaizers.adminnotif import AdminNotificationSerializer
from .serilaizers.initialization import NotificationSerializer
from .services import send_admin_notification

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

class AdminNotificationListCreateView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        notifications=(AdminNotification.objects.select_related('recipient').all())
        serializer=AdminNotificationSerializer(
            notifications,
            many=True
        )
        today=timezone.localdate()
        sent_today=(AdminNotification.objects.filter(status=AdminNotification.Status.SENT,sent_at__date=today).count())
        scheduled=(AdminNotification.objects.filter(status=AdminNotification.Status.SCHEDULED).count())
        push_notifications=(AdminNotification.objects.filter(push=True).count())
        email_campaigns=(AdminNotification.objects.filter(email=True).count())
        announcements=(AdminNotification.objects.filter(audience=AdminNotification.Audience.ALL).count())
        return Response({
            'stats':{
                'sent_today':sent_today,
                'scheduled':scheduled,
                'push_notifications':push_notifications,
                'email_campaigns':email_campaigns,
                'announcements':announcements,
            },
            'notifications':serializer.data,
        })
    def post(self,request):
        serializer=AdminNotificationSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        scheduled_at=(serializer.validated_data.get('scheduled_at'))
        if scheduled_at:
            if scheduled_at<=timezone.now():
                return Response(
                    {
                        'scheduled_at':'scheduled time must be in the future'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            notification=serializer.save(
                status=AdminNotification.Status.SCHEDULED,
            )
            return Response(
                AdminNotificationSerializer(
                    notification
                ).data,
                status=status.HTTP_201_CREATED,
            )
        notification=serializer.save()
        notification=send_admin_notification(notification)
        return Response(
            AdminNotificationSerializer(
                notification
            ).data,
            status=status.HTTP_201_CREATED,
        )

class AdminNotificationDetailView(APIView):
    permission_classes=[IsAdmin]
    def get_object(self,notification_id):
        return (AdminNotification.objects.select_related('recipient').filter(id=notification_id).first())
    def get(self,request,notification_id):
        notification=self.get_object(notification_id)
        if not notification:
            return Response(
                {
                    'detail':'notification not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer=AdminNotificationSerializer(notification)
        return Response(
            serializer.data
        )
    def patch(self,request,notification_id):
        notification=self.get_object(notification_id)
        if not notification:
            return Response({
                'detail':'notification not found'
            },
            status=status.HTTP_404_NOT_FOUND,)
        if (notification.status==AdminNotification.Status.SENT):
            return Response({
                'detail':'sent notifications cannot be edited'
            },status=status.HTTP_400_BAD_REQUEST)
        serializer=AdminNotificationSerializer(
            notification,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        notification=serializer.save()
        return Response(
            AdminNotificationSerializer(
                notification
            ).data
        )
    def delete(self,request,notification_id):
        notification=self.get_object(notification_id)
        if not notification:
            return Response({
                'detail':'notification not found'
            },
            status=status.HTTP_404_NOT_FOUND,)
        if (notification.status==AdminNotification.Status.SENT):
            return Response({
                'detail':'sent notifications cannot be deleted'
            },status=status.HTTP_400_BAD_REQUEST)
        notification.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

class CancelAdminNotificationView(APIView):
    permission_classes=[IsAdmin]
    def post(self,request,notification_id):
        notification=(Notification.objects.filter(id=notification_id,
                                                  status=AdminNotification.Status.SCHEDULED,).first())
        if not notification:
            return Response(
                {
                    'detail':'scheduled notification not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        notification.status=(AdminNotification.Status.CANCELLED)
        notification.save(
            update_fields=[
                'status',
                'updated_at',
            ]
        )
        return Response({
            'message':'notification cancelled successfully'
        })

class AdminNotificationUserSearchView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        query=request.query_params.get(
            'search',''
        ).strip()
        if not query:
            return Response({'users':[]})
        users=(User.objects.filter(is_active=True).filter(Q(username__icontains=query)|Q(email__icontains=query)|Q(full_name__icontains=query)).order_by('username')[:20])
        data=[]
        for user in users:
            data.append({
                'id':user.id,
                'username':user.username,
                'email':user.email,
                'full_name':user.full_name,
                'role':user.role,
                'profile_image':(user.profile_image.url if user.profile_image else None),
            })
        return Response({
            'users':data,
        })