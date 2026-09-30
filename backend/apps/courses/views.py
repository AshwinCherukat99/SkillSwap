from django.shortcuts import render,get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from .models import Course,CourseEnrollment,Assessment,CourseCategory,CourseModule,CourseLesson,AssessmentQuestion,AssessmentAnswer,AssessmentResult,LessonProgress
from .serializers.course import CourseListSerializer,UserLessonSerializer
from .serializers.mentor_course import MentorCourseSerializer,MentorCourseCreateSerializer,MentorCourseDetailSerializer,MentorCourseUpdateSerializer
from apps.mentors.authentication import MentorJWTAuthentication
from apps.chat.models import Conversation,ConversationMember
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .services.assessment_service import generate_assessment_questions,evaluate_objective_answer,evaluate_subjective_answer 
import json
from django.db import transaction

from .serializers.assessment import AssessmentSerializer,AssessmentAnswerSerializer,AssessmentResultSerializer
from .serializers.mentor_student import MentorStudentSerializer

class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.filter(
            mentor__is_active=True,
            mentor__is_verified=True,
            status=Course.Status.PUBLISHED,
            is_active=True,
        ).select_related('mentor','category').order_by("title")

        serializer = CourseListSerializer(
            courses,
            many=True,
            context={'request':request}
        )

        return Response(serializer.data)

class StartAssessmentView(APIView): 
    permission_classes=[IsAuthenticated]
    def post(self,request,course_id):
        course=get_object_or_404(
            Course,
            id=course_id,
            status=Course.Status.PUBLISHED,
            is_active=True,
        ) 
        enrollment=CourseEnrollment.objects.filter(
            user=request.user,
            course=course
        ).first()
        if not enrollment:
            return Response(
                {
                    'error':'you are not enrolled in this course',
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        passed_assessment=Assessment.objects.filter(
            enrollment=enrollment,
            status=Assessment.Status.COMPLETED,
            result__passed=True
        ).exists()
        if passed_assessment:
            return Response(
                {
                    'error':'you have already passed this course assessment'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_assessment=Assessment.objects.filter(
            enrollment=enrollment,
            status=Assessment.Status.IN_PROGRESS,
        ).prefetch_related('questions').first()
        if existing_assessment:
            serializer=AssessmentSerializer(existing_assessment)
            return Response(serializer.data,
                            status=status.HTTP_200_OK,)
        last_attempt=Assessment.objects.filter(
            enrollment=enrollment,
        ).order_by('-attempt_number').first()
        if last_attempt:
            attempt_number=last_attempt.attempt_number+1
        else:
            attempt_number=1
        try:
            with transaction.atomic():
                assessment=Assessment.objects.create(
                            enrollment=enrollment,
                            course=course,
                            attempt_number=attempt_number,
                            total_questions=0,
                            status=Assessment.Status.IN_PROGRESS,
                        )
                generate_assessment_questions(assessment)
        except Exception as exc:
            return Response(
                {
                    'error':str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        serializer=AssessmentSerializer(assessment)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )  

class SaveAssessmentAnswerView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,assessment_id,question_id):
        assessment=get_object_or_404(
            Assessment,
            id=assessment_id,
            enrollment__user=request.user
        )
        if assessment.status!=Assessment.Status.IN_PROGRESS:
            return Response(
                {
                    'error':'this assessment is no longer in progress'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        question=get_object_or_404(
            AssessmentQuestion,
            id=question_id,
            assessment=assessment,
        )
        answer=request.data.get('answer')
        if answer is None:
            return Response(
                {
                    'error':'answer is required'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not isinstance(answer,str):
            answer=str(answer)
        answer=answer.strip()
        if not answer:
            return Response(
                {
                    'error':'answer cannot be empty'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        assessment_answer,created=AssessmentAnswer.objects.update_or_create(
            assessment=assessment,
            question=question,
            defaults={
                'answer':answer,
            }
        )
        serializer=AssessmentAnswerSerializer(
            assessment_answer
        )
        return Response(
            {
                'message':'answer saved successfully',
                'created':created,
                'answer':serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class SubmitAssessmentView(APIView):
    permission_classes=[IsAuthenticated]
    @transaction.atomic
    def post(self,request,assessment_id):
        assessment=get_object_or_404(
            Assessment.objects.select_related(
                'course',
                'enrollment',
            ),
            id=assessment_id,
            enrollment__user=request.user
        )
        if assessment.status!=Assessment.Status.IN_PROGRESS:
            return Response(
                {
                    'error':'this assessment has already been submitted'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        questions=AssessmentQuestion.objects.filter(
            assessment=assessment
        ).order_by('order')
        if not questions.exists():
            return Response(
                {
                    'error':'this assessment has no questions'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        answers=AssessmentAnswer.objects.filter(
            assessment=assessment
        )
        answer_map={
            answer.question_id:answer
            for answer in answers
        }
        total_score=0
        evaluated_answers=[]
        for question in questions:
            assessment_answer=answer_map.get(question.id)
            if not assessment_answer:
                assessment_answer=AssessmentAnswer.objects.create(
                    assessment=assessment,
                    question=question,
                    answer='',
                    is_correct=False,
                    score=0,
                    feedback='question was not answered'
                )
                evaluated_answers.append(assessment_answer)
                continue
            student_answer=assessment_answer.answer.strip()
            if question.question_type in ['MCQ','TRUE_FALSE',]:
                evaluation=evaluate_objective_answer(question,student_answer)
            elif question.question_type in ['SHORT_ANSWER','CODE']:
                evaluation=evaluate_subjective_answer(question,student_answer)
            else:
                evaluation={
                    'is_correct':False,
                    'score':0,
                    'feedback':'unsupported question type',
                }
            assessment_answer.is_correct=evaluation['is_correct']
            assessment_answer.score=evaluation['score']
            assessment_answer.feedback=evaluation['feedback']
            assessment_answer.save(
                update_fields=[
                    'is_correct',
                    'score',
                    'feedback',
                    'evaluated_at',
                ]
            )
            total_score+=evaluation['score']
            evaluated_answers.append(assessment_answer)
        total_questions=questions.count()
        percentage=(total_score/total_questions)*100
        passed=percentage>=70
        if percentage>=90:
            proficiency_level='EXPERT'
        elif percentage>=75:
            proficiency_level='ADVANCED'
        elif percentage>=60:
            proficiency_level='INTERMEDIATE'
        else:
            proficiency_level='BEGINNER'
        ai_summary=generate_assessment_summary(
            assessment=assessment,
            answers=evaluated_answers,
            percentage=percentage
        )
        result=AssessmentResult.objects.create(
            assessment=assessment,
            score=total_score,
            passed=passed,
            proficiency_level=proficiency_level,
            strengths=ai_summary.get('strengths',''),
            weaknesses=ai_summary.get('weaknesses',''),
            recommendations=ai_summary.get('recommendations',''),
            ai_summary=ai_summary.get('summary',''),
        )
        assessment.score=total_score
        assessment.status=Assessment.Status.COMPLETED
        assessment.completed_at=timezone.now()
        assessment.save(
            update_fields=[
                'score',
                'status',
                'completed_at',
            ]
        )
        return Response(
            {
                'message':'assessment submitted successfully',
                'assessment':{
                    'id':assessment.id,
                    'score':total_score,
                    'total_questions':total_questions,
                    'percentage':percentage,
                    'passed':passed,
                    'status':assessment.status,
                },
                'result':AssessmentResultSerializer(
                    result
                ).data,
            },
            status=status.HTTP_200_OK,
        )

class MentorCourseManagementView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        courses=Course.objects.filter(
            mentor=mentor
        ).prefetch_related(
            'modules__lessons',
            'enrollments',
        ).order_by('-updated_at') 
        total_courses=courses.count()
        published_courses=courses.filter(
            status=Course.Status.PUBLISHED
        ).count()
        draft_courses=courses.filter(
            status=Course.Status.DRAFT
        ).count()      
        total_enrollments=sum(
            course.enrollments.count()
            for course in courses
        )  
        serializer=MentorCourseSerializer(
            courses,
            many=True
        )
        return Response(
            {
                'stats':{
                    'total_courses':total_courses,
                    'published':published_courses,
                    'drafts':draft_courses,
                    'enrollments':total_enrollments,
                    'average_rating':None,
                    'completion_rate':None,
                },
                'courses':serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def post(self,request):
        serializer=MentorCourseCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST,)
        try:
            modules_data=json.loads(request.data.get('modules','[]'))
        except json.JSONDecodeError:
            return Response(
                {
                    'error':'invalid modules data'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not isinstance(modules_data,list):
            return Response(
                {
                    'error':'modules data must be a list'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            with transaction.atomic():
                course=serializer.save(
                mentor=request.user,
                status=Course.Status.DRAFT,
                is_active=True,
            )
                for module_index,module_data in enumerate(modules_data,start=1):
                    module=CourseModule.objects.create(
                    course=course,
                    title=module_data.get('title','').strip(),
                    description=module_data.get('description','').strip(),
                    order=module_index,
                )
                    lessons_data=module_data.get('lessons',[])
                    for lesson_index,lesson_data in enumerate(lessons_data,start=1):
                        CourseLesson.objects.create(
                        module=module,
                        title=lesson_data.get('title','').strip(),
                        content=lesson_data.get('content','').strip(),
                        order=lesson_index,
                    )
                conversation=Conversation.objects.create(
                            conversation_type=Conversation.ConversationType.GROUP,
                            course=course,
                        )
                ConversationMember.objects.create(
                            conversation=conversation,
                            mentor=request.user,
                        )
            return Response(
            MentorCourseDetailSerializer(
                course,
                context={'request':request}
            ).data,
            status=status.HTTP_201_CREATED,
        )
        except Exception as exc:
            return Response(
                {
                    'error':str(exc)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class MentorStudentsView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        enrollments=CourseEnrollment.objects.filter(
            course__mentor=mentor,
            course__is_active=True
        ).select_related('user','course').order_by('-enrolled_at')
        serializer=MentorStudentSerializer(
            enrollments,
            many=True,
            context={'request':request}
        )
        total_students=enrollments.values(
            'user_id'
        ).distinct().count()
        return Response(
            {
                'stats':{
                    'total_students':total_students,
                    'active_now':None,
                    'sessions_this_week':None,
                    'completed':enrollments.filter(
                        completed_at__isnull=False
                    ).values('user_id').distinct().count(),
                    'average_rating':None,
                    'success_rate':None
                },
                'students':serializer.data
            }
        )

class CourseCategoryListView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        categories=CourseCategory.objects.all().order_by('name')
        data=[
            {
                'id':category.id,
                'name':category.name
            } 
            for category in categories
        ]
        return Response(data)

class MentorCourseDetailView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,course_id):
        course=get_object_or_404(
            Course.objects.filter(
                id=course_id,
                mentor=request.user,
            ).select_related('category','mentor').prefetch_related('modules__lessons'),
            id=course_id
        )
        serializer=MentorCourseDetailSerializer(course,context={'request':request})
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class UserCourseDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,course_id):
        course=get_object_or_404(
            Course.objects.select_related(
                'mentor',
                'category'
            ).prefetch_related('modules__lessons'),
            id=course_id,
            status=Course.Status.PUBLISHED,
            is_active=True,
            mentor__is_active=True,
            mentor__is_verified=True,
        )
        enrollment=CourseEnrollment.objects.filter(
            user=request.user,
            course=course,
        ).first()
        is_enrolled=enrollment is not None
        modules=list(
            course.modules.all().order_by('order')
        )
        first_lesson=None
        if modules:
            first_module=modules[0]
            first_lesson=(
                first_module.lessons.all().order_by('order').first()
            )
        module_data=[]
        for module in modules:
            lessons=[]
            for lesson in module.lessons.all().order_by('order'):
                is_first_lesson=(
                    first_lesson is not None
                    and lesson.id==first_lesson.id
                )
                is_unlocked=False
                if is_first_lesson:
                    is_unlocked=True
                elif is_enrolled:
                    lesson_progress=LessonProgress.objects.filter(
                        enrollment=enrollment,
                        lesson=lesson,
                    ).first()
                    if lesson_progress:
                        is_unlocked=lesson_progress.is_unlocked
                lessons.append({
                    'id':lesson.id,
                    'title':lesson.title,
                    'order':lesson.order,
                    'is_unlocked':is_unlocked,
                    'is_preview':is_first_lesson,
                })
            module_data.append({
                'id':module.id,
                'title':module.title,
                'description':module.description,
                'order':module.order,
                'lessons':lessons,
            })
        mentor_image=None
        if course.mentor.profile_image:
            mentor_image=request.build_absolute_uri(
                    course.mentor.profile_image.url
                )
        thumbnail=None
        if course.thumbnail:
                thumbnail=request.build_absolute_uri(
                    course.thumbnail.url
                )
        return Response(
                {
                    'is_enrolled':is_enrolled,
                    'enrollment':(
                        {
                            'id':enrollment.id,
                            'progress':enrollment.progress,
                            'enrolled_at':enrollment.enrolled_at,
                        }
                        if enrollment else None
                    ),
                    'course':{
                        'id':course.id,
                        'title':course.title,
                        'slug':course.slug,
                        'description':course.description,
                        'thumbnail':thumbnail,
                        'category':{
                            'id':course.category.id,
                            'name':course.category.name,
                        },
                        'level':course.level,
                        'price':str(course.price),
                        'estimated_duration':course.estimated_duration,
                        'mentor':{
                            'id':course.mentor.id,
                            'username':course.mentor.username,
                            'profile_image':mentor_image,
                            'rating':str(course.mentor.rating),
                            'total_reviews':course.mentor.total_reviews,
                        },
                        'modules':module_data,
                    },
                },
                status=status.HTTP_200_OK,
            )

class UserLessonDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,course_id,lesson_id):
        print('user lesson view called')
        print('course_id:', course_id)
        print('lesson_id:', lesson_id)
        course=get_object_or_404(
            Course.objects.select_related('mentor'),
            id=course_id,
            status=Course.Status.PUBLISHED,
            is_active=True,
            mentor__is_active=True,
            mentor__is_verified=True,
        )
        print('COURSE:', course)
        print('course status:', course.status)
        print('course active:', course.is_active)
        print('mentor active:', course.mentor.is_active)
        print('mentor verified:', course.mentor.is_verified)
        print(
    'ALL LESSONS FOR COURSE:',
    list(
        CourseLesson.objects.filter(
            module__course=course
        ).values(
            'id',
            'title',
            'module_id',
        )
    )
)
        lesson=get_object_or_404(
            CourseLesson.objects.select_related('module'),
            id=lesson_id,
            module__course=course
        )
        enrollment=CourseEnrollment.objects.filter(
            user=request.user,
            course=course
        ).first()
        first_lesson=CourseLesson.objects.filter(
            module__course=course
        ).order_by('module__order','order').first()
        is_first_lesson=(
            first_lesson and lesson.id==first_lesson.id
        )
        if is_first_lesson:
            pass
        elif not enrollment:
            return Response(
                {
                    'error':'this lesson is locked. enroll in the course to acceess it'
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        else:
            lesson_progress=LessonProgress.objects.filter(
                enrollment=enrollment,
                lesson=lesson
            ).first()
            if not lesson_progress or not lesson_progress.is_unlocked:
                return Response(
                    {
                        'error':'this lesson has not been unlocked yet'
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        serializer=UserLessonSerializer(lesson)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class CourseEnrollView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,course_id):
        course=get_object_or_404(
            Course.objects.select_related('mentor'),
            id=course_id,
            status=Course.Status.PUBLISHED,
            is_active=True,
            mentor__is_active=True,
            mentor__is_verified=True,
        )
        existing_enrollment=CourseEnrollment.objects.filter(
            user=request.user,
            course=course,
        ).first()
        if existing_enrollment:
            return Response(
                {
                    'error':'you are already enrolled in this course',
                    'enrollment_id':existing_enrollment.id,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        enrollment=CourseEnrollment.objects.create(
            user=request.user,
            course=course,
            progress=0,
        )
        return Response(
            {
                'message':'successfully enrolled in the course',
                'enrollment':{
                    'id':enrollment.id,
                    'course_id':course.id,
                    'course_title':course.title,
                    'progress':enrollment.progress,
                    'enrolled_at':enrollment.enrolled_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )

class MentorCourseUpdateView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def patch(self,request,course_id):
        mentor=request.user
        course=get_object_or_404(
            Course,
            id=course_id,
            mentor=mentor,
        )
        if course.status not in [Course.Status.DRAFT,Course.Status.PUBLISHED]:
            return Response({
                'error':'this course cannot be edited while it is under review or archived'
            },status=status.HTTP_400_BAD_REQUEST,)
        data=request.data.copy()
        modules_data=data.get('modules')
        if modules_data is not None:
            if isinstance(modules_data,str):
                try:
                    modules_data=json.loads(modules_data)
                except json.JSONDecodeError:
                    return Response({
                        'error':'invalid modules data'
                    },status=status.HTTP_400_BAD_REQUEST)
            data['modules']=modules_data
        serializer=MentorCourseUpdateSerializer(
            course,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                old_status=course.status
                course=serializer.save()
                if modules_data is not None:
                    CourseModule.objects.filter(course=course).delete()
                    for module_index,module_data in enumerate(modules_data,start=1):
                        module=CourseModule.objects.create(
                            course=course,
                            title=module_data.get('title','').strip(),
                            description=module_data.get('description','').strip(),
                            order=module_index,
                        )
                        lessons_data=module_data.get('lessons',[])
                        for lesson_index,lesson_data in enumerate(lessons_data,start=1):
                            CourseLesson.objects.create(
                                module=module,
                                title=lesson_data.get('title','').strip(),
                                content=lesson_data.get('content','').strip(),
                                order=lesson_index,
                            )
                if old_status==Course.Status.PUBLISHED:
                    course.status=Course.Status.PENDING_REVIEW
                    course.published_at=None
                    course.save(
                        update_fields=[
                            'status',
                            'published_at',
                            'updated_at',
                        ]
                    )
            return Response(
                MentorCourseDetailSerializer(
                    course,
                    context={'request':request}
                ).data,
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {
                    'error':str(exc)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )