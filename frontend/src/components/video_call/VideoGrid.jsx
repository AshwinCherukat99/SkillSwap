const VideoGrid=({
    localVideoRef,
    remoteVideoRef,
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

                <div className="video-name-small">
                    You
                </div>

            </div>

        </div>
    )
}

export default VideoGrid