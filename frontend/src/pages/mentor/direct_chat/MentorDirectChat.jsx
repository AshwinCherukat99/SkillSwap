import React,{useEffect,useState,useMemo,useRef} from "react";
import { useSearchParams } from "react-router-dom";

import MentorChatMessage from "../../../components/mentor/direct_chat/MentorChatMessage";

import mentorApi from "../../../services/mentorApi";

import useChatSocket from "../../../hooks/useChatSocket";

import './MentorDirectChat.css'

import {
  FaSearch,
  FaPaperPlane,
  FaArrowLeft,
  FaFilter,
} from "react-icons/fa";

const MentorDirectChat=()=>{
    const storedMentor=JSON.parse(
        localStorage.getItem('mentor')||'null'
    )
    const mentorId=storedMentor?.id
    const [searchParams]=useSearchParams()
    const requestedConversationId=searchParams.get('conversation')
    const [conversations,setConversations]=useState([])
    const [selectedConversation,setSelectedConversation]=useState(null)    
    const [messages,setMessages]=useState([])
    const [search,setSearch]=useState('')
    const [filter,setFilter]=useState('all')
    const [message,setMessage]=useState('')
    const [loadingConversations,setLoadingConversations]=useState(true)
    const [loadingMessages,setLoadingMessages]=useState(false)
    const [sending,setSending]=useState(false)
    const [error,setError]=useState('')
    const messagesEndRef=useRef(null)
    const {connected,sendMessage}=useChatSocket(
        selectedConversation?.id,
        (message)=>{
            setMessages((prev)=>[...prev,message])
        },
        'mentor_access_token'
    )
    const fetchConversations=async ()=>{
        try{
            setLoadingConversations(true)
            setError('')
            const response=await mentorApi.get('/chat/mentor/direct-chat/')
            console.log('direct chat api response:',response.data)
            const data=response.data?.data??response.data??[]
            console.log('conversation data:',data)
            setConversations(Array.isArray(data)?data:[])
        }catch(err){
            console.error('failed to load conversations:',err)
            setError('unable to load conversations')
        }finally{
            setLoadingConversations(false)
        }
    }
    useEffect(()=>{
        fetchConversations()
    },[])
    const fetchMessages=async (conversation)=>{
        if (!conversation?.id) return
        try{
            setLoadingMessages(true)
            setError('')
            const response=await mentorApi.get(`/chat/mentor/direct-chat/${conversation.id}/messages/`)
            const data=response.data?.data??response.data??[]
            setMessages(Array.isArray(data)?data:[])
            setTimeout(()=>{
                messagesEndRef.current?.scrollIntoView({
                    behaviour:'smooth'
                })
            },100)
        }catch(err){
            console.error('failed to load messages:',err)
            setError('unable to load messages')
        }finally{
            setLoadingMessages(false)
        }
    }
    useEffect(()=>{
        if (!requestedConversationId||!conversations.length){
            return
        }
        const conversation=conversations.find(
            (item)=>
                String(item.id)===String(requestedConversationId)
        )
        if (conversation){
            setSelectedConversation(conversation)
            fetchMessages(conversation)
        }
    },[requestedConversationId,conversations])
    const handleSelectConversation=(conversation)=>{
        setSelectedConversation(conversation)
        fetchMessages(conversation)
    }
    const filteredConversations=useMemo(()=>{
        let result=[...conversations]
        if (filter==='unread'){
            result=result.filter(
                (conversation)=>Number(conversation.unread_count||0)>0
            )
        }
        if (search.trim()){
            const query=search.toLowerCase()
            result=result.filter(
                (conversation)=>{
                    const student=conversation.person||{}
                    return (
                        student.full_name?.toLowerCase().includes(query)||
                        student.username?.toLowerCase().includes(query)||
                        conversation.last_message?.content?.toLowerCase().includes(query)
                    )
                }
            )
        }
        return result
    },[conversations,search,filter])
    const handleSendMessage=(e)=>{
        e.preventDefault()
        const content=message.trim()
        if (!content){
            return
        }
        if (!connected){
            console.error('chat websocket is not connected')
            return
        }
        const sent=sendMessage({
            'message':content
        })
        if (sent){
            setMessage('')
        }
    }
    const getStudent=()=>selectedConversation?.person||{}
    const formatTime=(dateString)=>{
        if (!dateString) return ''
        return new Date(dateString).toLocaleTimeString([],{
            hour:'numeric',
            minute:'2-digit',
        })
    }
    const unreadCount=conversations.reduce(
        (total,conversation)=>
            total+Number(conversation.unread_count||0),
        0
    )
    return (
        <div className="mentor-chat-page">
      <div className="container-fluid h-100">
        <div className="chat-workspace">

          {/* ======================================
              LEFT — CONVERSATIONS
          ====================================== */}

          <aside className="chat-sidebar">

            <div className="sidebar-header">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h5 className="mb-1 fw-bold">
                    Student Messages
                  </h5>

                  <span className="badge bg-primary-subtle text-primary">
                    {conversations.length} Active
                  </span>
                </div>

                <button className="btn btn-light btn-sm">
                  <FaFilter />
                </button>

              </div>

              {/* Filters */}

              <div className="btn-group w-100 mb-3">

                <button
                  className={`btn btn-sm ${
                    filter === "all"
                      ? "btn-primary"
                      : "btn-light"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={`btn btn-sm ${
                    filter === "unread"
                      ? "btn-primary"
                      : "btn-light"
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  Unread

                  {unreadCount > 0 && (
                    <span className="badge bg-danger ms-1">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  className={`btn btn-sm ${
                    filter === "recent"
                      ? "btn-primary"
                      : "btn-light"
                  }`}
                  onClick={() => setFilter("recent")}
                >
                  Recent
                </button>

              </div>

              {/* Search */}

              <div className="input-group">

                <span className="input-group-text bg-light border-0">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              <small className="text-muted d-block mt-2">
                Mentors can only message enrolled and
                eligible students.
              </small>

            </div>

            {/* Conversation list */}

            <div className="conversation-list">

              {loadingConversations && (
                <div className="p-4 text-center text-muted">
                  Loading conversations...
                </div>
              )}

              {!loadingConversations &&
                filteredConversations.length === 0 && (
                  <div className="empty-conversations">
                    <div className="empty-icon">
                      <FaSearch />
                    </div>

                    <h6>No conversations found</h6>

                    <p>
                      Student conversations will appear here.
                    </p>
                  </div>
                )}

              {filteredConversations.map((conversation) => {

                const student = conversation.person || {};
                const isSelected =
                  selectedConversation?.id === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`conversation-item ${
                      isSelected ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSelectConversation(conversation)
                    }
                  >

                    <div className="position-relative">

                      {student.profile_image ? (
                        <img
                          src={student.profile_image}
                          alt={student.full_name}
                          className="avatar"
                        />
                      ) : (
                        <div className="avatar avatar-placeholder">
                          {student.full_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                      )}

                    </div>

                    <div className="conversation-info">

                      <div className="d-flex justify-content-between">

                        <strong>
                          {student.full_name ||
                            student.username}
                        </strong>

                        <small>
                          {formatTime(
                            conversation.last_message?.created_at
                          )}
                        </small>

                      </div>

                      <div className="d-flex justify-content-between">

                        <p className="last-message">
                          {conversation.last_message?.content ||
                            "No messages yet"}
                        </p>

                        {conversation.unread_count > 0 && (
                          <span className="unread-badge">
                            {conversation.unread_count}
                          </span>
                        )}

                      </div>

                    </div>

                  </button>
                );
              })}

            </div>

            <div className="sidebar-footer">
              🔒 Protected learner channel
            </div>

          </aside>

          {/* ======================================
              RIGHT — CHAT WINDOW
          ====================================== */}

          {!selectedConversation ? (

            <section className="chat-empty">

              <div className="empty-chat-icon">
                💬
              </div>

              <h4>Select a conversation</h4>

              <p>
                Choose a student from your conversations
                to start messaging.
              </p>

            </section>

          ) : (

            <section className="chat-window">

              {/* Header */}

              <header className="chat-header">

                <div className="d-flex align-items-center gap-3">

                  <button
                    className="btn btn-light d-lg-none"
                    onClick={() =>
                      setSelectedConversation(null)
                    }
                  >
                    <FaArrowLeft />
                  </button>

                  {getStudent().profile_image ? (
                    <img
                      src={getStudent().profile_image}
                      alt={getStudent().full_name}
                      className="chat-avatar"
                    />
                  ) : (
                    <div className="chat-avatar avatar-placeholder">
                      {getStudent().full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <div>

                    <div className="d-flex align-items-center gap-2">

                      <h6 className="mb-0 fw-bold">
                        {getStudent().full_name}
                      </h6>

                      </div>

                    <small className="text-muted">
                      @{getStudent().username}
                    </small>

                    </div>

                </div>

              </header>

              {/* Messages */}

              <div className="messages-container">

                {loadingMessages ? (
                  <div className="text-center text-muted p-4">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (

                  <div className="no-messages">
                    <h6>No messages yet</h6>

                    <p>
                      Start the conversation with your
                      student.
                    </p>
                  </div>

                ) : (

                  messages.map((msg) => (
                    <MentorChatMessage
                      key={msg.id}
                      message={msg}
                      mentorId={mentorId}
                    />
                  ))

                )}

                <div ref={messagesEndRef} />

              </div>

              {/* Error */}

              {error && (
                <div className="alert alert-danger m-3 mb-0">
                  {error}
                </div>
              )}

              {/* Composer */}

              <footer className="message-composer">

                <form onSubmit={handleSendMessage}>

                  <div className="composer-box">

                    <textarea
                      className="form-control"
                      rows="1"
                      placeholder={`Type your reply to ${
                        getStudent().full_name || "student"
                      }...`}
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />

                    <button
                      type="submit"
                      className="btn btn-primary send-button"
                      disabled={
                        !message.trim() || sending
                      }
                    >
                      <FaPaperPlane />
                    </button>

                  </div>

                  <small className="text-muted">
                    Press Enter to send • Shift + Enter
                    for a new line
                  </small>

                </form>

              </footer>

            </section>
          )}

        </div>
      </div>

    </div>
    )
}

export default MentorDirectChat