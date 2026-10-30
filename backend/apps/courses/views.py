from django.shortcuts import render,get_object_or_404
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from .models import Course,CourseEnrollment,Assessment,CourseCategory,CourseModule,CourseLesson,AssessmentQuestion,AssessmentAnswer,AssessmentResult,LessonProgress
from .serializers.course import CourseListSerializer,UserLessonSerializer
from .serializers.mentor_course import MentorCourseSerializer,MentorCourseCreateSerializer,MentorCourseDetailSerializer,MentorCourseUpdateSerializer
from .serializers.mentor_student import MentorEnrollmentProfileSerializer
from apps.badges.services import BadgeService      
from apps.certificates.models import Certificate
from apps.mentors.authentication import MentorJWTAuthentication
from apps.chat.models import Conversation,ConversationMember
from apps.mentors.models import Mentor
from apps.certificates.services import generate_certificate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .services.course_progress import update_enrollment_progress
from .services.assessment_service import generate_assessment_questions,evaluate_objective_answer,evaluate_subjective_answer,generate_assessment_summary
import json
from django.db import transaction

from .serializers.assessment import AssessmentSerializer,AssessmentAnswerSerializer,AssessmentResultSerializer,AssessmentResultDetailSerializer
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
        total_lessons=CourseLesson.objects.filter(
            module__course=course
        ).count()
        unlocked_lessons=LessonProgress.objects.filter(
            enrollment=enrollment,
            lesson__module__course=course,
            is_unlocked=True,
        ).count()
        if total_lessons==0 or unlocked_lessons!=total_lessons:
            return Response(
                {
                    'error':'you must unlock all lessons before starting the assessment'
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
            if not existing_assessment.deadline:
                now=timezone.now()
                if not existing_assessment.started_at:
                    existing_assessment.started_at=now
                existing_assessment.deadline=(
                    existing_assessment.started_at+
                    timedelta(seconds=existing_assessment.duration_seconds)
                )
                existing_assessment.save(
                    update_fields=['started_at','deadline']
                )
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
                started_at=timezone.now()
                assessment.started_at=started_at
                assessment.deadline=(
                    started_at+
                    timedelta(seconds=assessment.duration_seconds)
                )
                assessment.save(update_fields=['started_at','deadline'])
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
        if assessment.deadline and timezone.now()>=assessment.deadline:
            return Response(
                {
                    'error':'time is up. you can no longer change your answers',
                    'expired':True
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
        student=assessment.enrollment.user
        if student is None:
            return Response(
                {
                    'error':'The assessment enrollment has no associated user'
                },
                status=400
            )
        if assessment.status!=Assessment.Status.IN_PROGRESS:
            return Response(
                {
                    'error':'this assessment has already been submitted'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        now=timezone.now()
        time_expired=(
            assessment.deadline is not None
            and now>=assessment.deadline
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
        submitted_answers=request.data.get('answers',[])
        if not isinstance(submitted_answers,list):
            return Response(
                {
                    'error':'answers must be a list'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not time_expired:
            for item in submitted_answers:
                question_id=item.get('question_id')
                answer_text=item.get('answer','')
                if question_id is None:
                    continue
                question=get_object_or_404(
                AssessmentQuestion,
                id=question_id,
                assessment=assessment
            )
                if answer_text is None:
                    answer_text=''
                answer_text=str(answer_text).strip()
                AssessmentAnswer.objects.update_or_create(
                question=question,
                user=student,
                defaults={
                    'answer':answer_text,
                },
            )
        answers=AssessmentAnswer.objects.filter(
            question__assessment=assessment,
            user=student,
        )
        print("\n========== STORED ANSWERS ==========")
        print("NUMBER OF ANSWERS:", answers.count())

        for answer in answers:
            print(
        "QUESTION:",
        answer.question_id,
        "| ANSWER:",
        repr(answer.answer)
    )

        print("====================================\n")
        answer_map={
            answer.question_id:answer
            for answer in answers
        }
        total_score=0
        evaluated_answers=[]
        print("REQUEST USER:", request.user)
        print("REQUEST USER ID:", request.user.id if request.user else None)
        print("IS AUTHENTICATED:", request.user.is_authenticated if request.user else None)
        for question in questions:
            assessment_answer=answer_map.get(question.id)
            if not assessment_answer:
                assessment_answer=AssessmentAnswer.objects.create(
                    question=question,
                    user=student,
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
        print("\n========== ASSESSMENT RESULT ==========")

        print(f"Score: {total_score}")
        print(f"Percentage: {percentage:.2f}%")
        print(f"Passed: {passed}")
        print(f"Proficiency Level: {proficiency_level}")

        print("\n========== AI SUMMARY ==========")

        print("Summary:")
        print(ai_summary.get('summary', ''))

        print("\nStrengths:")
        print(ai_summary.get('strengths', ''))

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
        BadgeService.evaluate_user(request.user)
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
        updated_progress=update_enrollment_progress(
            assessment.enrollment
        )
        certificate=None
        if result.passed:
            certificate=generate_certificate(assessment)
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
                'progress':updated_progress,
                'certificate':(
                    {
                        'certificate_id':certificate.certificate_id,
                        'certificate_url':(
                            f'/certificates/{certificate.certificate_id}/'
                        ),
                        'certificate_number':certificate.certificate_number,
                    }
                    if certificate else None
                )
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
        all_lessons=CourseLesson.objects.filter(
            module__course=course
        )
        total_lessons=all_lessons.count()
        unlocked_lessons=0
        if (is_enrolled and total_lessons>0):
            unlocked_lessons=LessonProgress.objects.filter(
                enrollment=enrollment,
                lesson__module__course=course,
                is_unlocked=True,
            ).count()          
            first_module=course.modules.order_by('order').first()
            first_lesson=(
                first_module.lessons.order_by('order').first() if first_module else None
            )
            if first_lesson:
                first_lesson_progress=LessonProgress.objects.filter(
                    enrollment=enrollment,
                    lesson=first_lesson,
                    is_unlocked=True,
                ).exists()       
                if not first_lesson_progress:
                    unlocked_lessons+=1
        all_lessons_unlocked=(
            is_enrolled 
            and total_lessons>0
            and total_lessons==unlocked_lessons
        )
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
                    'all_lessons_unlocked':all_lessons_unlocked,
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

class MentorCourseSubmitReviewView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,course_id):
        course=get_object_or_404(
            Course,
            id=course_id,
            mentor__user=request.user,
        )
        if course.status!=Course.Status.DRAFT:
            return Response(
                {
                    'error':('only draft courses can be submitted for review')
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        course.status=Course.Status.PENDING_REVIEW
        course.save(
            update_fields=[
                'status',
                'updated_at',
            ]
        )
        return Response(
            {
                'message':('course submitted for review successfully'),
                'course':{
                    'id':course.id,
                    'status':course.status,
                },
            },
            status=status.HTTP_200_OK,
        )

class AssessmentResultDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,assessment_id):
        assessment=get_object_or_404(
            Assessment.objects.select_related(
                'course',
                'enrollment',
                'result',
            ).prefetch_related('questions__answers'),
            id=assessment_id,
            enrollment__user=request.user,
            status=Assessment.Status.COMPLETED,
        )
        serializer=AssessmentResultDetailSerializer(
            assessment,
            context={'request':request}
        )
        data=serializer.data
        certificate=None
        if assessment.result.passed:
            certificate=Certificate.objects.filter(
                assessment=assessment,
                user=request.user,
            ).first()
        data['certificate']=None       
        if certificate:
            data['certificate']=(
            {
                'certificate_id':certificate.certificate_id,
                'certificate_url':(
                    f'/certificates/{certificate.certificate_id}/'
                ),
                'certificate_number':certificate.certificate_number,
            }
            if certificate else None
        )
        return Response(
            data,
            status=status.HTTP_200_OK,
        )

class MentorUnlockLessonView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request,course_id,enrollment_id,lesson_id):
        try:     
            mentor=request.user     
        except Mentor.DoesNotExist:
            return Response(
                {
                    'detail':'mentor account not found'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        course=get_object_or_404(
            Course,
            id=course_id,
            mentor=mentor 
        )
        enrollment=get_object_or_404(
            CourseEnrollment,
            id=enrollment_id,
            course=course,
        )
        lesson=get_object_or_404(
            CourseLesson.objects.select_related('module'),
            id=lesson_id,
            module__course=course
        )
        progress,created=LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson,
            defaults={
                'is_unlocked':True,
                'unlocked_at':timezone.now()
            }
        )
        if not progress.is_unlocked:
            progress.is_unlocked=True
            progress.unlocked_at=timezone.now()
            progress.save(
                update_fields=['is_unlocked','unlocked_at']
            )
        updated_progress=update_enrollment_progress(enrollment)
        return Response(
            {
                'message':'lesson unlocked successfully',
                'course_id':course.id,
                'enrollment_id':enrollment.id,
                'module_id':lesson.module_id,
                'lesson_id':lesson.id,
                'lesson_title':lesson.title,
                'is_unlocked':progress.is_unlocked,
                'is_completed':progress.is_completed,
                'unlocked_at':progress.unlocked_at, 
                'progress':updated_progress,
            },
            status=status.HTTP_200_OK,
        )

class MentorEnrollmentProfileView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,enrollment_id):
        mentor=request.user
        selected_enrollment=get_object_or_404(
            CourseEnrollment.objects.select_related(
                'user',
                'course',
                'course__mentor',
                'course__category'
            ).prefetch_related('course__modules__lessons'),
            id=enrollment_id,
            course__mentor=mentor,
            course__is_active=True,
        )
        enrollments=(
            CourseEnrollment.objects.filter(
                user=selected_enrollment.user,
                course__mentor=mentor,
                course__is_active=True,
            ).select_related(
                'user',
                'course',
                'course__mentor',
                'course__category',
            ).prefetch_related(
                'course__modules__lessons',
                'lesson_progress__lesson'
            ).order_by(
                '-enrolled_at'
            )
        )
        serializer=MentorEnrollmentProfileSerializer(
            enrollments,
            many=True,
            context={'request':request}
        )
        serialized_enrollments=serializer.data
        student=serialized_enrollments[0]['student']
        courses=[]
        for item in serialized_enrollments:
            courses.append({
                'enrollment_id':item['id'],
                'enrollment':{
                    'id':item['id'],
                    'enrolled_at':item['enrolled_at'],
                    'completed_at':item['completed_at'],
                    'progress':item['progress'],
                },
                'course':item['course'],
                'modules':item['modules']
            })
        return Response(
            {
                'student':student,
                'courses':courses,
            }
        )