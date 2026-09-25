import React,{useEffect,useState,useRef} from "react";

import api from "../../../services/api";

import './Chat.css'

import GroupChatHeader from "../../../components/user/chat/GroupChatHeader";
import MessageList from "../../../components/user/chat/MessageList";
import MessageInput from "../../../components/user/chat/MessageInput";
import GroupInfoPanel from "../../../components/user/chat/GroupInfoPanel";
import ConversationList from "../../../components/user/chat/ConversationList";

const Chat=()=>{
    const [groups,setGroups]=useState([])
    const [selectedGroup,setSelectedGroup]=useState(null)
    const [messages,setMessages]=useState([])
    const [members,setMembers]=useState([])
    const [loadingGroups,setLoadingGroups]=useState(true)
    const [loadingMessages,setLoadingMessages]=useState(false)
    const [connected,setConnected]=useState(false)
    const socketRef=useRef(null)
    const accessToken=localStorage.getItem('access_token')||sessionStorage.getItem('access_token')
    const currentUserId=getUserIdFromToken(accessToken)
    useEffect(()=>{
        fetchGroups()
    },[])
    const fetchGroups=async ()=>{
        try{
            setLoadingGroups(true)
            const response=await api.get(
                '/chat/groups/'
            )
            setGroups(response.data)
            if (response.data.length>0){
                setSelectedGroup(response.data[0])
            }
        }catch(error){
            console.error('failed to load chat groups:',error)
        }finally{
            setLoadingGroups(false)
        }
    }
    useEffect(()=>{
        if (!selectedGroup){
            setMessages([])
            setMembers([])
            return
        }
        setMessages([])
        setMembers([])
        loadGroupData(
            selectedGroup.id
        )
        connectWebSocket(
            selectedGroup.id
        )
        return ()=>{
            disconnectWebSocket()
        }
    },[selectedGroup])
    const loadGroupData=async (conversationId)=>{
        try{
            setLoadingMessages(true)
            const [messagesResponse,membersResponse]=await Promise.all([
                api.get(`/chat/conversations/${conversationId}/messages/`),
                api.get(`/chat/conversations/${conversationId}/members/`)
            ])
            setMessages(messagesResponse.data)
            setMembers(membersResponse.data)
        }catch(error){
            console.error('failed to load group data:',error)
        }finally{
            setLoadingMessages(false)
        }
    }
    const connectWebSocket=(conversationId)=>{
        if (!accessToken){
            console.error('no user access token found')
            setConnected(false)
            setConnected(false)
            return
        }
        const wsProtocol=window.location.protocol==='https:'?'wss':'ws'
        const wsHost='127.0.0.1:8000'
        const wsUrl=`${wsProtocol}://${wsHost}` +
            `/ws/chat/${conversationId}/` +
            `?token=${encodeURIComponent(
                accessToken
            )}`
        console.log('connecting user websocket')
        const socket=new WebSocket(wsUrl)
        socketRef.current=socket
        socket.onopen=()=>{
            console.log('user websocket connected')
            setConnected(true)
        }
        socket.onmessage=(event)=>{
            try{
                const data=JSON.parse(event.data)
                console.log('websocket message:',data)
                if (data.type==='message'){
                    setMessages(
                        previous=>[...previous,data.message,]
                    )
                }
            }catch(error){
                console.error('invalid websocket message:',error)
            }
        }
        socket.onerror=(error)=>{
            console.error('user websocket error:',error)
            setConnected(false)
        }
        socket.onclose=(event)=>{
            console.log(
                'user websocket disconnected',
                event.code,
                event.reason
            )
            setConnected(false)
        }
    }
    const disconnectWebSocket=()=>{
        if (socketRef.current){
            socketRef.current.close()
            socketRef.current=null
        }
        setConnected(false)
    }
    const sendMessage=(message)=>{
        if (socketRef.current&&socketRef.current.readyState===WebSocket.OPEN){
            socketRef.current.send(
                JSON.stringify({message:message})
            )
        }else{
            console.error('websocket is not connected')
        }
    }
    return (
        <div className="chat-page">

            <header className="chat-topbar">

                <div className="container-fluid">

                    <div className="d-flex align-items-center justify-content-between">

                        <div>

                            <h4 className="fw-bold text-primary mb-0">
                                SkillSwap
                            </h4>

                            <small className="text-muted">
                                Community
                            </small>

                        </div>


                        <div className="d-flex align-items-center gap-3">

                            <button
                                className="btn btn-light rounded-circle"
                                type="button"
                            >
                                <i className="bi bi-bell"></i>
                            </button>


                            <button
                                className="btn btn-light rounded-circle"
                                type="button"
                            >
                                <i className="bi bi-gear"></i>
                            </button>

                        </div>

                    </div>

                </div>

            </header>


            <main className="chat-layout">

                {/* LEFT */}

                <ConversationList
                    groups={groups}
                    selectedGroup={selectedGroup}
                    onSelectGroup={
                        setSelectedGroup
                    }
                    loading={loadingGroups}
                />


                {/* CENTER */}

                <section className="chat-main">

                    {!selectedGroup ? (

                        <div className="no-group-selected">

                            <div className="empty-chat-icon">

                                <i className="bi bi-chat-square-text"></i>

                            </div>

                            <h5 className="fw-bold">
                                No study group selected
                            </h5>

                            <p className="text-muted">
                                Join a course to participate in its study group.
                            </p>

                        </div>

                    ) : (

                        <>

                            <GroupChatHeader
                                group={selectedGroup}
                                members={members}
                                connected={connected}
                            />


                            <MessageList
                                messages={messages}
                                currentUserId={
                                    currentUserId
                                }
                                loading={
                                    loadingMessages
                                }
                            />


                            <MessageInput
                                onSend={
                                    sendMessage
                                }
                                connected={
                                    connected
                                }
                            />

                        </>

                    )}

                </section>


                {/* RIGHT */}

                {selectedGroup && (

                    <GroupInfoPanel
                        group={selectedGroup}
                        members={members}
                    />

                )}

            </main>

        </div>
    )
}

const getUserIdFromToken=(token)=>{
    if (!token){
        return null
    }
    try{
        const payload=JSON.parse(atob(token.split('.')[1]))
        return (payload.user_id||payload.user||payload.id)
    }catch(error){
        console.error('failed to decode user jwt:',error)
        return null
    }
}

export default Chat