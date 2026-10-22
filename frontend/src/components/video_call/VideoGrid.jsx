const VideoGrid=({
    localVideoRef,
    remoteVideoRef,
    remoteHandRaised,
    isHandRaised,
    sessionTimeUp=false
})=>{
    return (
        <div className="video-grid">

            {/* Remote / Mentor */}
            <div className="remote-video-container">

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="remote-video"
                />

                {remoteHandRaised&&!sessionTimeUp&&(
                    <div className="remote-hand-raised">
            <i className="bi bi-hand-index-fill"/>
            <span>Hand Raised</span>
        </div>
                )}

                <div className="video-name">
                    Mentor
                </div>

            </div>


            {/* Local / Student */}
            <div className="local-video-container">

                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="local-video"
                />

                {isHandRaised&&!sessionTimeUp&&(
                    <div className="remote-hand-raised local-hand-raised">
                        <i className="bi bi-hand-index-fill" />
                        <span>Hand Raised</span>
                    </div>
                )}

                <div className="video-name-small">
                    You
                </div>

            </div>

            {sessionTimeUp && (
        <div className="session-time-up-overlay">
          <div className="session-time-up-card">
            <div className="session-time-up-icon">
              ⏱
            </div>

            <h2>Session time is up</h2>

            <p>
              Your scheduled session has ended.
              Thank you for participating!
            </p>
          </div>
        </div>
      )}

        </div>
    )
}

export default VideoGrid