import React from "react";

const CallSidebar=({
    sessionType,
    connected,
    currentUsername,
    remoteUsername,
    durationMinutes,
})=>{
    return (
        <aside className="call-sidebar">

            {/* Session information */}
            <div className="sidebar-section">

                <h3>Session Details</h3>

                <div className="session-detail">

                    <span className="detail-label">
                        Session
                    </span>

                    <span className="detail-value">
    {sessionType === "SKILL_EXCHANGE"
        ? "Skill Exchange"
        : sessionType === "COURSE"
        ? "Course"
        : sessionType||"Loading..."}
</span>

                </div>

                <div className="session-detail">
    <span className="detail-label">Status</span>

    <span
        className={`session-status ${
            connected ? "live" : "disconnected"
        }`}
    >
        {connected ? "Live" : "Disconnected"}
    </span>
</div>

                <div className="session-detail">
    <span className="detail-label">Duration</span>
    <span className="detail-value">
        {durationMinutes != null
            ? `${durationMinutes} minutes`
            : "Loading..."}
    </span>
</div>

            </div>


            {/* Participant */}
            <div className="sidebar-section">
    <h3>Participants</h3>

    {/* Current participant */}
    <div className="participant">
        <div className="participant-avatar">
            {(currentUsername || "Y").charAt(0).toUpperCase()}
        </div>

        <div className="participant-info">
            <strong>You</strong>
            <span>{currentUsername || "Loading..."}</span>
        </div>

        <span
            className="participant-status"
            title="You are connected to the call"
        >
            ●
        </span>
    </div>

    {/* Remote participant */}
    <div className="participant">
        <div className="participant-avatar">
            {(remoteUsername || "?").charAt(0).toUpperCase()}
        </div>

        <div className="participant-info">
            <strong>
                {remoteUsername || "Waiting for participant"}
            </strong>
            <span>Participant</span>
        </div>

        <span
            className="participant-status"
            title={connected ? "Connected" : "Disconnected"}
        >
            {connected ? "●" : "○"}
        </span>
    </div>
</div>


            {/* Session notes */}
            <div className="sidebar-section">

                <h3>Session Notes</h3>

                <textarea
                    className="session-notes"
                    placeholder="Write notes about this session..."
                />

            </div>

        </aside>
    )
}

export default CallSidebar