from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser
from apps.notifications.models import Notification

from .models import Post,PostComment,PostLike
from .serializers.initialize import PostSerializer,CreatePostSerializer,PostCommentSerializer,CreateCommentSerialzer

class MyPostsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        posts=Post.objects.filter(
            user_author=request.user
        )
        serializer=PostSerializer(
            posts,
            many=True,
            context={
                'request':request
            }
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CreatePostView(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def post(self,request):
        serializer=CreatePostSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        post=serializer.save(
            user_author=request.user
        )
        response_serializer = PostSerializer(
            post,
            context={
                'request': request
            }
        )
        return Response(
            {
                'message':'post created successfully',
                'post':response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

class DeletePostView(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,post_id):
        try:
            post=Post.objects.get(
                id=post_id,
                user_author=request.user
            )
        except Post.DoesNotExist:
            return Response(
                {
                    'error':'post not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        post.delete()
        return Response(
            {
                'message':'post deleted successfully'
            },
            status=status.HTTP_204_NO_CONTENT
        )

class EditPostView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,post_id):
        try:
            post=Post.objects.get(
                id=post_id,
                user_author=request.user
            )
        except Post.DoesNotExist:
            return Response(
                {
                    'error':'post not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        content=request.data.get('content')
        if not content or not content.strip():
            return Response(
                {
                    'error':'post content cannot be empty'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        post.content=content.strip()
        post.save()
        response_serializer=PostSerializer(
            post,
            context={
                'request':request
            }
        )
        return Response(
            {
                'message':'post updated successfully',
                'post':response_serializer.data
            },
            status=status.HTTP_200_OK,
        )

class FeedPostsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        posts=Post.objects.select_related(
            'user_author',
            'mentor_author'
        ).annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True)).order_by('-created_at')
        serializer=PostSerializer(
            posts,
            many=True,
            context={
                'request':request
            }
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class PostLikeView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,post_id):
        try:
            post=Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                    {'error':'post not found'},
                    status=status.HTTP_404_NOT_FOUND,
            )
        like,created=PostLike.objects.get_or_create(
            post=post,
            user=request.user
        )
        likes_count=PostLike.objects.filter(
            post=post
        ).count()
        notification,created=Notification.objects.get_or_create(
            recipient=post.user_author,
            notification_type='POST',
            title='Like Notification',
            message=f'{request.user} has liked your post-{post.content}',
        )
        return Response(
            {
                'liked':True,
                'likes_count':likes_count
            },
            status=(
                status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        )
    def delete(self,request,post_id):
        deleted,_=PostLike.objects.filter(
            post_id=post_id,
            user=request.user
        ).delete()
        likes_count=PostLike.objects.filter(
            post_id=post_id
        ).count()
        return Response(
            {
                'liked':False,
                'likes_count':likes_count
            },
            status=status.HTTP_200_OK
        )

class PostCommentsView(APIView):
    permission_classes=[IsAuthenticated] 
    def get(self,request,post_id):
        try:
            post=Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {
                    'error':'post not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        comments=(
            PostComment.objects.filter(post=post).select_related('user').order_by('created_at')
        )
        serilaizer=PostCommentSerializer(
            comments,
            many=True,
            context={
                'request':request
            }
        )
        return Response(
            serilaizer.data,
            status=status.HTTP_200_OK
        )
    def post(self,request,post_id):
        try:
            post=Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {
                    'error':'post not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=CreateCommentSerialzer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        comment=serializer.save(
            post=post,
            user=request.user
        )
        response_serializer=PostCommentSerializer(
            comment,
            context={
                'request':request
            }
        )
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )