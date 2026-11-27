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

    </div>
    )
}

export default ChatHeader