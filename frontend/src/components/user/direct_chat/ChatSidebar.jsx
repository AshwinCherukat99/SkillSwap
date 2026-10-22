import React from "react";

const ChatSidebar = ({
    activeFilter,
    setActiveFilter,
    onNewMessage
}) => {

    const filters = [
        {
            id: "all",
            label: "All Chats",
            icon: "💬"
        },
        {
            id: "unread",
            label: "Unread",
            icon: "✉"
        },
        {
            id: "mentors",
            label: "Mentors",
            icon: "🎓"
        },
        {
            id: "users",
            label: "Users",
            icon: "🧠"
        },
    ];


    return (
        <aside className="chat-left-sidebar">

            <div className="chat-sidebar-heading">

                <h2>
                    Conversations
                </h2>

                <p>
                    Manage your collaborations
                </p>

            </div>


            <div className="chat-sidebar-filters">

                {filters.map((filter) => (

                    <button
                        key={filter.id}
                        className={
                            activeFilter === filter.id
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter(
                                filter.id
                            )
                        }
                    >

                        <span>
                            {filter.icon}
                        </span>

                        {filter.label}

                    </button>

                ))}

            </div>


            <div className="chat-sidebar-bottom">

                <button
                    className="new-message-btn"
                    onClick={onNewMessage}
                >
                    ✎
                    <span>
                        New Message
                    </span>
                </button>

            </div>

        </aside>
    );
};

export default ChatSidebar;