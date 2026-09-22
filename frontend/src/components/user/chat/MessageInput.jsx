import React,{useEffect,useState,useRef} from "react";

const MessageInput=({onSend,connected})=>{
    const [message,setMessage]=useState('')
    const textareaRef=useRef(null)     
    useEffect(()=>{
        const textarea=textareaRef.current
        if (!textarea){
            return null
        }
        textarea.style.height='auto'
        textarea.style.height=`${Math.min(textarea.scrollHeight,130)}px`
    },[message])
    const sendMessage=()=>{
        const trimmed=message.trim()
        if (!trimmed){
            return
        }
        if (!connected){
            return
        }
        onSend(trimmed)
        setMessage('')
    }
    const handleKeyDown=(event)=>{
        if (event.key==='Enter'&&!event.shiftKey){
            event.preventDefault()
            sendMessage()
        }
    }
    return (
        <div className="chat-input-container">

            <div className="chat-input-box">

                <div className="flex-grow-1">

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        rows="1"
                        disabled={!connected}
                        className="form-control chat-textarea"
                        placeholder={
                            connected
                                ? 'Type your message...'
                                : 'Connecting to chat...'
                        }
                    />


                    <div className="chat-input-tools">

                        <button
                            type="button"
                            className="btn btn-sm btn-link text-muted"
                            disabled
                            title="Attachments coming soon"
                        >
                            <i className="bi bi-paperclip"></i>
                        </button>


                        <button
                            type="button"
                            className="btn btn-sm btn-link text-muted"
                            disabled
                            title="Emoji coming soon"
                        >
                            <i className="bi bi-emoji-smile"></i>
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary send-button"
                    onClick={sendMessage}
                    disabled={
                        !connected ||
                        !message.trim()
                    }
                >
                    <i className="bi bi-send-fill"></i>
                </button>

            </div>


            <div className="chat-input-hint">

                Press <strong>Enter</strong> to send.
                Press <strong>Shift + Enter</strong> for a new line.

            </div>

        </div>
    )
}

export default MessageInput