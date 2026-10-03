import React from "react";
import {useParams} from 'react-router-dom'

import useWebRTC from "../../hooks/useWebRTC";

const VideoCallPage=()=>{
    const {roomName}=useParams()
    const {
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
    }=useWebRTC(roomName)
    return (
        <div className="video-call-page">

            <VideoCallHeader
                connected={connected}
            />

            <main className="video-call-main">

                <section className="video-section">

                    <VideoGrid
                        localVideoRef={localVideoRef}
                        remoteVideoRef={remoteVideoRef}
                    />

                    <SessionProgress />

                </section>

                <CallSidebar />

            </main>

            <CallControls
                micEnabled={micEnabled}
                cameraEnabled={cameraEnabled}
                onToggleMicrophone={
                    toggleMicrophone
                }
                onToggleCamera={
                    toggleCamera
                }
                onLeave={leaveCall}
                onStartCall={createOffer}
                onShareScreen={shareScreen}
            />

        </div>
    )
}

export default VideoCallPage