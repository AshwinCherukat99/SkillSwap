const CallControls=({
    micEnabled,
    cameraEnabled,
    onToggleMicrophone,
    onToggleCamera,
    onLeave,
    onStartCall,
    onShareScreen
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


            <button title="Share screen">
                <i className="bi bi-display" />
            </button>


            <div className="control-divider" />


            <button title="Raise hand">
                <i className="bi bi-hand-index-fill" />
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