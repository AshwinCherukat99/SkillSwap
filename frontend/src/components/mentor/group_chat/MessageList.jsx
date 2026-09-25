import React,{useEffect,useRef} from 'react'
import MessageBubble from './MessageBubble'

const MessageList=({messages,currentUserId,currentUserType,loading})=>{
    const messagesEndRef=useRef(null)
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({
            behaviour:'smooth',
        })
    },[messages])
    if (loading){
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" />
      </div>
    }
    return (
        <div className="chat-messages flex-grow-1 overflow-auto p-4">
      {messages.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center text-muted">
          <div className="text-center">
            <i className="bi bi-chat-dots fs-1"></i>
            <p className="mt-2">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
          />
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
    )
} 

export default MessageList