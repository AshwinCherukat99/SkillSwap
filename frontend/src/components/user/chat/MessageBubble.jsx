
import React from "react";

import { BACKEND_ORIGIN } from "../../../config";

const MessageBubble = ({ message, currentUserId }) => {
    const sender = message.sender;
    const senderId = sender?.id;

    const isMine =
        sender?.type === "USER" &&
        String(senderId) === String(currentUserId);

    const senderName = sender?.username || "Member";

    return (
        <div
            className={`message-row ${
                isMine ? "message-row-sent" : "message-row-received"
            }`}
        >

            {!isMine && (
                <div className="message-avatar">
                    {senderName.charAt(0).toUpperCase()}
                </div>
            )}

            <div
                className={`message-wrapper ${
                    isMine ? "message-wrapper-sent" : ""
                }`}
            >
                {!isMine && (
                    <div className="message-sender">
                        {senderName}

                        {sender?.type && (
                            <span className="ms-2 text-muted">
                                {sender.type}
                            </span>
                        )}
                    </div>
                )}

                <div
                    className={`message-bubble ${
                        isMine ? "message-sent" : "message-received"
                    }`}
                >
                    {message.content && (
    <div className="message-content">
        {message.content}
    </div>
)}

                    {message.attachments?.map((attachment) => {
                        const fileUrl =
                            attachment.file_url || attachment.file;

                        return (
                            <div
                                key={attachment.id}
                                className="message-attachment"
                            >
                                <i className="bi bi-file-earmark-pdf me-2" />

                                {fileUrl ? (
                                    <a
                                        href={fileUrl.startsWith("http")
                                            ? fileUrl
                                            : `${BACKEND_ORIGIN}${fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {attachment.original_name ||
                                            "Open attachment"}
                                    </a>
                                ) : (
                                    <span>
                                        {attachment.original_name ||
                                            "Attachment unavailable"}
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

                    <div className="message-time">
                        {formatTime(message.created_at)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatTime = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
};

export default MessageBubble;
