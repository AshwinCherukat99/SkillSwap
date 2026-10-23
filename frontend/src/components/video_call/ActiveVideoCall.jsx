
import React, { useState, useCallback, useEffect } from "react";
import useWebRTC from "../../hooks/useWebRTC";
import useChatSocket from "../../hooks/useChatSocket";

import api from "../../services/api";
import mentorApi from "../../services/mentorApi";

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
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionTimeUp,setSessionTimeUp]=useState(false)
  const [remainingSeconds,setRemainingSeconds]=useState(null)
  const endCallTriggered=React.useRef(false)
  const [sessionDetails,setSessionDetails]=useState(null)
  const [sessionDetailsError,setSessionDetailsError]=useState('')

  useEffect(()=>{
    let cancelled=false
    const fetchSessionDetails=async ()=>{
      try{
        setSessionDetailsError('')
        const isMentor=Boolean(
          localStorage.getItem('mentor_access_token')
        )
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
  },[conversationId])

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
    if (!sessionDetails?.scheduled_start||sessionDetails?.duration_minutes==null){
      return
    }
    const scheduledStart=new Date(sessionDetails?.scheduled_start).getTime()
    const endTime=scheduledStart+Number(sessionDetails?.duration_minutes)*60*1000
    if (!Number.isFinite(scheduledStart)||!Number.isFinite(endTime)){
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
    sessionDetails?.scheduled_start,
    sessionDetails?.duration_minutes,
    leaveCall
  ])

  const handleChatMessage = useCallback((message) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  const {
    connected: chatConnected,
    sendMessage,
  } = useChatSocket(conversationId, handleChatMessage);

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
          <SessionProgress duration={sessionDetails?.duration_minutes}/>
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
      </main>

      <CallControls
        micEnabled={micEnabled}
        cameraEnabled={cameraEnabled}
        onToggleMicrophone={toggleMicrophone}
        onToggleCamera={toggleCamera}
        onLeave={leaveCall}
        onShareScreen={shareScreen}
        isHandRaised={isHandRaised}
        onToggleHand={toggleHand}
      />
    </div>
  );
};

export default ActiveVideoCall;
