
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
    isMentor,
    sessionType,
    rating,
    setRating,
    submitRating,
    ratingSubmitted,
    ratingLoading,
    ratingError
}) => {
    const sharing = isScreenSharing || remoteScreenSharing;
    const remoteParticipantLabel=
    sessionType==='COURSE'
    ?(isMentor?'Student':'Mentor')
    :'Skill Partner'
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
                            ? `${remoteParticipantLabel}'s Screen`
                            : remoteParticipantLabel}
                </div>

                {remoteHandRaised && !sessionTimeUp && (
                    <div className="remote-hand-raised">
                        <span className="material-symbols-outlined raise-hand-icon">
    front_hand
</span>
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
    <span className="video-name-small">{remoteParticipantLabel}</span>
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
                        <span className="material-symbols-outlined raise-hand-icon">
    front_hand
</span>
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
                        {sessionType==='SKILL_EXCHANGE'&&!isMentor&&(
                            <div className="session-rating-section">
                                {ratingSubmitted?(
                                    <div className="rating-success">
                                        <h3>Thankyou for your feedback</h3>
                                        <p>Your rating has been submitted successfully</p>
                                    </div>
                                ):(
                                    <>
                                    <h3>Rate your skill partner</h3>
                                    <div className="rating-stars">
                                        {[1,2,3,4,5].map((star)=>(
                                            <button
                                            key={star}
                                            type='button'
                                            className={`rating-star ${rating>=star?'active':''}`}
                                            onClick={()=>setRating(star)}
                                            disabled={ratingLoading}>
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <p className="rating-label">
                                        {rating===0
                                        ?'select your rating'
                                    :`${rating} out of five stars`}
                                    </p>
                                    {ratingError&&(
                                        <p className="rating-error">
                                            {ratingError}
                                        </p>
                                    )}
                                    <button
                                    className="submit-rating-btn"
                                    onClick={submitRating}
                                    disabled={ratingLoading||rating===0}>
                                        {ratingLoading?'Submitting...':'Submit Rating'}
                                    </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGrid;
