import json

from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async

from apps.mentors.models import Mentor
from apps.accounts.models import User
from apps.chat.models import Conversation,ConversationMember
from apps.sessions_mgmt.services.attendance import start_attendance,stop_attendance

from channels.generic.websocket import AsyncWebsocketConsumer

class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name=self.scope['url_route']['kwargs']['room_name']
        self.conversation_id=self.scope['url_route']['kwargs']['conversation_id']
        user=self.scope.get('user')
        account_type=self.scope.get('account_type')
        print("\n--- VIDEO WEBSOCKET CONNECT ---")
        print("Room:", self.room_name)
        print("Conversation ID:", self.conversation_id)
        print("User:", user)
        print("User class:", type(user))
        print("Is anonymous:", getattr(user, "is_anonymous", None))
        print("Account type:", account_type)
        if not user or isinstance(user,AnonymousUser):
            print("VIDEO REJECTED: anonymous user")
            await self.close(code=4001)
            return
        if account_type not in ('USER','MENTOR'):
            if isinstance(user,Mentor):
                account_type='MENTOR'
            elif isinstance(user,User):
                account_type='USER'
            else:
                print("VIDEO REJECTED: unrecognized user class")
                await self.close(code=4001)
                return
        self.account_type=account_type
        self.participant_id=user.id
        print("Resolved account type:", self.account_type)
        print("Participant ID:", self.participant_id)
        is_authorized=await self.check_video_access(
            self.conversation_id,
            self.participant_id,
            self.account_type,
        )
        print("Video access authorized:", is_authorized)
        if not is_authorized:
            print("VIDEO REJECTED: check_video_access returned False")
            await self.close(code=4003)
            return
        self.attendance_started=False
        try:
            (
                self.session_type,
                self.session_id,
            )=await self.start_session_attendance(
                self.conversation_id,
                self.participant_id,
                self.account_type,
            )
            self.attendance_started=True
        except Exception:
            import traceback
            traceback.print_exc()
            print("VIDEO REJECTED: attendance initialization failed")
            await self.close(code=1011)
            return
        self.room_group_name=(f'video_conversation_{self.conversation_id}')
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        print("VIDEO WEBSOCKET ACCEPTED:", self.room_group_name)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'peer_joined',
                'channel_name':self.channel_name,
            }
        )
    async def disconnect(self,close_code):   
        try:
            if getattr(self,'attendance_started',False):
                try:
                    await self.stop_session_attendance(
                        self.session_type,
                        self.session_id,
                        self.participant_id,
                        self.account_type,
                    )  
                finally:
                    self.attendance_started=False
        finally:
            if hasattr(self,'room_group_name'):
                await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'peer_left',
                    'channel_name':self.channel_name,
                }
            )
                await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )
    async def receive(self,text_data):
        try:
            data=json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error':'invalid json'
            }))
            return
        if not isinstance(data,dict):
            await self.send(text_data=json.dumps({
                'error':'message must be a json object'
            }))  
            return
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'signal_message',
                'data':data,
                'sender_channel_name':self.channel_name,
            }
        )
    async def peer_joined(self,event):
        if event['channel_name']==self.channel_name:
            return
        await self.send(
            text_data=json.dumps({
                'type':'peer-ready'
            })
        )
    async def signal_message(self,event):
        if event.get('sender_channel_name')==self.channel_name:
            return
        await self.send(
            text_data=json.dumps(
                event['data']
            )
        )
    async def peer_left(self,event):
        if event.get('channel_name')==self.channel_name:
            return
        await self.send(
            text_data=json.dumps({
                'type':'peer_left'
            })
        )
    @database_sync_to_async
    def check_video_access(self,conversation_id,participant_id,account_type):
        try:
            conversation=Conversation.objects.select_related(
                'skill_exchange_session',
                'course_session',
                'course_session__enrollment',
            ).get(id=conversation_id)
        except Conversation.DoesNotExist:
            return False
        membership_filters={
            'conversation_id':conversation_id,
            'is_active':True,
        }
        if account_type=='MENTOR':
            membership_filters['mentor_id']=participant_id
        else:
            membership_filters['user_id']=participant_id
        if not ConversationMember.objects.filter(
            **membership_filters
        ).exists():
            return False
        skill_session=conversation.skill_exchange_session
        course_session=conversation.course_session
        if (skill_session is None)==(course_session is None):
            return False
        if skill_session is not None:
            if account_type!='USER':
                return False         
            return (
            skill_session.status==skill_session.Status.SCHEDULED and 
            participant_id in (
                skill_session.requester_id,
                skill_session.recipient_id,
            )
        )
        if course_session is not None:
            if account_type=='MENTOR':
                return (
                    course_session.status==course_session.Status.SCHEDULED and 
                    course_session.mentor_id==participant_id
                )
            return (
                course_session.status==course_session.Status.SCHEDULED and 
                course_session.enrollment.user_id==participant_id
            )
        return False
    @database_sync_to_async
    def start_session_attendance(
        self,
        conversation_id,
        participant_id,
        account_type
    ):
        conversation=Conversation.objects.select_related(
            'skill_exchange_session',
            'course_session'
        ).get(id=conversation_id)
        skill_session=conversation.skill_exchange_session
        course_session=conversation.course_session
        if skill_session is not None:
            session_type='SKILL_EXCHANGE'
            session_id=skill_session.id
        elif course_session is not None:
            session_type='COURSE'
            session_id=course_session.id
        else:
            raise ValueError('conversation has no associated session')
        if account_type=='MENTOR':
            participant=Mentor.objects.get(pk=participant_id)
        else:
            participant=User.objects.get(pk=participant_id)
        start_attendance(
            session_type=session_type,
            session_id=session_id,
            participant_type=account_type,
            participant=participant,
        )
        return session_type,session_id
    @database_sync_to_async
    def stop_session_attendance(
        self,
        session_type,
        session_id,
        participant_id,
        account_type
    ):
        if account_type=='MENTOR':
            participant=Mentor.objects.get(pk=participant_id)
        else:
            participant=User.objects.get(pk=participant_id)
        stop_attendance(
            session_type=session_type,
            session_id=session_id,
            participant_type=account_type,
            participant=participant
        )