
import React, { useState, useCallback, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import useWebRTC from "../../hooks/useWebRTC";
import useChatSocket from "../../hooks/useChatSocket";

import api from "../../services/api";
import mentorApi from "../../services/mentorApi";

import Whiteboard from "./Whiteboard";
import VideoCallHeader from "./VideoCallHeader";
import VideoGrid from "./VideoGrid";
import SessionProgress from "./SessionProgress";
import CallSidebar from "./CallSidebar";
import CallControls from "./CallControls";
import InCallChat from "./InCallChat";

const ActiveVideoCall = ({
  roomName,
  conversationId,
  accessToken,
}) => {
  const navigate=useNavigate()
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionTimeUp,setSessionTimeUp]=useState(false)
  const [remainingSeconds,setRemainingSeconds]=useState(null)
  const endCallTriggered=React.useRef(false)
  const [sessionDetails,setSessionDetails]=useState(null)
  const [sessionDetailsError,setSessionDetailsError]=useState('')
  const chatTokenKey=accessToken&&accessToken===localStorage.getItem('mentor_access_token')?'mentor_access_token':'access_token'
  const isMentor=chatTokenKey==='mentor_access_token'
  const [showWhiteboard,setShowWhiteboard]=useState(false)

  useEffect(()=>{
    let cancelled=false
    const fetchSessionDetails=async ()=>{
      try{
        setSessionDetailsError('')
        const client=isMentor?mentorApi:api
        const response=await client.get(
          `/chat/video-call/${conversationId}/details/`
        )
        if (!cancelled){
          setSessionDetails(response.data)
        }
      }catch(err){
        console.error(
          'failed to load video session details:',err.response?.data||err
        )
        if (!cancelled){
          setSessionDetailsError(
            'unable to load session details'
          )
        }
      }
    }
    if (conversationId){
      fetchSessionDetails()
    }
    return ()=>{
      cancelled=true
    }
  },[conversationId,chatTokenKey])

  useEffect(()=>{
    let cancelled=false
    const fetchChatHistory=async ()=>{
      try{
        const isMentor=chatTokenKey==='mentor_access_token'
        const client=isMentor?mentorApi:api
        const endpoint=isMentor?
        `/chat/mentor/video-call/${conversationId}/messages/`
        :`/chat/video-call/${conversationId}/messages/`
        const response=await client.get(endpoint)
        if (!cancelled){
          const history=Array.isArray(response.data)
          ?response.data
          :response.data.messages||[]
          setChatMessages(history)
        }
      }catch(err){
        console.error('failed to load chat history:',err.response?.data||err)
      }
    }
    if (conversationId){
      fetchChatHistory()
    }
    return ()=>{
      cancelled=true
    }
  },[conversationId,chatTokenKey])

  const {
    localVideoRef,
    remoteVideoRef,
    connected,
    callConnected,
    micEnabled,
    cameraEnabled,
    toggleMicrophone,
    toggleCamera,
    leaveCall,
    shareScreen,
    isHandRaised,
    remoteHandRaised,
    toggleHand,
    screenVideoRef,
    isScreenSharing,
    remoteScreenSharing,
    remoteScreenVideoRef,
    remoteCameraThumbnailRef
  } = useWebRTC(roomName, conversationId, accessToken);

  useEffect(()=>{
    if (!sessionDetails?.actual_started_at||sessionDetails?.duration_minutes==null){
      return
    }
    const actualStart=new Date(sessionDetails?.actual_started_at).getTime()
    const endTime=actualStart+Number(sessionDetails?.duration_minutes)*60*1000
    if (!Number.isFinite(actualStart)||!Number.isFinite(endTime)){
      return
    }
    const updateTimer=()=>{
      const remaining=Math.max(
        0,
        Math.ceil((endTime-Date.now())/1000)
      )
      setRemainingSeconds(remaining)
      if (remaining===0 && !endCallTriggered.current){
        endCallTriggered.current=true
        setSessionTimeUp(true)
        leaveCall()
      }
    }
    updateTimer()
    const intervalId=window.setInterval(updateTimer,1000)
    return ()=>window.clearInterval(intervalId)
  },[
    sessionDetails?.actual_started_at,
    sessionDetails?.duration_minutes,
    leaveCall
  ])

  const handleChatMessage = useCallback((message) => {
    setChatMessages((prev) => {
      if (prev.some((item)=>item.id===message.id)){
        return prev
      }
      return [...prev, message]
    });
  }, []);

  const {
    connected: chatConnected,
    sendMessage,
  } = useChatSocket(conversationId, handleChatMessage,chatTokenKey);

  const handleLeaveCall=useCallback(()=>{
    leaveCall()
    if (isMentor){
      navigate('/mentor/upcoming_sessions/',{replace:true})
    }
    else{
      navigate('/upcoming_sessions/',{replace:true})
    }
  },[leaveCall,navigate,isMentor])

  return (
    <div className="video-call-page">
      <VideoCallHeader connected={connected} />

      <main className="video-call-main">
        <section className="video-section">
          <VideoGrid
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            isHandRaised={isHandRaised}
            remoteHandRaised={remoteHandRaised}
            sessionTimeUp={sessionTimeUp}
            screenVideoRef={screenVideoRef}  
            isScreenSharing={isScreenSharing}
            remoteScreenSharing={remoteScreenSharing}
            remoteScreenVideoRef={remoteScreenVideoRef} 
            remoteCameraThumbnailRef={remoteCameraThumbnailRef}
          />
          <SessionProgress duration={sessionDetails?.duration_minutes}
          actualStartedAt={sessionDetails?.actual_started_at}/>
        </section>

        <aside className="call-sidebar">
          <CallSidebar 
          sessionType={sessionDetails?.session_type}
          connected={callConnected}
          currentUsername={sessionDetails?.current_username}
          remoteUsername={sessionDetails?.remote_username}
          durationMinutes={sessionDetails?.duration_minutes}
          />
          <InCallChat
            messages={chatMessages}
            onSendMessage={(message) => sendMessage({ message })}
          />
        </aside>
        {showWhiteboard&&(
          <Whiteboard
          conversationId={conversationId}
          accessToken={accessToken}
          isMentor={isMentor}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onClose={()=>setShowWhiteboard(false)}/>
        )}
      </main>

      <CallControls
        micEnabled={micEnabled}
        cameraEnabled={cameraEnabled}
        onToggleMicrophone={toggleMicrophone}
        onToggleCamera={toggleCamera}
        onLeave={handleLeaveCall}
        onShareScreen={shareScreen}
        isHandRaised={isHandRaised}
        onToggleHand={toggleHand}
        onOpenWhiteboard={()=>setShowWhiteboard(true)}
        isMentor={isMentor}
      />
    </div>
  );
};

export default ActiveVideoCall;
