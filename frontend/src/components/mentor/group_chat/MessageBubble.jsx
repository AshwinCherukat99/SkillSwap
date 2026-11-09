import React from 'react'
import { BACKEND_ORIGIN } from '../../../config'

const MessageBubble=({message,currentUserId,currentUserType})=>{
    const senderId=message.sender?.id 
    const isMine=Number(senderId)===Number(currentUserId) && message.sender?.type===currentUserType
    const isMentor=message.sender?.type==='MENTOR'
    console.log(
      'mentor chat message:',{
        id:message.id,
        content:message.content,
        sender:message.sender,
        currentUserId,
        currentUserType,
        isMine,
      }
    )
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

        <div className={`message-bubble ${isMine ? "my-message" : "other-message"}`}>
    {message.content&&(<span className="message-text">
        {message.content}
    </span>)}
    {message.attachments?.map((attachment)=>{
      const fileUrl=attachment.file_url||attachment.file
      const fullUrl=fileUrl?fileUrl.startsWith('http')?fileUrl:`${BACKEND_ORIGIN}${fileUrl}`:null
      return (
        <div
                                key={attachment.id}
                                className="message-attachment"
                            >
                                <i className="bi bi-file-earmark me-2" />

                                {fullUrl ? (
                                    <a
                                        href={fullUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {attachment.original_name || 'View attachment'}
                                    </a>
                                ) : (
                                    <span>
                                        {attachment.original_name || 'Attachment unavailable'}
                                    </span>
                                )}

                                <small className="text-muted ms-2">
                                    {(
                                        (attachment.file_size || 0) / 1024
                                    ).toFixed(1)} KB
                                </small>
                            </div>
                        );
                    
    })}
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