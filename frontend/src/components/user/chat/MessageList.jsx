import React,{useEffect,useRef} from "react";   

import MessageBubble from "./MessageBubble";

const MessageList=({
    messages,
    currentUserId,
    loading,
})=>{
    const bottomRef=useRef(null)
    useEffect(()=>{
        bottomRef.current?.scrollIntoView({
            behaviour:'smooth',
        })
    },[messages])
    if (loading){
        return (
            <div className="chat-messages d-flex justify-content-center align-items-center">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-2 mb-0">
                        Loading messages...
                    </p>

                </div>

            </div>
        )
    }
    return (
        <div className="chat-messages">

            {messages.length === 0 ? (

                <div className="empty-chat">

                    <div className="empty-chat-icon">

                        <i className="bi bi-chat-dots"></i>

                    </div>

                    <h5 className="fw-bold">
                        No messages yet
                    </h5>

                    <p className="text-muted mb-0">
                        Start the conversation with your study group.
                    </p>

                </div>

            ) : (

                messages.map((message, index) => (

                    <MessageBubble
                        key={
                            message.id ||
                            `${message.created_at}-${index}`
                        }
                        message={message}
                        currentUserId={currentUserId}
                    />

                ))

            )}

            <div ref={bottomRef} />

        </div>
    )
}

export default MessageList