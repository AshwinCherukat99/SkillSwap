import React,{useCallback, useEffect,useRef,useState} from "react"

const InCallChat=({
    messages,
    onSendMessage
})=>{ 
    const [message,setMessage]=useState('')
    const messagesEndRef=useRef(null)
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({
            behaviour:'smooth',
        },[messages])
    })
    const handleSubmit=(e)=>{
        e.preventDefault()
        if (!message.trim()){
            return 
        }
        onSendMessage(message.trim())
        setMessage('')
    }
    return (
        <div className="in-call-chat">

            <div className="in-call-chat-header">
                <h3>Chat</h3>
            </div>

            <div className="in-call-chat-messages">

                {messages.length === 0 ? (

                    <div className="in-call-chat-empty">
                        <i className="bi bi-chat-dots"></i>

                        <p>
                            No messages yet
                        </p>

                        <span>
                            Start a conversation during your session.
                        </span>
                    </div>

                ) : (

                messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="chat-message"
                    >
                        <strong>
                            {msg.sender?.username}
                        </strong>

                        <small>
                            {msg.created_at?
                            new Date(msg.created_at).toLocaleTimeString([],{
                                hour:'2-digit',
                                minute:'2-digit'
                            }):''}
                        </small>

                        <p>
                            {msg.content}
                        </p>
                    </div>
                ))
            )}

            <div ref={messagesEndRef}/>

            </div>

            <form
                className="in-call-chat-input"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />

                <button type="submit"
                disabled={!message.trim()}
                title='send message'>
                    <i className="bi bi-send-fill" />
                </button>

            </form>

        </div>
    )
}

export default InCallChat