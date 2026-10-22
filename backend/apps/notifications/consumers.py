import json

from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user=self.scope.get('user')
        print('notification connection attempt')
        print('websocket user:',user)
        print('user anonymous:',not user or user.is_anonymous)
        if not user or user.is_anonymous:
            print('notification connection rejected')
            await self.close(code=4001)
            return
        if hasattr(user,'user_id'):
            recipient_id=user.user_id
            print("RECIPIENT ID:", repr(recipient_id), type(recipient_id))
        else:
            recipient_id=user.id
        if not recipient_id:
            print('no notification recipient id')
            await self.close(code=4001)
            return
        self.group_name=f'notifications_user_{recipient_id}'
        print('joining notification group:',self.group_name)
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )
        await self.accept()
        print('notification websocket connected:',self.group_name)
    async def disconnect(self,close_code):
        if hasattr(self,'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            print('notification disconnected:',self.group_name)
    async def notification_event(self,event):
        print('notification event received:',event)
        await self.send(
            text_data=json.dumps({
                'type':'notification',
                'notification':event['notification'],
            })
        )