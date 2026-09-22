import React from 'react'

const ChatHeader=({group})=>{
    if (!group){
        return (
            <div className="p-4 border-bottom bg-white">
        <h5 className="mb-0">Select a study group</h5>
      </div>
        )
    }
    return (
        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <div className="chat-group-icon">
          <i className="bi bi-code-slash"></i>
        </div>

        <div>
          <h5 className="mb-1 fw-bold">
            {group.name || group.course_title}
          </h5>

          <div className="small text-success">
            <span className="online-dot"></span>
            {group.online_count || 0} people online
          </div>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary rounded-pill px-3">
          <i className="bi bi-camera-video me-2"></i>
          Join Call
        </button>

        <button
          className="btn btn-light rounded-circle"
          title="Share"
        >
          <i className="bi bi-share"></i>
        </button>

        <button
          className="btn btn-light rounded-circle"
          title="More"
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>
    )
}

export default ChatHeader