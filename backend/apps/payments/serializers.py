from rest_framework import serializers
from apps.payments.models import MentorPayoutProfile

class MentorPayoutProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=MentorPayoutProfile
        fields=[
            'id',
            'razorpay_contact_id',
            'razorpay_fund_account_id',
            'is_verified',
            'created_at',
            'updated_at'
        ]
        read_only_fields=fields