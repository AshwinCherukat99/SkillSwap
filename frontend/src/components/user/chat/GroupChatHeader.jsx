import React from "react";

const GroupChatHeader=({group,members,connected})=>{
    if (!group){
        return null
    }
    const title=group.course_title||group.course_name||group.name||group.title||group.course?.title||'Study Group'
    return (
        <div className="chat-header">

            <div className="d-flex align-items-center">

                <div className="group-avatar me-3">

                    <i className="bi bi-people-fill"></i>

                </div>


                <div>

                    <h5 className="fw-bold mb-1">
                        {title}
                    </h5>

                    <div className="small">

                        <span
                            className={
                                connected
                                    ? 'text-success'
                                    : 'text-danger'
                            }
                        >
                            <i className="bi bi-circle-fill me-1"></i>

                            {connected
                                ? 'Connected'
                                : 'Connecting...'}
                        </span>

                        {members.length > 0 && (
                            <span className="text-muted ms-3">
                                {members.length} member
                                {members.length !== 1
                                    ? 's'
                                    : ''}
                            </span>
                        )}

                    </div>

                </div>

            </div>


            <div className="d-flex align-items-center gap-2">

                {/* These are intentionally disabled until calls are implemented */}

                <button
                    type="button"
                    className="btn btn-light rounded-circle"
                    disabled
                    title="Voice calls coming soon"
                >
                    <i className="bi bi-telephone"></i>
                </button>


                <button
                    type="button"
                    className="btn btn-light rounded-circle"
                    disabled
                    title="Video calls coming soon"
                >
                    <i className="bi bi-camera-video"></i>
                </button>


                <button
                    type="button"
                    className="btn btn-light rounded-circle"
                >
                    <i className="bi bi-three-dots"></i>
                </button>

            </div>

        </div>
    )
}

export default GroupChatHeader