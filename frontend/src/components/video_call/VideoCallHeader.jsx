import React from "react";

const VideoCallHeader=({connected})=>{
    return (
        <header className="video-call-header">
            <div className="video-call-header-left">
                <div className="video-call-logo">
                    SkillSwap
                </div>

                <div className="video-call-divider"></div>

                <div className="video-call-title">
                    <h2>Video Session</h2>
                    <span>
                        {connected ? "Connected" : "Waiting for connection"}
                    </span>
                </div>
            </div>

            <div className="video-call-header-right">
                <div
                    className={`connection-status ${
                        connected ? "connected" : "disconnected"
                    }`}
                >
                    <span className="status-dot"></span>

                    {connected
                        ? "Connected"
                        : "Connecting..."}
                </div>
            </div>
        </header>
    )
}

export default VideoCallHeader