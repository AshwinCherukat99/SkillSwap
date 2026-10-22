const CallControls=({
    micEnabled,
    cameraEnabled,
    onToggleMicrophone,
    onToggleCamera,
    onLeave,
    onShareScreen,
    isHandRaised,
    onToggleHand,
})=>{
    return (
        <footer className="call-controls">

            <button
                onClick={onToggleMicrophone}
                title="Mute"
            >
                <i
                    className={
                        micEnabled
                            ? "bi bi-mic-fill"
                            : "bi bi-mic-mute-fill"
                    }
                />
            </button>


            <button
                onClick={onToggleCamera}
                title="Camera"
            >
                <i
                    className={
                        cameraEnabled
                            ? "bi bi-camera-video-fill"
                            : "bi bi-camera-video-off-fill"
                    }
                />
            </button>


            <div className="control-divider" />


            <button className={
                `control-button ${isHandRaised?'active-control':''}`
            }
            onClick={onToggleHand}
            title={isHandRaised?'lower hand':'raise hand'}>
                <i className="bi bi-hand-index-fill"/>
            </button>


            <button title="Whiteboard">
                <i className="bi bi-pencil-square" />
            </button>

            <button onClick={onShareScreen}>
                Share Screen
            </button>

            <button
                className="leave-button"
                onClick={onLeave}
            >
                <i className="bi bi-telephone-x-fill" />
                Leave
            </button>

        </footer>
    )
}

export default CallControls