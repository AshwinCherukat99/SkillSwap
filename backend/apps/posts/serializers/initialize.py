from rest_framework import serializers

from ..models import Post,PostComment,PostLike

class PostAuthorSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    username=serializers.CharField()
    full_name=serializers.CharField()
    profile_image=serializers.ImageField(
        allow_null=True,
        required=False,
    )

class PostSerializer(serializers.ModelSerializer):
    is_owner=serializers.SerializerMethodField()
    author=serializers.SerializerMethodField()
    likes_count=serializers.IntegerField(read_only=True)
    comments_count=serializers.IntegerField(read_only=True)
    liked_by_me=serializers.SerializerMethodField()
    class Meta:
        model=Post
        fields=[
            'id',
            'author',
            'is_owner',
            'content',
            'image',
            'created_at',
            'updated_at',
            'likes_count',
            'comments_count',
            'liked_by_me',
        ]
    def get_is_owner(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return False

    # Normal user post
        if obj.user_author_id == request.user.id:
            return True

        return False
    def get_author(self,obj):
        if obj.user_author:
            return {
                'id':obj.user_author.id,
                'username':obj.user_author.username,
                'full_name':obj.user_author.full_name,
                'profile_image':(
                    obj.user_author.profile_image.url
                    if obj.user_author.profile_image
                    else None
                ),
                'author_type':'USER',
            }
        if obj.mentor_author:
            return {
                'id':obj.mentor_author.id,
                'username':obj.mentor_author.username,
                'full_name':obj.mentor_author.full_name,
                'profile_image':(
                    obj.mentor_author.profile_image.url
                    if obj.mentor_author.profile_image
                    else None
                ),
                'author_type':'MENTOR',
            }
        return None
    def get_liked_by_me(self,obj):
        request=self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return PostLike.objects.filter(
            post=obj,
            user=request.user
        ).exists()

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=[
            'content',
            'image'
        ]
    def validate(self, attrs):

        content = attrs.get('content')
        image = attrs.get('image')

        if not content and not image:
            raise serializers.ValidationError(
                'Post must contain either content or an image.'
            )

        if content and not content.strip():
            if not image:
                raise serializers.ValidationError(
                    'Post must contain either content or an image.'
                )

            attrs['content'] = ''

        return attrs

class PostCommentSerializer(serializers.ModelSerializer):
    user=serializers.SerializerMethodField()
    class Meta:
        model=PostComment
        fields=[
            'id',
            'user',
            'content',
            'created_at',
        ]
    def get_user(self,obj):
        return {
            'id':obj.user.id,
            'username':obj.user.username,
            'full_name':obj.user.full_name,
            'profile_image':(
                obj.user.profile_image.url 
                if obj.user.profile_image
                else None
            )
        }

class CreateCommentSerialzer(serializers.ModelSerializer):
    class Meta:
        model=PostComment
        fields=[
            'content'
        ]
    def validate_content(self,value):
        if not value.strip():
            raise serializers.ValidationError(
                'comment cannot be empty'
            )
        return value