from rest_framework import serializers

from ..models import (Assessment,AssessmentQuestion,AssessmentAnswer,AssessmentResult,) 

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssessmentQuestion
        fields=[
            'id',
            'lesson',
            'question_text',
            'question_type',
            'options',
            'points',
            'order',
        ]

class AssessmentSerializer(serializers.ModelSerializer):
    questions=AssessmentQuestionSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model=Assessment
        fields=[
            'id',
            'course',
            'enrollment',
            'attempt_number',
            'total_questions',
            'score',
            'status',
            'started_at',
            'completed_at',
            'questions',
        ]
        read_only_fields=[
            'id',
            'enrollment',
            'total_questions',
            'score',
            'status',
            'started_at',
            'completed_at',
            'questions',
        ]   

class AssessmentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssessmentAnswer
        fields=[
            'id',
            'question',
            'answer',
            'is_correct',
            'score',
            'feedback',
            'evaluated_at',
        ]
        read_only_fields=[
            'id',
            'is_correct',
            'score',
            'feedback',
            'evaluated_at',
        ]

class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssessmentResult
        fields=[
            'id',
            'assessment',
            'score',
            'passed',
            'proficiency_level',
            'strengths',
            'weaknesses',
            'recommendations',
            'ai_summary',
            'created_at',
        ]
        read_only_fields=[
            'id',
            'assessment',
            'score',
            'passed',
            'proficiency_level',
            'strengths',
            'weaknesses',
            'recommendations',
            'ai_summary',
            'created_at',
        ]