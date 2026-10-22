from django.shortcuts import render,get_object_or_404
from django.utils import timezone
from django.db.models import Q
from django.db import transaction

from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import CourseSession,SkillExchangeSession
from apps.courses.models import CourseEnrollment
from apps.accounts.models import User
from apps.skills.models import Skill,UserSkill
from .serializers.course_session import MentorCourseSessionCreateSerializer
from .serializers.session_history import SkillExchangeSessionHistorySerializer,CourseSessionHistorySerializer,MentorCourseSessionHistorySerializer
from .serializers.upcoming_session import UpcomingSkillExchangeSerializer,UpcomingCourseSessionSerializer,MentorUpcomingSessionSerializer
from .serializers.session_request import FriendSessionRequestSerializer,RecievedSessionRequestSerializer
from .serializers.admin import AdminCourseSessionSerializer,AdminSkillExchangeSessionSerializer

from apps.chat.services import create_skill_conversation,create_course_conversation

from apps.accounts.permissions import IsAdmin
from apps.mentors.authentication import MentorJWTAuthentication

class MentorScheduleCourseSessionView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        mentor=request.user
        serializer=MentorCourseSessionCreateSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        enrollment=get_object_or_404(
            CourseEnrollment.objects.select_related(
                'course',
                'user',
            ),
            id=serializer.validated_data['enrollment'].id
        )
        if enrollment.course.mentor_id!=mentor.id:
            return Response(
                {
                    'error':('you cannot schedule a session for'
                             'a course you do not teach')
                },
                status=status.HTTP_403_FORBIDDEN
            )
        scheduled_start=serializer.validated_data['scheduled_start']
        if scheduled_start<=timezone.now():
            return Response(
                {
                    'error':(
                        'session must be scheduled '
                        'for a future time'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        duration=serializer.validated_data['duration_minutes'] 
        scheduled_end=(
            scheduled_start+timezone.timedelta(minutes=duration)
        )
        mentor_conflict=CourseSession.objects.filter(
            mentor=mentor,
            status=CourseSession.Status.SCHEDULED,
            scheduled_start__lt=scheduled_end,
        ).filter(
            scheduled_start__gte=scheduled_start
        ).exists()
        if mentor_conflict:
            return Response(
                {
                    'error':(
                        'you already have a session'
                        'scheduled during this time'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        student_conflict=CourseSession.objects.filter(
            enrollment__user=enrollment.user,
            status=CourseSession.Status.SCHEDULED,
            scheduled_start__lt=scheduled_end
        ).filter(
            scheduled_start__gte=scheduled_start
        ).exists()
        if student_conflict:
            return Response(
                {
                    'error':(
                        'the student already has a session '
                        'scheduled during this time'
                    ),
                },status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            session=serializer.save(
            mentor=mentor,
            status=CourseSession.Status.SCHEDULED,
        )
            conversation=create_course_conversation(session)
        response_serializer=MentorCourseSessionCreateSerializer(
            session
        )
        return Response(
            {
                **response_serializer.data,
                'conversation_id':conversation.id,
            },
                status=status.HTTP_201_CREATED,
        )

class SessionHistoryView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        search=request.query_params.get('search','').strip()
        status_filter=request.query_params.get('status','ALL').upper()
        skill_sessions=(SkillExchangeSession.objects.filter(
            Q(requester=request.user)|
            Q(recipient=request.user)
        ).select_related('requester','recipient','skill_wanted','skill_offered'))
        course_sessions=(CourseSession.objects.filter(
            enrollment__user=request.user
        ).select_related('enrollment','enrollment__course','mentor',))
        if status_filter!='ALL':
            skill_sessions=skill_sessions.filter(
                status=status_filter
            )
            course_sessions=course_sessions.filter(
                status=status_filter
            )
        if search:
            skill_sessions=skill_sessions.filter(
                Q(skill_wanted__name__icontains=search)|
                Q(skill_offered__name__icontains=search)|
                Q(requester__username__icontains=search)|
                Q(recipient__username__icontains=search)
            )
            course_sessions=course_sessions.filter(
                Q(enrollment__course__title__icontains=search)|
                Q(mentor__username__icontains=search)|
                Q(mentor__fullname__icontains=search)
            )
        skill_data=(
                SkillExchangeSessionHistorySerializer(
                    skill_sessions,
                    many=True,
                    context={'request':request}
                ).data
            )
        course_data=(
                CourseSessionHistorySerializer(
                    course_sessions,
                    many=True,
                    context={'request':request}
                ).data
            )
        sessions=skill_data+course_data
        sessions.sort(
                key=lambda session:session['scheduled_start'],
                reverse=True
            )  
        completed_sessions=[
                session for session in sessions if session['status']=='COMPLETED'
            ]
        total_minutes=sum(
                session['duration_minutes'] for session in completed_sessions
            )
        return Response(
                {
                    'stats':{
                        'total_sessions':len(sessions),
                        'completed_sessions':len(completed_sessions),
                        'learning_hours':round(total_minutes/60,1),
                    },
                    'sessions':sessions,
                },
                status=status.HTTP_200_OK,
            )

class UpcomingSessionsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        search=request.query_params.get(
            'search',
            ''
        ).strip()
        session_filter=request.query_params.get(
            'type',
            'ALL',
        ).upper()
        skill_sessions=(SkillExchangeSession.objects.filter(
            Q(requester=request.user)|
            Q(recipient=request.user),
            status=SkillExchangeSession.Status.SCHEDULED,
        )).select_related(
            'requester',
            'recipient',
            'skill_wanted',
            'skill_offered',
        )
        mentor_sessions=(CourseSession.objects.filter(
            enrollment__user=request.user,
            status=CourseSession.Status.SCHEDULED,
        ).select_related(
            'enrollment',
            'enrollment__course',
            'mentor',
        ))
        if search:
            skill_sessions=skill_sessions.filter(
                Q(skill_wanted__name__icontains=search)|
                Q(skill_offered__name__icontains=search)|
                Q(requester__username__icontains=search)|
                Q(recipient__username_icontains=search)
            )
            mentor_sessions=mentor_sessions.filter(
                Q(enrollment__course__title__icontains=search)|
                Q(mentor__username__icontains=search)|
                Q(mentor__full_name__icontains=search)
            )
        if session_filter=='MENTOR':
            skill_sessions=skill_sessions.none()
        if session_filter=='SKILL_EXCHANGE':
            mentor_sessions=mentor_sessions.none()
        skill_data=(
            UpcomingSkillExchangeSerializer(
                skill_sessions,
                many=True,
                context={
                    'request':request,
                }
            ).data
        )
        mentor_data=(
            UpcomingCourseSessionSerializer(
                mentor_sessions,
                many=True,
            ).data
        )
        sessions=(skill_data+mentor_data)
        sessions.sort(
            key=lambda session:session['scheduled_start']
        )
        all_skill_sessions=(
            SkillExchangeSession.objects.filter(
                Q(requester=request.user)|
                Q(recipient=request.user),
                status=SkillExchangeSession.Status.SCHEDULED,
            )
        )
        all_mentor_sessions=(
            CourseSession.objects.filter(
                enrollment__user=request.user,
                status=CourseSession.Status.SCHEDULED,
            )
        )
        all_sessions_count=(
            all_skill_sessions.count()+
            all_mentor_sessions.count()
        )
        all_skill_minutes=sum(
            session.duration_minutes 
            for session in all_skill_sessions
        )
        all_mentor_minutes=sum(
            session.duration_minutes 
            for session in all_mentor_sessions
        )
        total_minutes=(
            all_skill_minutes+
            all_mentor_minutes
        )
        return Response(
            {
                'stats':{
                    'upcoming_sessions':all_sessions_count,
                    'total_hours':round(total_minutes/60,1),
                    'upcoming_user_sessions':all_skill_sessions.count(),
                    'learning_streak':0,
                },
                'sessions':sessions,
            },
            status=status.HTTP_200_OK,
        )

class SessionRequestQueueView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        requests=(SkillExchangeSession.objects.filter(
            recipient=request.user,
            status=SkillExchangeSession.Status.REQUESTED,
        )).select_related('requester','skill_wanted','skill_offered').order_by('scheduled_start')
        serializer=UpcomingSkillExchangeSerializer(
            requests,
            many=True,
            context={
                'request':request
            }
        )
        return Response(
            {
                'requests':serializer.data
            },
            status=status.HTTP_200_OK,
        )

class SessionRequestActionView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,session_id):
        session=get_object_or_404(
            SkillExchangeSession,
            id=session_id,
            recipient=request.user,
            status=SkillExchangeSession.Status.REQUESTED,
        )
        action=request.data.get('action')
        if action=='ACCEPT':
            session.status=(
                SkillExchangeSession.Status.SCHEDULED
            )
            session.accepted_at=timezone.now()
            session.rejection_reason=''
            session.save(
                update_fields=[
                    'status',
                    'accepted_at',
                    'rejection_reason',
                    'updated_at',
                ]
            )
            conversation=create_skill_conversation(session)
            return Response(
                {
                    'message':'session request accepted',
                    'session':UpcomingSkillExchangeSerializer(
                        session,
                        context={
                            'request':request,
                        }
                    ).data,
                    'conversation_id':conversation.id,
                },
                status=status.HTTP_200_OK,
            )
        if action=='REJECT':
            reason=request.data.get(
                'reason',
                ''
            ).strip()
            session.status=(SkillExchangeSession.Status.REJECTED)
            session.rejection_reason=reason
            session.save(
                update_fields=[
                    'status',
                    'rejection_reason',
                    'updated_at',
                ]
            )
            return Response(
                {
                    'message':'session request rejected'
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                'error':'invalid action',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class MentorUpcomingSessionsView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        now=timezone.now()
        search=request.query_params.get('search','').strip()
        date_filter=request.query_params.get('date','ALL').upper()
        sort=request.query_params.get('sort','EARLIEST').upper()
        sessions=(
            CourseSession.objects.filter(
                mentor=mentor,
                status=CourseSession.Status.SCHEDULED,
                scheduled_start__gte=now,
            ).select_related('enrollment','enrollment__user','enrollment__course',)
        )
        if search:
            sessions=sessions.filter(
                Q(
                    enrollment__course__title__icontains=search
                )
                |
                Q(
                    enrollment__user__username__icontains=search
                )
                |
                Q(
                    enrollment__user__first_name__icontains=search
                )
                |
                Q(
                    enrollment_user__last_name__icontains=search
                )
            )
        if date_filter=='THIS WEEK':
            today=timezone.localdate()
            week_start=today-timedelta(
                days=today.weekday()
            )
            week_end=(
                week_start+timedelta(days=6)
            )
            sessions=sessions.filter(
                scheduled_start__date__gte=week_start,
                scheduled_start__date__lte=week_end
            )
        elif date_filter=='THIS MONTH':
            today=timezone.localdate()
            sessions=sessions.filter(
                scheduled_start__year=today.year,
                scheduled_start__month=today.month
            )
        if sort=='LATEST':
            sessions=sessions.order_by(
                '-scheduled_start'
            )
        elif sort=='TOPIC':
            sessions=sessions.order_by(
                'enrollment__course__title'
            )
        else:
            sessions=sessions.order_by(
                'scheduled_start'
            )
        serializer=MentorUpcomingSessionSerializer(
            sessions,
            many=True,
        )
        all_sessions=CourseSession.objects.filter(
            mentor=mentor
        )  
        completed_sessions=CourseSession.objects.filter(
            status=CourseSession.Status.COMPLETED
        )
        total_minutes=sum(
            completed_sessions.values_list(
                'duration_minutes',
                flat=True,
            )
        )
        today=timezone.localdate()
        week_start=today-timedelta(
            days=today.weekday()
        )
        week_end=(
            week_start+timedelta(days=6)
        )
        this_week=CourseSession.objects.filter(
            mentor=mentor,
            status=CourseSession.Status.SCHEDULED,
            scheduled_start__date__gte=week_start,
            scheduled_start__date__lte=week_end,
        ).count()
        today_count=CourseSession.objects.filter(
            mentor=mentor,
            status=CourseSession.Status.SCHEDULED,
            scheduled_start__date=today,
        ).count()
        return Response(
            {
                'stats':{
                    'total_sessions':all_sessions.count(),
                    'completed_sessions':completed_sessions.count(),
                    'total_hours':round(total_minutes/60,1),
                    'this_week':this_week,
                    'today':today_count,
                },
                'sessions':serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class MentorCancelSessionView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self,request,session_id):
        session=get_object_or_404(
            CourseSession,
            id=session_id,
            mentor=request.user,
            status=CourseSession.Status.SCHEDULED,
        )
        session.status=(CourseSession.Status.CANCELLED)
        session.cancellation_reason=(request.data.get('cancellation_reason',''))
        session.cancelled_at=timezone.now()
        session.save(
            update_fields=[
                'status',
                'cancellation_reason',
                'cancelled_at',
                'updated_at',
            ]
        )
        return Response(
            {
                'message':'course session cancelled',
                'status':session.status,
            },status=status.HTTP_200_OK,
        )

class SessionRequestSkillOptionsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,recipient_id):
        recipient=get_object_or_404(
            User,
            id=recipient_id
        )
        requester=request.user
        requester_wanted_ids = set(
            UserSkill.objects.filter(
                user=requester,
                skill_type=UserSkill.SkillType.WANT,
                skill__is_active=True,
            ).values_list(
                'skill_id',
                flat=True
            )
        )

        requester_offered_ids = set(
            UserSkill.objects.filter(
                user=requester,
                skill_type=UserSkill.SkillType.OFFER,
                skill__is_active=True,
            ).values_list(
                'skill_id',
                flat=True
            )
        )

        recipient_wanted_ids = set(
            UserSkill.objects.filter(
                user=recipient,
                skill_type=UserSkill.SkillType.WANT,
                skill__is_active=True,
            ).values_list(
                'skill_id',
                flat=True
            )
        )

        recipient_offered_ids = set(
            UserSkill.objects.filter(
                user=recipient,
                skill_type=UserSkill.SkillType.OFFER,
                skill__is_active=True,
            ).values_list(
                'skill_id',
                flat=True
            )
        )

        
        skills_to_learn_ids = (
            requester_wanted_ids &
            recipient_offered_ids
        )

        
        skills_to_offer_ids = (
            requester_offered_ids &
            recipient_wanted_ids
        )

        skills_to_learn = Skill.objects.filter(
            id__in=skills_to_learn_ids,
            is_active=True,
        ).order_by('name')

        skills_to_offer = Skill.objects.filter(
            id__in=skills_to_offer_ids,
            is_active=True,
        ).order_by('name')
        return Response({
            'skills_to_learn':[
                {
                    'id':skill.id,
                    'name':skill.name
                }
                for skill in skills_to_learn
            ],
            'skills_to_offer':[
                {
                    'id':skill.id,
                    'name':skill.name
                }
                for skill in skills_to_offer
            ]
        })

class SendSessionRequestView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=FriendSessionRequestSerializer(
            data=request.data,
            context={'request':request}
        )
        serializer.is_valid(raise_exception=True)
        session=serializer.save(
            requester=request.user,
            status=SkillExchangeSession.Status.REQUESTED,
        )
        return Response(
            FriendSessionRequestSerializer(
                session,
                context={'request':request}
            ).data,
            status=status.HTTP_201_CREATED,
        )

class ReceivedSessionRequestsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        requests=SkillExchangeSession.objects.filter(
            recipient=request.user,
            status=SkillExchangeSession.Status.REQUESTED,
        ).select_related(
            'requester',
            'skill_wanted',
            'skill_offered',
        )
        serializer=RecievedSessionRequestSerializer(
            requests,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AcceptSessionRequestView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,session_id):
        try:
            session=SkillExchangeSession.objects.get(
                id=session_id,
                recipient=request.user,
                status=SkillExchangeSession.Status.REQUESTED,
            )
        except SkillExchangeSession.DoesNotExist:
            return Response(
                {
                    'detail':'session request not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        session.status=SkillExchangeSession.Status.SCHEDULED
        session.accepted_at=timezone.now()
        session.save(
            update_fields=[
                'status',
                'accepted_at',
                'updated_at',
            ]
        )
        return Response(
            {
                'detail':'session request accepted',
                'session_id':session.id,
                'status':session.status,
            },
            status=status.HTTP_200_OK,
        )

class RejectSessionRequestView(APIView):
    permission_classes=[IsAuthenticated]  
    def post(self,request,session_id):
        try:
            session=SkillExchangeSession.objects.get(
                id=session_id,
                recipient=request.user,
                status=SkillExchangeSession.Status.REQUESTED,
            )
        except SkillExchangeSession.DoesNotExist:
            return Response(
                {
                    'detail':'session request not found'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        rejection_reason=request.data.get('rejection_reason')
        session.status=SkillExchangeSession.Status.REJECTED
        session.rejection_reason=rejection_reason
        session.save(
            update_fields=[
                'status',
                'rejection_reason',
                'updated_at',
            ]
        )
        return Response(
            {
                'detail':'session request rejected',
                'session_id':session.id,
                'status':session.status,
            },
            status=status.HTTP_200_OK
        )

class MentorCourseSessionHistoryView(APIView):
    authentication_classes=[MentorJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        mentor=request.user
        sessions=(CourseSession.objects.filter(
            mentor=mentor
        ).select_related(
            'mentor',
            'enrollment',
            'enrollment__user',
            'enrollment__course'
        ).order_by('-scheduled_start'))
        serializer=MentorCourseSessionHistorySerializer(
            sessions,
            many=True,
            context={'request':request}
        )
        return Response(
            {
                'sessions':serializer.data,
                'total_sessions':sessions.count()
            },
            status=status.HTTP_200_OK,
        )

class AdminSessionManagementView(APIView):
    permission_classes=[IsAdmin]
    def get(self,request):
        now=timezone.now()
        tab=request.query_params.get('tab','ALL')
        session_type=request.query_params.get('session_type','ALL')
        status_filter=request.query_params.get('status')
        search=request.query_params.get('search','').strip()
        sessions=[]
        if session_type in ['ALL','SKILL_EXCHANGE']:
            skill_sessions=SkillExchangeSession.objects.select_related(
                'requester',
                'recipient',
                'skill_wanted',
                'skill_offered',
            )
            if tab=='UPCOMING':
                upcoming_ids=[]
                for session in skill_sessions:
                    if (session.status==SkillExchangeSession.Status.SCHEDULED and session.scheduled_start>now):
                        upcoming_ids.append(session.id)
                skill_sessions=skill_sessions.filter(
                    id__in=upcoming_ids
                )
            elif tab=='ONGOING':
                ongoing_ids=[]
                for session in skill_sessions:
                    if session.status!=SkillExchangeSession.Status.SCHEDULED:
                        continue
                    end_time=(session.scheduled_start+timedelta(minutes=session.duration_minutes))
                    if (session.scheduled_start<=now and now<end_time):
                        ongoing_ids.append(session.id)
                skill_sessions=skill_sessions.filter(
                    id__in=ongoing_ids
                )
            elif tab == 'COMPLETED':

                skill_sessions = skill_sessions.filter(
        status=SkillExchangeSession.Status.COMPLETED
    )


            elif tab == 'CANCELLED':

                skill_sessions = skill_sessions.filter(
        status=SkillExchangeSession.Status.CANCELLED
    )


            elif tab == 'REJECTED':

                skill_sessions = skill_sessions.filter(
        status=SkillExchangeSession.Status.REJECTED
    )


            elif tab == 'EXPIRED':

                skill_sessions = skill_sessions.filter(
        status=SkillExchangeSession.Status.EXPIRED
    )

            if status_filter and tab=='ALL':
                skill_sessions=skill_sessions.filter(
                status=status_filter
            )
            if search:
                skill_sessions=skill_sessions.filter(
                Q(requester__full_name__icontains=search)|
                Q(requester__username__icontains=search)|
                Q(recipient__full_name__icontains=search)|
                Q(recipient__username__icontains=search)|
                Q(skill_wanted__name__icontains=search)|
                Q(skill_offered__name__icontains=search)
            )
            serializer=AdminSkillExchangeSessionSerializer(
            skill_sessions,
            many=True,
            context={'request':request},
        )
            sessions.extend(serializer.data)
        if session_type in ['ALL','COURSE']:
            course_sessions=(
                CourseSession.objects.select_related(
                    'mentor',
                    'enrollment',
                    'enrollment__user',
                    'enrollment__course',
                )
            )
            if tab == 'UPCOMING':

                upcoming_ids = []

                for session in course_sessions:

                    if (
            session.status == CourseSession.Status.SCHEDULED
            and session.scheduled_start > now
        ):
                        upcoming_ids.append(session.id)

                course_sessions = course_sessions.filter(
        id__in=upcoming_ids
    )


            elif tab == 'ONGOING':

                ongoing_ids = []

                for session in course_sessions:

                    if session.status != CourseSession.Status.SCHEDULED:
                        continue

                    end_time = (
            session.scheduled_start
            + timedelta(minutes=session.duration_minutes)
        )

                    if (
            session.scheduled_start <= now
            and now < end_time
        ):
                        ongoing_ids.append(session.id)

                course_sessions = course_sessions.filter(
        id__in=ongoing_ids
    )


            elif tab == 'COMPLETED':

                course_sessions = course_sessions.filter(
        status=CourseSession.Status.COMPLETED
    )


            elif tab == 'CANCELLED':

                course_sessions = course_sessions.filter(
        status=CourseSession.Status.CANCELLED
    )


            elif tab == 'REJECTED':

    
                course_sessions = course_sessions.none()


            elif tab == 'EXPIRED':

                course_sessions = course_sessions.filter(
        status=CourseSession.Status.EXPIRED
    )
            if status_filter and tab=='ALL':
                course_sessions=course_sessions.filter(
                    status=status_filter
                )
            if search:
                course_sessions=course_sessions.filter(
                    Q(mentor__username__icontains=search)|
                    Q(mentor__full_name__icontains=search)|
                    Q(enrollment__user__username__icontains=search)|
                    Q(enrollment__user__full_name__icontains=search)|
                    Q(enrollment__course__title__icontains=search)
                )
            serializer=AdminCourseSessionSerializer(
                course_sessions,
                many=True,
                context={'request':request},
            )
            sessions.extend(serializer.data)
        sessions.sort(
            key=lambda x:x.get('scheduled_start') or '',
            reverse=True,
        )
        skill_queryset=SkillExchangeSession.objects.all()
        course_queryset=CourseSession.objects.all()
        total_sessions=(
            skill_queryset.count()+
            course_queryset.count()
        )
        completed=(
            skill_queryset.filter(
                status=SkillExchangeSession.Status.COMPLETED
            ).count()+
            course_queryset.filter(
                status=CourseSession.Status.COMPLETED
            ).count()
        )
        cancelled=(
            skill_queryset.filter(
                status=SkillExchangeSession.Status.CANCELLED
            ).count()+
            course_queryset.filter(
                status=CourseSession.Status.CANCELLED
            ).count()
        )
        rejected=skill_queryset.filter(
            status=SkillExchangeSession.Status.REJECTED
        ).count()
        expired=(
            skill_queryset.filter(
                status=SkillExchangeSession.Status.EXPIRED
            ).count()+
            course_queryset.filter(
                status=CourseSession.Status.EXPIRED
            ).count()
        )
        scheduled=(
                    skill_queryset.filter(
                        status=SkillExchangeSession.Status.SCHEDULED
                    ).count()+
                    course_queryset.filter(
                        status=CourseSession.Status.SCHEDULED
                    ).count()
                )
        ongoing_skill=0
        upcoming_skill=0
        skill_sessions=skill_queryset.filter(
            status=SkillExchangeSession.Status.SCHEDULED,
        )
        for session in skill_sessions:
            end_time=(session.scheduled_start+timedelta(minutes=session.duration_minutes))
            if session.scheduled_start<=now<end_time:
                ongoing_skill+=1
            elif now<session.scheduled_start:
                upcoming_skill+=1
        ongoing_course=0
        upcoming_course=0
        course_sessions=course_queryset.filter(
            status=CourseSession.Status.SCHEDULED,
        )
        for session in course_sessions:
            end_time=(session.scheduled_start+timedelta(minutes=session.duration_minutes))
            if session.scheduled_start<=now<end_time:
                ongoing_course+=1
            elif now<session.scheduled_start:
                upcoming_course+=1
        ongoing=ongoing_skill+ongoing_course
        upcoming=upcoming_skill+upcoming_course
        skill_duration=list(
            skill_queryset.values_list(
                'duration_minutes',
                flat=True,
            )
        )
        course_duration=list(
            course_queryset.values_list(
                'duration_minutes',
                flat=True
            )
        )
        durations=skill_duration+course_duration
        average_duration=(
            round(sum(durations)/len(durations),1)
            if durations else 0
        )
        completion_total=(
            completed+cancelled+rejected+expired
        )
        def percentage(value):
            if completion_total==0:
                return 0
            return round((value/completion_total)*100,1)
        completion_trends={
            'completed':{
                'count':completed,
                'percentage':percentage(completed),
            },
            'cancelled':{
                            'count':cancelled,
                            'percentage':percentage(cancelled),
                        },
            'rejected':{
                            'count':rejected,
                            'percentage':percentage(rejected),
                        },
            'expired':{
                                        'count':expired,
                                        'percentage':percentage(expired),
                                    },
        }
        return Response(
            {
                'stats':{
                    'total_sessions':total_sessions,
                    'upcoming':upcoming,
                    'ongoing':ongoing,
                    'completed':completed,
                    'cancelled':cancelled,
                    'rejected':rejected,
                    'expired':expired,
                    'average_duration':average_duration,
                    'average_rating':None,
                },
                'completion_trends':completion_trends,
                'sessions':sessions,
            },
            status=status.HTTP_200_OK,
        )

class AdminSessionActionView(APIView):
    permission_classes=[IsAdmin]
    @transaction.atomic
    def post(self,request,session_type,session_id):
        action=request.data.get('action','').upper().strip()
        if session_type=='SKILL_EXCHANGE':
            session=get_object_or_404(
                SkillExchangeSession,
                id=session_id,
            )
        elif session_type=='COURSE':
            session=get_object_or_404(
                CourseSession,
                id=session_id,
            )
        else:
            return Response(
                {
                    'detail':'invalid session type'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if action=='CANCEL':
            if session.status!='SCHEDULED':
                return Response(
                    {
                        'detail':('only scheduled sessions can be cancelled')
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            reason=request.data.get('reason','session cancelled by administrator').strip()
            session.status='CANCELLED'
            session.cancelled_at=timezone.now()
            session.cancellation_reason=reason
            session.save(
                update_fields=[
                    'status',
                    'cancelled_at',
                    'cancellation_reason',
                    'updated_at',
                ]
            )
            return Response(
                {
                    'message':'session cancelled successfully',
                    'session_id':session.id,
                    'status':session.status,
                },
                status=status.HTTP_200_OK,
            )
        if action=='RESCHEDULE':
            if session.status!='SCHEDULED':
                return Response(
                    {
                        'detail':('only scheuduled sessions can be rescheduled')
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            new_start=request.data.get('scheduled_start')
            if not new_start:
                return Response(
                    {
                        'detail':'scheduled start is required'
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            from django.utils.dateparse import parse_datetime
            new_start=parse_datetime(new_start)
            if not new_start:
                return Response(
                    {
                        'detail':('invalid scheduled_start format')
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            session.scheduled_start=new_start
            session.save(
                update_fields=[
                    'scheduled_start',
                    'updated_at',
                ]
            )
            return Response(
                {
                    'message':'session rescheduled successfully',
                    'session_id':session.id,
                    'scheduled_start':session.scheduled_start,
                    'status':session.status,
                },
                status=status.HTTP_200_OK,
            )
        if action=='COMPLETE':
            if session.status!='SCHEDULED':
                return Response(
                    {
                        'detail':('only scheduled sessions can be marked as completed')
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            session.status='COMPLETED'
            if isinstance(session,CourseSession):
                session.completed_at=timezone.now()
                session.save(
                    update_fields=[
                        'status',
                        'completed_at',
                        'updated_at',
                    ]
                )
            else:
                session.save(
                    update_fields=[
                        'status',
                        'updated_at',
                    ]
                )
            return Response(
                {
                    'message':'session marked as completed',
                    'session_id':session.id,
                    'status':session.status,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                'detail':'invalid action'
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
