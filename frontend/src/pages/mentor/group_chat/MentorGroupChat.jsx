import React,{useRef,useState,useEffect} from 'react'
import mentorApi from '../../../services/mentorApi'

import GroupList from '../../../components/mentor/group_chat/GroupList'
import ChatWindow from '../../../components/mentor/group_chat/ChatWindow' 
import MembersPanel from '../../../components/mentor/group_chat/MembersPanel'
import ResourcesPanel from '../../../components/mentor/group_chat/ResourcesPanel'

import './MentorGroupChat.css' 

const MentorGroupChat=()=>{
    const [groups,setGroups]=useState([])
    const [selectedGroup,setSelectedGroup]=useState(null)
    const [messages,setMessages]=useState([])
    const [members,setMembers]=useState([])
    const [resources,setResources]=useState([])
    const [loadingGroups,setLoadingGroups]=useState(true)
    const [loadingMessages,setLoadingMessages]=useState(false)
    const [connected,setConnected]=useState(false)
    const socketRef=useRef(null)
    const accessToken=localStorage.getItem('mentor_access_token')||sessionStorage.getItem('mentor_access_token')
    const currentUserId=getMentorIdFromToken(accessToken)
    useEffect(()=>{
        fetchGroups()
    },[])
    const fetchGroups=async ()=>{
        try{
            setLoadingGroups(true)
            const response=await mentorApi.get(
                '/chat/mentor/groups/'
            )
            setGroups(response.data)
            if (response.data.length>0){
                setSelectedGroup(response.data[0])
            }
        }catch(error){
            console.error('failed to load study groups:',error)
        }finally{
            setLoadingGroups(false)
        }
    }
    useEffect(()=>{
        if (!selectedGroup) return
        fetchGroupData(selectedGroup.id)
        connectWebSocket(selectedGroup.id) 
        return ()=>{
            disconnectWebSocket()
        }
    },[selectedGroup])
    const fetchGroupData=async (conversationId)=>{
        try{
            setLoadingMessages(true)
            const [messagesResponse,membersResponse]=await Promise.all([
                mentorApi.get(
                    `/chat/conversations/${conversationId}/messages/`
                ),
                mentorApi.get(
                    `/chat/conversations/${conversationId}/members/`
                )
            ])
            setMessages(messagesResponse.data)
            setMembers(membersResponse.data)
            setResources([])
        }catch(error){
            console.error(
                'failed to load group data:',
                error
            )
        }finally{
            setLoadingMessages(false)
        }
    }
    const connectWebSocket=(conversationId)=>{
        if (!accessToken){
            console.error('no access token found')
            return
        }
        const wsUrl=`ws://127.0.0.1:8000/ws/chat/`+`${conversationId}/?token=${accessToken}`
        const socket=new WebSocket(wsUrl)
        socketRef.current=socket 
        socket.onopen=()=>{
            console.log('websocket connected')
            setConnected(true)
        } 
        socket.onmessage=(event)=>{
            try{
                const data=JSON.parse(event.data)
                if (data.type==='message'){
                    setMessages((previous)=>[
                        ...previous,
                        data.message,
                    ])
                }
            }catch(error){
                console.error(
                    'invalid websocket message:',
                    error
                )
            }
        }
        socket.onclose=()=>{
            console.log('websocket disconnected')
            setConnected(false)
        }
        socket.onerror=(error)=>{
            console.log('websocket error:',error)
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
        if (socketRef.current && socketRef.current.readyState===WebSocket.OPEN){
            socketRef.current.send(
                JSON.stringify({
                    message,
                })
            )
        }
    }
    return (
        <div className="mentor-chat-page">
      {/* Page Header */}

      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary mb-1">
              Study Groups
            </h2>

            <p className="text-muted mb-0">
              Build collaborative learning communities
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="input-group search-box">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search groups..."
              />
            </div>

            <button className="btn btn-light rounded-circle">
              <i className="bi bi-bell"></i>
            </button>
          </div>
        </div>

        {/* Dashboard */}

        <div className="row g-3 chat-dashboard">

          {/* Groups */}

          <div className="col-lg-3 col-xl-3">
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              loading={loadingGroups}
            />
          </div>

          {/* Chat */}

          <div className="col-lg-6 col-xl-6">
            <ChatWindow
              group={selectedGroup}
              messages={messages}
              currentUserId={currentUserId}
              loadingMessages={loadingMessages}
              onSend={sendMessage}
              connected={connected}
            />
          </div>

          {/* Right Panel */}

          <div className="col-lg-3 col-xl-3">
            <div className="d-flex flex-column gap-3 h-100">

              <ResourcesPanel
                resources={resources}
              />

              <div className="flex-grow-1">
                <MembersPanel
                  members={members}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
    )
} 
const getMentorIdFromToken=(token)=>{
        if (!token) return null
        try{
            const payload=JSON.parse(
                atob(token.split('.')[1])
            )
            return payload.mentor_id
        }catch{
            return null
        }
    }
export default MentorGroupChat