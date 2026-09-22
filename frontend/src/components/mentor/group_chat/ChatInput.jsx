import React,{useState} from 'react'

const ChatInput=({onSend,disabled})=>{
    const [message,setMessage]=useState("")
    const handleSubmit=(e)=>{
        e.preventDefault()
        const trimmed=message.trim()
        if (!trimmed||disabled){
            return
        }
        onSend(trimmed)
        setMessage("")
    }
    const handleKeyDown=(e)=>{
        if (e.key==='Enter' && !e.shiftKey){
            e.preventDefault()
            handleSubmit(e)
        }
    }
    return (
        <form
      onSubmit={handleSubmit}
      className="chat-input-wrapper p-3 border-top bg-white"
    >
      <div className="d-flex align-items-end gap-2">
        <button
          type="button"
          className="btn btn-light rounded-circle"
          disabled={disabled}
        >
          <i className="bi bi-plus"></i>
        </button>

        <textarea
          className="form-control chat-textarea"
          placeholder="Type your message..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          type="button"
          className="btn btn-light rounded-circle"
          disabled={disabled}
        >
          <i className="bi bi-emoji-smile"></i>
        </button>

        <button
          type="submit"
          className="btn btn-primary rounded-circle send-button"
          disabled={disabled || !message.trim()}
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </form>
    )
}  

export default ChatInput