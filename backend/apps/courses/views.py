from django.shortcuts import render,get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from .models import Course,CourseEnrollment,Assessment,CourseCategory,CourseModule,CourseLesson
from .serializers.course import CourseListSerializer
from .serializers.mentor_course import MentorCourseSerializer,MentorCourseCreateSerializer,MentorCourseDetailSerializer,MentorCourseUpdateSerializer
from apps.mentors.authentication import MentorJWTAuthentication
from apps.chat.models import Conversation,ConversationMember
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .services.assessment_service import generate_assessment_questions 
import json
from django.db import transaction

from .serializers.assessment import AssessmentSerializer
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
        module_data=[]
        if is_enrolled:
            for module in modules:
                lessons=[]
                for lesson in module.lessons.all().order_by('order'):
                    lessons.append({
                        'id':lesson.id,
                        'title':lesson.title,
                        'content':lesson.content,
                        'order':lesson.order
                    })
                module_data.append({
                    'id':module.id,
                    'title':module.title,
                    'description':module.description,
                    'order':module.order,
                    'lessons':lessons
                })
        else:
            if modules:
                first_module=modules[0]
                lessons=list(
                    first_module.lessons.all().order_by('order')
                )
                if lessons:
                    first_lesson=lessons[0]
                    module_data.append({
                        'id':first_module.id,
                        'title':first_module.title,
                        'description':first_module.description,
                        'order':first_module.order,
                        'lessons':[
                            {
                                'id':first_lesson.id,
                                'title':first_lesson.title,
                                'order':first_lesson.order,
                            }
                        ]
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