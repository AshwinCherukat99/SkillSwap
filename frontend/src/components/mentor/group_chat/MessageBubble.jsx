import React from 'react'

const MessageBubble=({message,currentUserId,currentUserType})=>{
    const senderId=message.sender?.id 
    const isMine=Number(senderId)===Number(currentUserId) && message.sender?.type===currentUserType
    const isMentor=message.sender?.type==='MENTOR'
    return (
        <div
      className={`d-flex gap-3 mb-4 ${
        isMine ? "justify-content-end" : ""
      }`}
    >
      {!isMine && (
        <div className="chat-avatar">
          {message.sender?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}

      <div
        className={`message-container ${
          isMine ? "text-end" : ""
        }`}
      >
        <div
          className={`d-flex align-items-center gap-2 mb-1 ${
            isMine ? "justify-content-end" : ""
          }`}
        >
          <span className="small fw-bold">
            {isMine ? "You" : message.sender?.username}
          </span>

          {isMentor && (
            <span className="badge bg-success-subtle text-success">
              Mentor
            </span>
          )}

          <span className="text-muted message-time">
            {formatTime(message.created_at)}
          </span>
        </div>

        <div
          className={`message-bubble ${
            isMine
              ? "my-message"
              : "other-message"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
    )
}
const formatTime=(dateString)=>{
    if (!dateString) return ""
    return new Date(dateString).toLocaleTimeString([],{
        hour:'2-digit',
        minute:'2-digit',
    })
}

export default MessageBubble