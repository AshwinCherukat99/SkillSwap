from datetime import timedelta
from django.shortcuts import render,get_object_or_404
from django.utils import timezone
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Story,StoryView,StoryReaction

from .serializers import StorySerializer,StoryViewerSerializer,StoryReactionSerializer
# Create your views here.
class IsRegularUser(IsAuthenticated):
    def has_permission(self,request,view):
        has_access=super().has_permission(request,view)
        if not has_access:
            return False
        return (
            getattr(request.user,'role',None)=='USER'
        )

class StoryListCreateView(APIView):
    permission_classes=[IsRegularUser]
    def get(self,request):
        now=timezone.now()
        stories=Story.objects.filter(
            is_active=True,expires_at__gt=now
        ).exclude(
            user=request.user
        ).select_related(
            'user'
        ).annotate(
            total_views=Count('views',distinct=True),
            total_reactions=Count('reactions',distinct=True)
        ).order_by(
            '-created_at'
        )
        serializer=StorySerializer(
            stories,
            many=True,
            context={'request':request}
        )
        return Response(serializer.data)
    def post(self,request):
        serializer=StorySerializer(
            data=request.data,
            context={'request':request}
        )
        serializer.is_valid(raise_exception=True)
        story=serializer.save(
            user=request.user,
            expires_at=timezone.now()+timedelta(hours=24)
        )
        return Response(
            StorySerializer(
                story,
                context={'request':request}
            ).data,
            status=status.HTTP_201_CREATED,
        )

class StoryDetailView(APIView):
    permission_classes=[IsRegularUser]
    def get(self,request,story_id):
        story=get_object_or_404(
            Story.objects.select_related('user'),
            id=story_id,
            is_active=True,
            expires_at__gt=timezone.now()
        )
        serializer=StorySerializer(
            story,
            context={'request':request}
        )
        return Response(
            serializer.data
        )
    def delete(self,request,story_id):
        story=get_object_or_404(
            Story,
            id=story_id,
            user=request.user
        )
        story.delete()
        return Response({
            'message':'story deleted successfully'
        },status=status.HTTP_200_OK)

class StoryViewCreateView(APIView):
    permission_classes=[IsRegularUser]
    def post(self,request,story_id):
        story=get_object_or_404(
            Story,
            id=story_id,
            is_active=True,
            expires_at__gt=timezone.now()
        )
        if story.user_id==request.user.id:
            return Response({
                'message':'you cannot view your own story'
            },status=status.HTTP_400_BAD_REQUEST)
        story_view,created=StoryView.objects.get_or_create(
            story=story,
            user=request.user
        )
        return Response({
            'message':('story view recorded' if created else 'story was already viewed'),
            'viewed_at':story_view.viewed_at,
        },status=status.HTTP_200_OK)

class StoryViewerListView(APIView):
    permission_classes=[IsRegularUser]
    def get(self,request,story_id):
        story=get_object_or_404(
            Story,
            id=story_id,
            user=request.user
        )
        viewers=(
            StoryView.objects.filter(
                story=story
            ).select_related('user').order_by(
                '-viewed_at'
            )
        )
        serializer=StoryViewerSerializer(
            viewers,
            many=True,
            context={'request':request}
        )
        return Response(serializer.data)        

class StoryReactionView(APIView):
    permission_classes=[IsRegularUser]
    def post(self,request,story_id):
        story=get_object_or_404(
            Story,
            id=story_id,
            is_active=True,
            expires_at__gt=timezone.now(),
        )
        if story.user_id==request.user.id:
            return Response({
                'message':'you cannot react to your own story'
            },status=status.HTTP_400_BAD_REQUEST)
        serializer=StoryReactionSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        reaction,created=StoryReaction.objects.update_or_create(
            story=story,
            user=request.user,
            defaults={
                'reaction':serializer.validated_data['reaction']
            }
        )
        return Response(
            {
                'message':(
                    'reaction added successfully'
                    if created
                    else 'reaction updated successfully'
                ),
                'reaction':StoryReactionSerializer(reaction).data
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    def delete(self,request,story_id):
        story=get_object_or_404(
            Story,
            id=story_id,
            is_active=True,
            expires_at__gt=timezone.now()
        )
        deleted_count,_=StoryReaction.objects.filter(
            story=story,
            user=request.user
        ).delete()
        if deleted_count==0:
            return Response(
                {'message':'you have not reacted to this story'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {'message':'reaction removed successfully'},
            status=status.HTTP_200_OK
        )

class MyStoriesView(APIView):
    permission_classes=[IsRegularUser]
    def get(self,request):
        stories=(
            Story.objects.filter(
            user=request.user
        ).annotate(
            total_views=Count('views',distinct=True),
            total_reactions=Count('reactions',distinct=True)
        ).order_by('-created_at')
        )
        serializer=StorySerializer(
            stories,
            many=True,
            context={'request':request}
        )
        return Response(serializer.data)