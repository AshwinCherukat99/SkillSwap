import {useEffect} from 'react' 
import {toast} from 'react-toastify'

import { WS_BASE_URL } from '../config'

const useRealtimeNotifications=(tokenKey='access_token')=>{
    console.log('notification hook rendered:',tokenKey)
    useEffect(()=>{
        console.log('notification hook mounted')
        const token=localStorage.getItem(tokenKey)
        console.log('notification token key:',tokenKey)
        console.log('notification token exists:',!!token)
        if (!token){
            console.log('no token found for notifications')
            return
        }
        const wsBaseUrl=WS_BASE_URL
        console.log('connecting to notification websocket:',wsBaseUrl)
        const socket=new WebSocket(
            `${wsBaseUrl}/ws/notifications/?token=${encodeURIComponent(token)}`
        )
        socket.onopen=()=>{
            console.log('notification websocket connected')
        }
        socket.onmessage=(event)=>{
            try{
                console.log('notification websocket message:',event.data)
                const data=JSON.parse(event.data)
                if (data.type!=='notification') return
                const notification=data.notification
                toast.info(
                    <div>
                        <strong>{notification.title}</strong>
                        <div>{notification.message}</div>
                    </div>,{
                        toastId:`notification-${notification.id}`,
                        autoClose:5000
                    }
                )
            }catch(err){
                console.error('failed to process notification:',err)
            }
        }
        socket.onerror=(error)=>{
            console.log('notification websocket error:',error)
        }
        socket.onclose=(event)=>{
            console.log('notification websocket disconnected:',event.code,event.reason)
        }
        return ()=>{
            socket.close()
        }
    },[tokenKey])
}

export default useRealtimeNotifications