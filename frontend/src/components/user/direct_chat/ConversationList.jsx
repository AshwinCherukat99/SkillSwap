import React, {
    useMemo,
    useState
} from "react";

import ConversationCard
    from "./ConversationCard";

const ConversationList = ({
    conversations,
    selectedConversation,
    onSelectConversation
}) => {

    const [search, setSearch] =
        useState("");


    const filteredConversations =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return conversations;
            }

            return conversations.filter(
                (conversation) =>
                    conversation.name
                        ?.toLowerCase()
                        .includes(query)
            );

        }, [
            conversations,
            search
        ]);


    return (

        <section className="conversation-panel">

            <div className="conversation-panel-content">

                <div className="conversation-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="conversation-filter-pills">

                    <button className="active">
                        All
                    </button>

                    <button>
                        Unread
                    </button>

                    <button>
                        Online
                    </button>

                    <button>
                        Mentors
                    </button>

                </div>


                <div className="conversation-list">

                    {filteredConversations.length ===
                    0 ? (

                        <div className="empty-conversations">
                            No conversations found.
                        </div>

                    ) : (

                        filteredConversations.map(
                            (conversation) => (

                                <ConversationCard
                                    key={
                                        conversation.id
                                    }
                                    conversation={
                                        conversation
                                    }
                                    selected={
                                        selectedConversation?.id ===
                                        conversation.id
                                    }
                                    onClick={() =>
                                        onSelectConversation(
                                            conversation
                                        )
                                    }
                                />

                            )
                        )

                    )}

                </div>

            </div>

        </section>

    );
};

export default ConversationList;