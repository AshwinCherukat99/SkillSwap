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
            'deadline',
            'duration_seconds'
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

class AssessmentQuestionReviewSerializer(serializers.ModelSerializer):
    student_answer=serializers.SerializerMethodField()
    is_correct=serializers.SerializerMethodField()
    score_awarded=serializers.SerializerMethodField()
    feedback=serializers.SerializerMethodField()
    class Meta:
        model=AssessmentQuestion
        fields=[
            'id',
            'lesson',
            'question_text',
            'question_type',
            'options',
            'correct_answer',
            'points',
            'order',
            'student_answer',
            'is_correct',
            'score_awarded',
            'feedback',
        ]
    def get_student_answer(self,question):
        answer=self.get_answer(question)
        return answer.answer if answer else ''
    def get_is_correct(self,question):
        answer=self.get_answer(question)
        return answer.is_correct if answer else False
    def get_score_awarded(self,question):
        answer=self.get_answer(question)
        return answer.score if answer else 0
    def get_feedback(self,question):
        answer=self.get_answer(question)
        return answer.feedback if answer else ''
    def get_answer(self,question):
        cache=self.context.setdefault('_answer_cache',{})
        if question.id not in cache:
            request=self.context['request']
            cache[question.id]=question.answers.filter(
                user=request.user
            ).first()           
        return cache[question.id]

class AssessmentResultDetailSerializer(serializers.ModelSerializer):
    questions=AssessmentQuestionReviewSerializer(
        many=True,
        read_only=True
    )
    result=AssessmentResultSerializer(
        read_only=True
    )
    course_title=serializers.CharField(
        source='course.title',
        read_only=True,
    )
    class Meta:
        model=Assessment
        fields=[
            'id',
            'course',
            'course_title',
            'attempt_number',
            'total_questions',
            'score',
            'status',
            'started_at',
            'completed_at',
            'questions',
            'result',
        ]