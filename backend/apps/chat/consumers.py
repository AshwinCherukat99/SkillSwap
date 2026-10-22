import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Conversation,ConversationMember,Message

User=get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("CHAT CONNECT CALLED")
        self.conversation_id=self.scope['url_route']['kwargs']['conversation_id']
        print("CONVERSATION ID:", self.conversation_id)
        self.room_group_name=f'chat_{self.conversation_id}'
        user=self.scope.get('user')
        print("WEBSOCKET USER:", user)
        print("IS ANONYMOUS:", user.is_anonymous if user else "NO USER")
        if not user or user.is_anonymous:
            print("REJECTING: USER NOT AUTHENTICATED")
            await self.close(code=4001)
            return
        is_member=await self.check_membership(user)
        print("IS MEMBER:", is_member)
        if not is_member:
            print("REJECTING: USER IS NOT A MEMBER")
            await self.close(code=4003)
            return
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        print("CHAT WEBSOCKET ACCEPTED")
    async def disconnect(self,close_code):
        if hasattr(self,'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )
    async def receive(self,text_data):
        print('chat message received-',text_data)
        try:
            data=json.loads(text_data)
        except json.JSONDecodeError:
            print('invalid json')
            await self.send(text_data=json.dumps({
                'error':'invalid json'
            }))
            return
        print('parsed chat data:',data)
        if not isinstance(data,dict):
            await self.send(text_data=json.dumps({
                'error':'message payload must be a json object'
            }))
            return
        message_content=data.get('message','').strip()
        print('message content:',message_content)
        if not message_content:
            await self.send(text_data=json.dumps({
                'error':'message cannot be empty'
            })) 
            return
        user=self.scope['user'] 
        print('sending message as user:',user)
        message=await self.create_message(
            user=user,
            content=message_content
        )
        print('message created:',message)
        exists=await self.check_message_exists(
            message['id']
        )
        print('message exists in database:',exists)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':{
                    'id':message['id'],
                    'content':message['content'],
                    'sender':message['sender'],
                    'created_at':message['created_at'],
                },
            },
        )
    async def chat_message(self,event):
        print("CHAT MESSAGE EVENT:", event)
        await self.send(
            text_data=json.dumps({
                'type':'message',
                'message':event['message'],
            })
        )
    @database_sync_to_async
    def check_membership(self,user):
        if ConversationMember.objects.filter(
            conversation_id=self.conversation_id,
            user=user,
            is_active=True,
        ).exists():
            return True
        try:
            mentor=user.mentor_profile
        except Exception:
            mentor=None
        if mentor:
            return ConversationMember.objects.filter(
                conversation_id=self.conversation_id,
                mentor=mentor,
                is_active=True,
            ).exists()
        return False

    @database_sync_to_async
    def create_message(self,user,content):
        conversation=Conversation.objects.get(
            id=self.conversation_id
        ) 
        try:
            mentor=user.mentor_profile
        except Exception:
            mentor=None
        if mentor:
            message=Message.objects.create(
                conversation=conversation,
                sender_mentor=mentor,
                content=content,
            )
            sender={
                'id':mentor.id,
                'username':mentor.username,
                'type':'MENTOR',
            }
        else:
            message=Message.objects.create(
            conversation=conversation,
            sender_user=user,
            content=content,
        )
            sender={
                'id':user.id,
                'username':user.username,
                'type':'USER'
            }
        conversation.save(update_fields=['updated_at'])
        return {
            'id':message.id,
            'content':message.content,
            'sender':sender,
            'created_at':message.created_at.isoformat(),
        }
    @database_sync_to_async
    def check_message_exists(self,message_id):
        return Message.objects.filter(
            id=message_id
        ).exists()