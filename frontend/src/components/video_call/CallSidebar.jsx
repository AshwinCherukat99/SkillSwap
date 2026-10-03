import React from "react";

const CallSidebar=()=>{
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
                        Skill Exchange
                    </span>

                </div>

                <div className="session-detail">

                    <span className="detail-label">
                        Status
                    </span>

                    <span className="session-status">
                        Live
                    </span>

                </div>

                <div className="session-detail">

                    <span className="detail-label">
                        Duration
                    </span>

                    <span className="detail-value">
                        60 minutes
                    </span>

                </div>

            </div>


            {/* Participant */}
            <div className="sidebar-section">

                <h3>Participants</h3>

                <div className="participant">

                    <div className="participant-avatar">
                        Y
                    </div>

                    <div className="participant-info">

                        <strong>
                            You
                        </strong>

                        <span>
                            Participant
                        </span>

                    </div>

                    <span className="participant-status">
                        ●
                    </span>

                </div>


                <div className="participant">

                    <div className="participant-avatar">
                        R
                    </div>

                    <div className="participant-info">

                        <strong>
                            Remote User
                        </strong>

                        <span>
                            Participant
                        </span>

                    </div>

                    <span className="participant-status">
                        ●
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