import React from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

const ChatWindow=({
    group,
    messages,
    currentUserId,
    loadingMessages,
    onSend,
    connected
})=>{
    if (!group){
        return (
            <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-muted">
          <i className="bi bi-chat-square-text display-4"></i>
          <h5 className="mt-3">Select a study group</h5>
          <p>Choose a group from the left to start chatting.</p>
        </div>
      </div>
        )
    }
    return (
        <div className="card border-0 shadow-sm h-100 overflow-hidden">
      <ChatHeader group={group} />

      <div className="chat-status px-3 py-2 border-bottom">
        <span
          className={`status-dot ${
            connected ? "connected" : "disconnected"
          }`}
        ></span>

        {connected ? "Connected" : "Connecting..."}
      </div>

      <div className="d-flex flex-column flex-grow-1 chat-window">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          loading={loadingMessages}
        />

        <ChatInput
          onSend={onSend}
          disabled={!connected}
        />
      </div>
    </div>
    )
}

export default ChatWindow