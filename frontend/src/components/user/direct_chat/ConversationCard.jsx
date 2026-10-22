import React from "react";

const ConversationCard = ({
    conversation,
    selected,
    onClick
}) => {

    const lastMessage =
        conversation.last_message;

    const sender =
        lastMessage?.sender;

    const isGroup =
        conversation.conversation_type ===
        "GROUP";

    const person=conversation.person

    const displayName=person?.name||person?.username||conversation.name||'conversation'

    const avatar=person?.avatar||conversation.avatar||"/images/default-avatar.png";

    return (
        <div
            className={`conversation-card ${
                selected
                    ? "selected"
                    : ""
            }`}
            onClick={onClick}
        >

            <div className="conversation-avatar">

                {isGroup ? (
                    <div className="group-avatar">
                        👥
                    </div>
                ) : (
                    <img
                        src={
                            avatar ||
                            "/images/default-avatar.png"
                        }
                        alt={
                            displayName ||
                            "Conversation"
                        }
                    />
                )}

            </div>


            <div className="conversation-info">

                <div className="conversation-top">

                    <h3>
                        {displayName ||
                            "Conversation"}
                    </h3>

                    <span>
                        {lastMessage?.created_at
                            ? new Date(
                                  lastMessage.created_at
                              ).toLocaleTimeString(
                                  [],
                                  {
                                      hour: "numeric",
                                      minute: "2-digit"
                                  }
                              )
                            : ""}
                    </span>

                </div>


                <div className="conversation-bottom">

                    <p>
                        {lastMessage
                            ? lastMessage.content
                            : "No messages yet"}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ConversationCard;