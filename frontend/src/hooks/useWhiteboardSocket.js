import { useEffect,useState,useRef,useCallback } from "react";

import { WS_BASE_URL } from "../config";

const useWhiteBoardSocket=(
    conversationId,
    accessToken,
    onMessage
)=>{
    const socketRef=useRef(null)
    const onMessageRef=useRef(onMessage)
    const [connected,setConnected]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        onMessageRef.current=onMessage
    },[onMessage])
    useEffect(()=>{
        if (!conversationId||!accessToken){
            return
        }
        let active=true
        const socketUrl=`${WS_BASE_URL}/ws/whiteboard/${conversationId}/`+`?token=${encodeURIComponent(accessToken)}`
        const socket=new WebSocket(socketUrl)
        socketRef.current=socket
        socket.onopen=()=>{
            if (!active) return 
            setConnected(true)
            setError('')
            console.log('whiteboard websocket connected')
        }
        socket.onmessage=(event)=>{
            try{
                const data=JSON.parse(event.data)
                onMessageRef.current?.(data)
            }catch(err){
                console.error('invalid whiteboard message:',err)
            }
        }
        socket.onerror=(event)=>{
            console.error('whiteboard websocket error:',event)    
            if (active){
                setError('whiteboard connection error')
            }
        }
        socket.onclose=(event)=>{
            if (!event) return
            setConnected(false)
            if (event.code===4001){
                setError('authentication failed')
            }else if (event.code===4003){
                setError('you are not authorized to access this whiteboard')
            }else{
                setError('whiteboard disconnected')
            }
            console.log('whiteboard websocket closed:',event.code)
        }
        return ()=>{
            active=false
            socket.onopen=null
            socket.onmessage=null
            socket.onerror=null
            socket.onclose=null
            if (socket.readyState===WebSocket.OPEN||
                socket.readyState===WebSocket.CONNECTING
            ){
                socket.close()
            }
            if (socketRef.current===socket){
                socketRef.current=null
            }
        }
    },[conversationId,accessToken])
    const sendEvent=useCallback((type,payload={})=>{
        const socket=socketRef.current
        if (!socket||socket.readyState!==WebSocket.OPEN){
            console.warn('whiteboard is not connected')
            return false 
        }
        socket.send(JSON.stringify({
            type,
            payload
        }))
        return true
    },[])
    return {
        connected,
        error,
        sendEvent,
    }
}

export default useWhiteBoardSocket