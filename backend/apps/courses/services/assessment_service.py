import json
from django.db import transaction
from ..models import Assessment,AssessmentQuestion 
from openai import OpenAI
from google import genai
from django.conf import settings
from collections import Counter
import time

client=genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_with_retry(prompt):
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
            )

            return response.text

        except Exception as exc:
            if attempt == 2:
                raise exc

            time.sleep(3)

@transaction.atomic
def generate_assessment_questions(assessment):
    course=assessment.course
    modules=course.modules.prefetch_related('lessons').all()
    lessons_data=[]  
    lesson_map={}
    for module in modules:
        for lesson in module.lessons.all():
            lessons_data.append({
                'lesson_id':lesson.id,
                'module_title':module.title,
                'lesson_title':lesson.title,
                'lesson_content':lesson.content,
            })
            lesson_map[lesson.id]=lesson
    if not lessons_data:
        raise ValueError(
            'This course does not contain any lessons'
        )
    course_content="\n\n".join(
        [
            f"""
            Module:{lesson['module_title']},
            Lesson ID:{lesson['lesson_id']},
            Lesson:{lesson['lesson_title']},
            Content:{lesson['lesson_content']}
            """
            for lesson in lessons_data
        ]
    )
    prompt = f"""
You are an educational assessment generator.

Create an assessment based ONLY on the course lessons provided below.

Course:
{course.title}

Course lessons:
{course_content}

Generate 10 questions.

Question distribution:
- 5 MCQ questions
- 2 TRUE_FALSE questions
- 2 SHORT_ANSWER questions
- 1 CODE question

Requirements:

1. Every question must be based on the provided lesson content.
2. Each question must contain the correct lesson_id.
3. lesson_id must be one of the lesson IDs provided.
4. MCQ questions must have exactly 4 options.
5. TRUE_FALSE questions must have exactly 2 options:
   ["True", "False"]
6. SHORT_ANSWER questions must have no options.
7. CODE questions must have no options.
8. Every question must have a correct_answer.
9. Every question is worth 1 point.
10. Do not create questions about information that does not appear in the lessons.
11. Make questions appropriate for the course content.
12. Return exactly 10 questions.
"""
    response_text=generate_with_retry(prompt)           
    try:
        data=json.loads(response_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            'AI returned invalid json'
        ) from exc
    question_data=data.get('questions')
    if not isinstance(question_data,list):
        raise ValueError(
            'ai response does not contain a valid questions list'
        )
    if len(question_data)!=10:
        raise ValueError(
            'ai did not generate exactly 10 questions'
        )
    question_types=Counter(question.get('question_type') for question in question_data)
    expected_distribution={
        'MCQ':5,
        'TRUE_FALSE':2,
        'SHORT_ANSWER':2,
        'CODE':1,
    }
    if question_types!=expected_distribution:
        raise ValueError(
            f'ínvalid question distribution'
            f'{dict(question_types)}'
        )
    valid_lesson_ids=set(lesson_map.keys())
    questions=[]
    for index,data in enumerate(question_data,start=1):
        lesson_id=data.get('lesson_id')
        question_type=data.get('question_type')
        question_text=data.get('question_text')      
        options=data.get('options')
        correct_answer=data.get('correct_answer') 
        if lesson_id not in valid_lesson_ids:
            raise ValueError(
                f'invalid lesson id returned by ai:{lesson_id}'
            )
        if not question_text:
            raise ValueError(
                f'question {index} has no question text'
            )
        if not correct_answer:
            raise ValueError(
                f'question {index} has no correct answer'
            )
        if question_type=='MCQ':
            if not isinstance(options,list):
                raise ValueError(
                    f'MCQ question {index} must have options'
                )
            if len(options)!=4:
                raise ValueError(
                    f'MCQ question {index} must have exactly'
                    f'four options'
                )
        elif question_type=='TRUE_FALSE':
            if options!=['True','False']:
                raise ValueError(
                    f'TRUE_FALSE question {index} must have '
                    f'options ["True","False"]'
                )  
        elif question_type in ['SHORT_ANSWER','CODE']:
            if options not in [None,[]]:
                raise ValueError(
                    f'{question_type} question {index} '
                    f'cannot have options'
                )
        question=AssessmentQuestion.objects.create(
            assessment=assessment,
            lesson=lesson_map[lesson_id],   
            question_text=question_text,
            question_type=question_type,
            options=options,
            correct_answer=correct_answer,
            points=1,
            order=index,
        )
        questions.append(question)
    assessment.total_questions=len(questions)
    assessment.save(update_fields=['total_questions']) 
    return questions

def evaluate_subjective_answer(question,answer):
    prompt=f"""
You are an educational assessment evaluator.

Evaluate the student's answer based ONLY on the question
and the expected answer provided below.

Question:
{question.question_text}

Expected Answer:
{question.correct_answer}

Question Type:
{question.question_type}

Student Answer:
{answer}

Evaluate the student's answer.

Return ONLY valid JSON in this exact format:

{{
    "is_correct": true,
    "score": 1,
    "feedback": "Brief explanation of the evaluation."
}}

Rules:

1. score must be either 0 or 1.
2. is_correct must be true when score is 1.
3. is_correct must be false when score is 0.
4. For SHORT_ANSWER, accept answers that are semantically correct
   even if the wording is different.
5. For CODE, evaluate whether the code correctly solves the
   requested problem.
6. Do not require the student's answer to exactly match the
   expected answer.
7. Do not award partial marks because each question is worth 1 point.
"""
    response_text=generate_with_retry(prompt)
    try:
        result=json.loads(response_text)
    except json.JSONDecodeError:
        raise ValueError(
            'ai returned invalid evaluation json'
        )
    is_correct=result.get('is_correct')
    score=result.get('score')
    feedback=result.get('feedback','')
    if not isinstance(is_correct,bool):
        raise ValueError(
            'ai returned invalid is_correct value'
        )
    if score not in [0,1]:
        raise ValueError(
            'ai returned invalid score'
        )
    return {
        'is_correct':is_correct,
        'score':score,
        'feedback':feedback,
    }

def evaluate_objective_answer(question,answer):
    student_answer=answer.strip().lower()
    correct_answer=question.correct_answer.strip().lower()
    is_correct=student_answer==correct_answer
    return {
        'is_correct':is_correct,
        'score':1 if is_correct else 0,
        'feedback':{
            'correct_answer' if is_correct
            else f'correct_answer:{question.correct_answer}'
        }
    }

def generate_assessment_summary(assessment,answers,percentage):
    answer_data=[]
    for answer in answers:
        answer_data.append({
            'question':answer.question.question_text,
            'question_type':answer.question.question_type,
            'student_answer':answer.answer,
            'is_correct':answer.is_correct,
            'score':answer.score,
            'feedback':answer.feedback,
        })
    prompt=f"""
You are an educational assessment analyst.

Analyze the student's assessment performance.

Course:
{assessment.course.title}

Score:
{percentage}%

Questions and answers:
{json.dumps(answer_data, indent=2)}

Return ONLY valid JSON:

{{
    "summary": "Short overall assessment summary.",
    "strengths": "Areas the student performed well in.",
    "weaknesses": "Areas where the student needs improvement.",
    "recommendations": "Specific recommendations for improvement."
}}

Keep the feedback educational and concise.
"""
    response_text=generate_with_retry(prompt)
    try:
        return json.loads(
            response_text
        )
    except json.JSONDecodeError:
        return {
            'summary':'assessment completed',
            'strengths':'',
            'weaknesses':'',
            'recommendations':'',
        }