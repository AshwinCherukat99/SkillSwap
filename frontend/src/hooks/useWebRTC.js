import {useEffect,useState,useRef} from 'react'

const useWebRTC=(roomName)=>{
    const localVideoRef=useRef(null)
    const remoteVideoRef=useRef(null)
    const socketRef=useRef(null)
    const peerConnectionRef=useRef(null)
    const localStreamRef=useRef(null)
    const [connected,setConnected]=useState(false)
    const [micEnabled,setMicEnabled]=useState(true)
    const [cameraEnabled,setCameraEnabled]=useState(true)
    useEffect(()=>{
        if (!roomName){
            return
        }
        let mounted=true
        const startCall=async ()=>{
            try{
                const stream=await navigator.mediaDevices.getUserMedia({
                    video:true,
                    audio:true,
                })
                if (!mounted){
                    return
                }
                localStreamRef.current=stream
                if (localVideoRef.current){
                    localVideoRef.current.srcObject=stream
                    const protocol=window.location.protocol==='https'?'wss':'ws'   
                    const wsUrl=`${protocol}://${window.location.host}`+`/ws/video/${roomName}/`
                    const socket=new WebSocket(wsUrl)
                    socketRef.current=socket
                    socket.onopen=()=>{
                        console.log('websocket connected')
                        setConnected(true)
                    }
                    socket.onmessage=async (event)=>{
                        const data=JSON.parse(event.data)
                        await handleSignal(data)
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
            }
            if (peerConnectionRef.current){
                peerConnectionRef.current.close()
            }
            if (localStreamRef.current){
                localStreamRef.current.getTracks().forEach(track=>track.stop())
            }
        }
    },[roomName])
    const createPeerConnection=()=>{
        if (peerConnectionRef.current){
            return peerConnectionRef.current
        }
        const peerConnection=new RTCPeerConnection({
            iceservers:[
                {
                    urls:'stun:stun.1.google.com:19302'
                }
            ]
        })
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
        }
        else if (data.type==='ice-candidate'){
            if (data.candidate){
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(
                        data.candidate
                    )
                )
            }
        }
    }
    const createOffer=async ()=>{
        const peerConnection=createPeerConnection()
        const offer=peerConnection.createOffer()
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
    const leaveCall=()=>{
        if (localStreamRef.current){
            localStreamRef.current.getTracks().forEach(track=>track.stop())
        }
        if (peerConnectionRef.current){
            peerConnectionRef.current.close()
        }
        if (socketRef.current){
            socketRef.current.close()
        }
    }
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
    return {
        localVideoRef,
        remoteVideoRef,
        connected,
        micEnabled,
        cameraEnabled,
        createOffer,
        toggleMicrophone,
        toggleCamera,
        leaveCall,
        shareScreen,
    }
}

export default useWebRTC