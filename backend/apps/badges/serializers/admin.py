from rest_framework import serializers
from apps.badges.models import Badge,BadgeRule

class BadgeRuleSerializer(serializers.ModelSerializer):
    rule_type_display=serializers.CharField(
        source='get_rule_type_display',
        read_only=True
    )
    class Meta:
        model=BadgeRule
        fields=[
            'id',
            'rule_type',
            'rule_type_display',
            'target_value',
        ]

class AdminBadgeCreateSerializer(serializers.ModelSerializer):
    rules=BadgeRuleSerializer(
        many=True,
        required=False,
    )
    class Meta:
        model=Badge
        fields=[
            'name',
            'slug',
            'description',
            'icon',
            'rarity',
            'xp_reward',
            'is_active',
            'rules',
        ]
    def validate_name(self,value):
        if not value.strip():
            raise serializers.ValidationError('Badge name cannot be empty')   
        return value.strip()
    def validate_description(self,value):
        if len(value)>300:
            raise serializers.ValidationError('description cannot exceed 300 cjharacters')
        return value
    def create(self,validated_data):
        rules_data=validated_data.pop('rules',[])
        badge=Badge.objects.create(**validated_data)
        for rule_data in rules_data:
            BadgeRule.objects.create(
                badge=badge,
                **rule_data,
            )
        return badge

class AdminBadgeUpdateSerializer(serializers.ModelSerializer):
    rules=BadgeRuleSerializer(
        many=True,
        required=False,
    )
    class Meta:
        model=Badge
        fields=[
            'name',
            'slug',
            'description',
            'icon',
            'rarity',
            'xp_reward',
            'is_active',
            'rules',
        ]
    def update(self,instance,validated_data):
        rules_data=validated_data.pop('rules',None)
        for attr,value in validated_data.items():
            setattr(instance,attr,value)
        instance.save()
        if rules_data is not None:
            instance.rules.all().delete()
            for rule_data in rules_data:
                BadgeRule.objects.create(badge=instance,**rule_data)
        return instance