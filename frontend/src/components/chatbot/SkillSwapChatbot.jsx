import { useCallback,useEffect,useRef,useState } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import './SkillSwapChatbot.css'

const BASE='/chatbot/conversations/'

const suggestions=[
    'How do I enroll in a course?',
    'How can I become a mentor?',
    'How do I use this app?',
    'How can I find mentors for a subject?'
]

function BotIcon(){
    return (
        <span className="material-symbols-outlined ss-bot-icon">
            auto-awesome
        </span>
    )
}

function Message({item}){
    const isUser=item.role==='USER'
    return (
        <div className={`ss-message ${isUser ? "ss-user-message" : "ss-ai-message"}`}>

            {!isUser && (
                <div className="ss-avatar">
                    <BotIcon />
                </div>
            )}

            <div className="ss-message-body">

                <div className={`ss-bubble ${isUser ? "ss-user-bubble" : "ss-ai-bubble"}`}>

                    {isUser ? (
                        <div className="ss-user-text">
                            {item.content}
                        </div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({ node, ...props }) => (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noreferrer"
                                    />
                                ),

                                pre: ({ node, ...props }) => (
                                    <pre className="ss-code" {...props} />
                                ),

                                code: ({ node, className, children, ...props }) =>
                                    className ? (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="ss-inline-code" {...props}>
                                            {children}
                                        </code>
                                    )
                            }}
                        >
                            {item.content}
                        </ReactMarkdown>
                    )}

                </div>

                <div className="ss-message-time">
                    {item.created_at
                        ? new Date(item.created_at).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })
                        : "Just now"}
                </div>

            </div>
        </div>
    )
}

export default function SkillSwapChatbot({
    apiClient,
    initialOpen=false
}){
    const [open,setOpen]=useState(initialOpen)
    const [minimized,setMinimized]=useState(false)
    const [conversationId,setConversationId]=useState(null)
    const [messages,setMessages]=useState([])
    const [input,setInput]=useState('')
    const [loading,setLoading]=useState(false)
    const [initializing,setInitializing]=useState(true)
    const [error,setError]=useState('')
    const textarea=useRef(null)
    const bottom=useRef(null)
    const newConversation=useCallback(async ()=>{
        const {data}=await apiClient.post(BASE,{
            title:'New Conversation'
        })
        setConversationId(data.id)
        setMessages(data.messages||[])
        return data.id
    },[apiClient])
    useEffect(()=>{
        let cancelled=false
        async function initailize(){
            try{
                setInitializing(true)
                const {data}=await apiClient.get(BASE)
                if (cancelled) return
                if (Array.isArray(data) && data.length>0){
                    const latest=await apiClient.get(
                        `${BASE}${data[0].id}`
                    )
                    if (cancelled) return
                    setConversationId(latest.data.id)
                    setMessages(latest.data.messages||[])
                } 
            }catch(err){
                if (!cancelled){
                    setError(
                        err.response?.data?.error||'unable to load chat history'
                    )
                }
            }finally{
                if (!cancelled){
                    setInitializing(false)
                }
            }
        }
        initailize()
        return ()=>{
            cancelled=true
        }
    },[apiClient])
    useEffect(()=>{
        bottom.current?.scrollIntoView({
            behavior:'smooth',
            block:'end'
        })
    },[messages,loading])
    const send=useCallback(async (value)=>{
        const content=value.trim()
        if (!content||loading) return
        setInput('')
        setError('')
        setLoading(true)
        if (textarea.current){
            textarea.current.style.height='auto'
        }
        const optimistic={
            id:`tmp-${Date.now()}`,
            role:'USER',
            content,
            created_at:new Date().toISOString()
        }
        setMessages(prev=>[...prev,optimistic])
        try{
            let id=conversationId
            if (!id){
                id=await newConversation()
            }
            const {data}=await apiClient.post(
                `${BASE}${id}/messages/`,
                {content}
            )
            setMessages(prev=>[
                ...prev.filter(
                    m=>m.id!==optimistic.id
                ),
                data.user_message,
                data.assistant_message,
            ])
        }catch(err){
            const saved=err.response?.data?.user_message
            if (saved){
                setMessages(prev=>[
                    ...prev.filter(m=>m.id!==optimistic.id),
                    saved
                ])
            }
            setError(err.response?.data?.error||
                'the assistant couldnt respond, please try again'
            )
        }finally{
            setLoading(false)
        }
    },[apiClient,conversationId,loading,newConversation])
    const submit=(e)=>{
        e.preventDefault()
        send(input)
    }
    const keyDown=(e)=>{
        if (e.key=='Enter' && !e.shiftKey){
            e.preventDefault()
            send(input)
        }
    }
    const changeInput=(e)=>{
        setInput(e.target.value)
        e.target.style.height='auto'
        e.target.style.height=`${Math.min(
            e.target.scrollHeight,
            96
        )}px`
    }
    const restart=async ()=>{
        if (loading) return
        setError('')
        try{
            await newConversation()
            textarea.current?.focus()
        }catch(err){
            setError(err.response?.data?.error||'unable to start a new conversation')
        }
    }
    return (
        <div className="ss-chat-root">

            {/* Expanded chatbot window */}
            {open && !minimized && (

                <section
                    className="ss-chat-window shadow-lg"
                    aria-label="SkillSwap AI chatbot"
                >

                    {/* Header */}
                    <header className="ss-chat-header">

                        <div className="d-flex align-items-center gap-2">

                            <div className="ss-avatar ss-avatar-header">
                                <BotIcon />
                            </div>

                            <div>

                                <strong className="ss-title">
                                    SkillSwap AI
                                </strong>

                                <div className="ss-status">
                                    <i />
                                    Platform Assistant
                                </div>

                            </div>

                        </div>


                        {/* Header controls */}
                        <div className="d-flex gap-1">

                            <button
                                className="btn ss-icon-button"
                                onClick={restart}
                                title="New conversation"
                                aria-label="New conversation"
                                disabled={loading}
                                type="button"
                            >
                                <span className="material-symbols-outlined">
                                    edit_square
                                </span>
                            </button>

                            <button
                                className="btn ss-icon-button"
                                onClick={() => setMinimized(true)}
                                title="Minimize"
                                aria-label="Minimize"
                                type="button"
                            >
                                <span className="material-symbols-outlined">
                                    remove
                                </span>
                            </button>

                            <button
                                className="btn ss-icon-button"
                                onClick={() => setOpen(false)}
                                title="Close"
                                aria-label="Close"
                                type="button"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                        </div>

                    </header>


                    {/* Chat messages */}
                    <div className="ss-chat-messages" aria-live="polite">

                        {initializing ? (

                            <div className="text-center text-secondary small m-auto">
                                Loading your conversations...
                            </div>

                        ) : messages.length === 0 ? (

                            /* Welcome message */
                            <div className="ss-welcome">

                                <div className="ss-avatar">
                                    <BotIcon />
                                </div>

                                <div className="ss-bubble ss-ai-bubble">

                                    <p className="fw-semibold">
                                        Hi there! Welcome to{" "}
                                        <span className="text-primary">
                                            SkillSwap AI
                                        </span>.
                                    </p>

                                    <p className="text-secondary">
                                        I'm your SkillSwap learning assistant.
                                        I can help you understand platform
                                        features, discover courses and mentors,
                                        and learn how sessions and skill exchanges work.
                                    </p>

                                    <p className="fw-semibold mb-2">
                                        What would you like help with?
                                    </p>


                                    {/* Quick suggestions */}
                                    <div className="d-flex flex-wrap gap-2">

                                        {suggestions.map(s => (

                                            <button
                                                key={s}
                                                className="btn ss-suggestion"
                                                disabled={loading}
                                                type="button"
                                                onClick={() => send(s)}
                                            >
                                                {s}
                                            </button>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        ) : (

                            messages.map(item => (

                                <Message
                                    key={item.id}
                                    item={item}
                                />

                            ))

                        )}


                        {/* Typing indicator */}
                        {loading && (

                            <div className="ss-message ss-ai-message">

                                <div className="ss-avatar">
                                    <BotIcon />
                                </div>

                                <div className="ss-typing">
                                    SkillSwap AI is thinking
                                    <span>•••</span>
                                </div>

                            </div>

                        )}


                        {/* API error */}
                        {error && (

                            <div className="alert alert-warning py-2 small mb-0">
                                {error}
                            </div>

                        )}

                        <div ref={bottom} />

                    </div>


                    {/* Message composer */}
                    <footer className="ss-composer">

                        <form
                            onSubmit={submit}
                            className="d-flex align-items-end gap-2"
                        >

                            <textarea
                                ref={textarea}
                                className="form-control ss-input"
                                rows="1"
                                value={input}
                                onChange={changeInput}
                                onKeyDown={keyDown}
                                placeholder="Ask SkillSwap AI..."
                                aria-label="Message SkillSwap AI"
                                disabled={initializing || loading}
                            />

                            <button
                                className="btn ss-send"
                                type="submit"
                                disabled={
                                    !input.trim() ||
                                    loading ||
                                    initializing
                                }
                                aria-label="Send message"
                            >

                                {loading ? (

                                    <span className="spinner-border spinner-border-sm" />

                                ) : (

                                    <span className="material-symbols-outlined">
                                        send
                                    </span>

                                )}

                            </button>

                        </form>


                        <p className="ss-disclaimer">
                            SkillSwap AI may make mistakes.
                            Verify important information.
                        </p>

                    </footer>

                </section>

            )}


            {/* Minimized launcher */}
            {open && minimized && (

                <button
                    className="btn ss-launcher shadow"
                    onClick={() => setMinimized(false)}
                    aria-label="Restore chat"
                    type="button"
                >
                    <BotIcon />
                </button>

            )}


            {/* Floating launcher */}
            {!open && (

                <button
                    className="btn ss-launcher shadow"
                    onClick={() => {
                        setOpen(true);
                        setMinimized(false);
                    }}
                    aria-label="Open SkillSwap AI"
                    type="button"
                >

                    <BotIcon />

                    <i />

                </button>

            )}

        </div>
    )
}