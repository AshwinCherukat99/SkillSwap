from rest_framework import serializers

class RejectMentorSerializer(serializers.Serializer): 
    rejection_reason=serializers.CharField(
        min_length=1,
        max_length=1000,
    )

class RequestMentorInfoSerializer(serializers.Serializer):
    message=serializers.CharField(
        min_length=1,
        max_length=1000,
    )