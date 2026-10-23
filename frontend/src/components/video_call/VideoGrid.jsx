
const VideoGrid = ({
    localVideoRef,
    remoteVideoRef,
    screenVideoRef,
    remoteScreenVideoRef,
    isScreenSharing,
    remoteScreenSharing,
    remoteHandRaised,
    isHandRaised,
    remoteCameraThumbnailRef,
    sessionTimeUp = false,
}) => {
    const sharing = isScreenSharing || remoteScreenSharing;

    return (
        <div className={`video-grid ${sharing ? "screen-sharing-active" : ""}`}>

            {/* Main shared-screen area */}
            <div className="remote-video-container">

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={`remote-video ${sharing ? "camera-hidden" : ""}`}
                />

                <video
                    ref={screenVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`shared-screen-video ${
                        isScreenSharing ? "screen-visible" : "screen-hidden"
                    }`}
                />

                <video
                    ref={remoteScreenVideoRef}
                    autoPlay
                    playsInline
                    className={`shared-screen-video ${
                        remoteScreenSharing ? "screen-visible" : "screen-hidden"
                    }`}
                />

                <div className="video-name">
                    {isScreenSharing
                        ? "Your Screen"
                        : remoteScreenSharing
                            ? "Participant's Screen"
                            : "Mentor"}
                </div>

                {remoteHandRaised && !sessionTimeUp && (
                    <div className="remote-hand-raised">
                        <i className="bi bi-hand-index-fill" />
                        <span>Hand Raised</span>
                    </div>
                )}
            </div>

            {/* Remote participant's camera thumbnail */}
            
{/* Remote participant's camera thumbnail */}
<div
    className={`remote-camera-thumbnail ${
        sharing ? "thumbnail-visible" : "thumbnail-hidden"
    }`}
>
    <video
        ref={remoteCameraThumbnailRef}
        autoPlay
        playsInline
        className="remote-thumbnail-video"
    />
    <span className="video-name-small">Participant</span>
</div>


            {/* Your own camera thumbnail */}
            <div className="local-video-container">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="local-video"
                />

                {isHandRaised && !sessionTimeUp && (
                    <div className="remote-hand-raised local-hand-raised">
                        <i className="bi bi-hand-index-fill" />
                        <span>Hand Raised</span>
                    </div>
                )}

                <div className="video-name-small">You</div>
            </div>

            {sessionTimeUp && (
                <div className="session-time-up-overlay">
                    <div className="session-time-up-card">
                        <div className="session-time-up-icon">⏱</div>
                        <h2>Session time is up</h2>
                        <p>
                            Your scheduled session has ended.
                            Thank you for participating!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGrid;
