import {useEffect,useState,useRef, useCallback} from 'react'

const useWebRTC=(roomName,conversationId,accessToken)=>{
    const initiatorRef=useRef(false)
    const localVideoRef=useRef(null)
    const remoteVideoRef=useRef(null)
    const socketRef=useRef(null)
    const peerConnectionRef=useRef(null)
    const localStreamRef=useRef(null)
    const pendingCandidatesRef=useRef([])  
    const callEndedRef=useRef(false)
    const [remoteHandRaised,setRemoteHandRaised]=useState(false)
    const [connected,setConnected]=useState(false)
    const [callConnected,setCallConnected]=useState(false)
    const [micEnabled,setMicEnabled]=useState(true)
    const [cameraEnabled,setCameraEnabled]=useState(true)
    const [isHandRaised,setIsHandRaised]=useState(false)
    useEffect(()=>{
        callEndedRef.current=false
        if (!roomName||!conversationId||!accessToken){
            console.warn('video call requires roomname, conversationid and accesstoken')
            return
        }
        let mounted=true
        const startCall=async ()=>{
            if (callEndedRef.current){
                return
            }
            try{
                const stream=await navigator.mediaDevices.getUserMedia({
                    video:true,
                    audio:true,
                })
                if (!mounted||callEndedRef.current){
                    stream.getTracks().forEach(track=>track.stop())
                    return
                }
                localStreamRef.current=stream
                if (localVideoRef.current){
                    localVideoRef.current.srcObject=stream
                    const wsBaseUrl=import.meta.env.VITE_WS_URL||'ws://localhost:8000'
                    const wsUrl=`${wsBaseUrl}/ws/video/${roomName}/${conversationId}/?token=${encodeURIComponent(accessToken)}`
                    console.log('connecting to video websocket:',wsUrl)
                    const socket=new WebSocket(wsUrl)
                    socketRef.current=socket
                    socket.onopen=()=>{
                        console.log('websocket connected')
                        setConnected(true)
                    }
                    socket.onmessage=async (event)=>{
                        try{
                            const data=JSON.parse(event.data)
                        await handleSignal(data)
                        }catch(error){
                            console.error('failed to process video signal:',error)
                        }
                    }
                    socket.onerror=(error)=>{
                        console.error('video websocket error:',error)
                    }
                    socket.onclose=()=>{
                        console.log('websocket disconnected')
                        setConnected(false)
                    }
                }
            }catch(err){
                console.error('failed to start video call:',err)
            }
        }
        startCall()
        return ()=>{
            mounted=false
            if (socketRef.current){
                socketRef.current.close()         
                socketRef.current=null
            }
            if (peerConnectionRef.current){
                peerConnectionRef.current.close()
                peerConnectionRef.current=null
            }
            if (localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track=>track.stop())
                localStreamRef.current=null
            }
        }
    },[roomName,conversationId,accessToken])
    const createPeerConnection=()=>{
        if (peerConnectionRef.current){
            return peerConnectionRef.current
        }
        const peerConnection=new RTCPeerConnection({
            iceServers:[
                {
                    urls:'stun:stun.1.google.com:19302'
                }
            ]
        })
        peerConnection.onconnectionstatechange=()=>{
            const state=peerConnection.connectionState
            console.log('webrtc connection state:',state)
            if (state=='connected'){
                setCallConnected(true)
            }
            if (state=='disconnected'||state=='failed'||state=='closed'){
                setCallConnected(false)
            }
        }
        peerConnectionRef.current=peerConnection
        if (localStreamRef.current){
            localStreamRef.current.getTracks().forEach(track=>{
                peerConnection.addTrack(
                    track,
                    localStreamRef.current
                )
            })
        }
        peerConnection.ontrack=(event)=>{
            if (remoteVideoRef.current){
                remoteVideoRef.current.srcObject=event.streams[0]
            }
        }
        peerConnection.onicecandidate=(event)=>{
            if (event.candidate){
                sendSignal({
                    type:'ice-candidate',
                    candidate:event.candidate,
                })
            }
        }
        return peerConnection
    }
    const sendSignal=(data)=>{
        if (socketRef.current && socketRef.current.readyState===WebSocket.OPEN){
            socketRef.current.send(JSON.stringify(data))
        }
    }
    const handleSignal=async (data)=>{
        const peerConnection=createPeerConnection()
        if (data.type==='offer'){
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.offer)
            )
            for (const candidate of pendingCandidatesRef.current){
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                )
            }
            pendingCandidatesRef.current=[]
            const answer=await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            sendSignal({
                type:'answer',
                answer
            })
        }
        else if (data.type==='answer'){
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.answer)
            )
            for (const candidate of pendingCandidatesRef.current) {
        await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
        )
    }
    pendingCandidatesRef.current = []
        }
        else if (data.type==='ice-candidate'){
            if (!data.candidate){
                return
            }
            if (peerConnection.remoteDescription){
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(
                        data.candidate
                    )
                )
            }else{
                pendingCandidatesRef.current.push(data.candidate)
            }
        }
        else if (data.type==='peer-ready'){
            if (initiatorRef.current){
                return
            }
            initiatorRef.current=true
            await createOffer()
            return
        }
        else if (data.type==='hand-state'){
            console.log(
                data.raised?
                'remote user raised their hand':
                'remote user lowered their hand'
            )
            setRemoteHandRaised(data.raised)
        }
        else if (data.type==='peer-left'){
            console.log('other participant has left the call')
            if (peerConnectionRef.current){
                peerConnectionRef.current.close()
                peerConnectionRef.current=null
            }
            pendingCandidatesRef.current=[]
            initiatorRef.current=false
            setCallConnected(false)
        }
    }
    const createOffer=async ()=>{
        const peerConnection=createPeerConnection()
        const offer=await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        sendSignal({
            type:'offer',
            offer
        })
    }
    const toggleMicrophone=()=>{
        const stream=localStreamRef.current
        if (!stream){
            return
        }
        const audioTrack=stream.getAudioTracks()[0]
        if (!audioTrack){
            return
        }
        audioTrack.enabled=!audioTrack.enabled
        setMicEnabled(audioTrack.enabled)
        sendSignal({
            type:'media-state',
            media:'audio',
            enabled:audioTrack.enabled,
        })
    }
    const toggleCamera=()=>{
        const stream=localStreamRef.current
        if (!stream){
            return
        }
        const videoTrack=stream.getVideoTracks()[0]
        if (!videoTrack){
            return
        }
        videoTrack.enabled=!videoTrack.enabled
        setCameraEnabled(videoTrack.enabled)
        sendSignal({
            type:'media-state',
            media:'video',
            enabled:videoTrack.enabled,
        })
    }
    const leaveCall=useCallback(()=>{
        if (callEndedRef.current){
            return
        }
        callEndedRef.current=true
        if (localStreamRef.current){
            localStreamRef.current.getTracks().forEach((track)=>{
                track.stop()
            })
            localStreamRef.current=null
        }
        if (remoteVideoRef.current?.srcObject){
            const remoteStream=remoteVideoRef.current.srcObject
            remoteStream.getTracks().forEach((track)=>{
                track.stop()
            })
            remoteVideoRef.current.srcObject=null
        }
        if (peerConnectionRef.current){
            peerConnectionRef.current.ontrack=null
            peerConnectionRef.current.onicecandidate=null
            peerConnectionRef.current.onconnectionstatechange=null
            peerConnectionRef.current.close()
            peerConnectionRef.current=null 
        }  
        if (socketRef.current){
            const socket=socketRef.current 
            socket.onopen=null
            socket.onmessage=null
            socket.onerror=null
            socket.onclose=null
        }      
        if (socket.readyState===WebSocket.OPEN || socket.readyState===WebSocket.CONNECTING){
            socket.close()
        }
        socket.current=null
        if (localVideoRef.current){
            localVideoRef.current.srcObject=null
        }
        setConnected(false)
        setCallConnected(false)
        setRemoteHandRaised(false)
        setIsHandRaised(false)
        pendingCandidatesRef.current=[]
        initiatorRef.current=false
    },[])
    const shareScreen=async ()=>{
        try{
            const screenStream=await navigator.mediaDevices.getDisplayMedia({
                video:true,
                audio:true
            })
            const screenTrack=screenStream.getVideoTracks()[0]
            const sender=peerConnectionRef.current?.getSenders().find(
                sender=>sender.track?.kind==='video'
            )
            if (sender){
                await sender.replaceTrack(screenTrack)
            }
            screenTrack.onended=async ()=>{
                const cameraTrack=localStreamRef.current.getVideoTracks()[0]
                if (cameraTrack&&sender){
                    await sender.replaceTrack(cameraTrack)
                }
            }
        }catch(err){
            console.error('screen sharing failed:',err)
        }
    }
    const toggleHand=()=>{
        const newState=!isHandRaised
        setIsHandRaised(newState)
        sendSignal({
            type:'hand-state',
            raised:newState,
        })
    }
    return {
        localVideoRef,
        remoteVideoRef,
        connected,
        callConnected,
        micEnabled,
        cameraEnabled,
        createOffer,
        toggleMicrophone,
        toggleCamera,
        leaveCall,
        shareScreen,
        isHandRaised,
        remoteHandRaised,
        toggleHand
    }
}

export default useWebRTC