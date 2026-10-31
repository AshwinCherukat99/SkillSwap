import React, {
    useEffect,
    useRef,
    useState,
    useCallback
} from "react";

import api from "../../../services/api";
import useChatSocket
    from "../../../hooks/useChatSocket";


const ChatWindow = ({
    conversation
}) => {
    const user=JSON.parse(
        localStorage.getItem('user')
    )

    const currentUserId=user?.id

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const messagesEndRef =
        useRef(null);


    /*
     * Load previous messages
     */
    useEffect(() => {

        if (!conversation?.id) {
            return;
        }

        const loadMessages = async () => {

            try {

                const response =
                    await api.get(
                        `/chat/conversations/direct/${conversation.id}/messages/`
                    );

                setMessages(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );

            }

        };

        loadMessages();

    }, [conversation?.id]);


    /*
     * Receive realtime messages
     */
    const handleIncomingMessage = useCallback((
        incomingMessage
    ) => {

        setMessages((previous) => [
            ...previous,
            incomingMessage
        ]);

    },[]);


    const {
        connected,
        sendMessage
    } = useChatSocket(
        conversation?.id,
        handleIncomingMessage
    );


    /*
     * Scroll to latest message
     */
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    const handleSubmit = (e) => {

        e.preventDefault();

        const trimmed =
            message.trim();

        if (!trimmed) {
            return;
        }

        const sent =
            sendMessage({message:trimmed});

        if (sent) {
            setMessage("");
        }

    };


    if (!conversation) {

        return (
            <div className="chat-window-empty">

                <div>
                    💬
                </div>

                <h3>
                    Select a conversation
                </h3>

                <p>
                    Choose a conversation to
                    start chatting.
                </p>

            </div>
        );

    }


    return (

        <section className="chat-window">

            {/* Header */}

            <div className="chat-window-header">

                <div>

                    <h3>
                        {conversation.person?.name||conversation.person?.username||conversation.name||'Conversation'}
                    </h3>

                    <span
                        className={
                            connected
                                ? "online"
                                : "offline"
                        }
                    >
                        {connected
                            ? "Connected"
                            : "Connecting..."}
                    </span>

                </div>

            </div>


            {/* Messages */}

            <div className="chat-messages">

                {messages.map(
                    (item) => {

                        const isOwnMessage=Number(item.sender?.id)===Number(currentUserId)
                        return (
                        <div
                            key={item.id}
                            className={isOwnMessage?"chat-message own-message":"chat-message received-message"}
                        >

                            <div className="message-sender">

                                {item.sender?.username}

                            </div>

                            <div className="message-bubble">

                                {item.content}

                            </div>

                            <small>

                                {new Date(
                                    item.created_at
                                ).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "numeric",
                                        minute: "2-digit"
                                    }
                                )}

                            </small>

                        </div>
                        )
                            }
                )}

                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* Input */}

            <form
                className="chat-message-input"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                    placeholder="Write a message..."
                />

                <button
                    type="submit"
                    disabled={!connected}
                >
                    Send
                </button>

            </form>

        </section>

    );
};

export default ChatWindow;