import { current } from "@reduxjs/toolkit";
import React from "react";

const MessageBubble=({
    message,
    currentUserId
})=>{
    const senderId=message.sender?.id
    const isMine=String(senderId)===String(currentUserId)
    const senderName=message.sender?.username||'Member' 
    return (
        <div
            className={`message-row ${
                isMine
                    ? 'message-row-sent'
                    : 'message-row-received'
            }`}
        >

            {!isMine && (

                <div className="message-avatar">

                    {senderName
                        .charAt(0)
                        .toUpperCase()}

                </div>

            )}


            <div
                className={`message-wrapper ${
                    isMine
                        ? 'message-wrapper-sent'
                        : ''
                }`}
            >

                {!isMine && (

                    <div className="message-sender">

                        {senderName}

                        {message.sender?.type && (
                            <span className="ms-2 text-muted">
                                {message.sender.type}
                            </span>
                        )}

                    </div>

                )}


                <div
                    className={`message-bubble ${
                        isMine
                            ? 'message-sent'
                            : 'message-received'
                    }`}
                >

                    <div>
                        {message.content}
                    </div>

                    <div className="message-time">
                        {formatTime(
                            message.created_at
                        )}
                    </div>

                </div>

            </div>

        </div>
    )
}

const formatTime = (dateString) => {

    if (!dateString) {
        return ''
    }

    return new Date(
        dateString
    ).toLocaleTimeString(
        [],
        {
            hour: 'numeric',
            minute: '2-digit',
        }
    )
}

export default MessageBubble