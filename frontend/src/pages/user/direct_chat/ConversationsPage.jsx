import React, {
    useEffect,
    useState
} from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../../services/api";

import ChatSidebar
    from "../../../components/user/direct_chat/ChatSidebar";

import ConversationList
    from "../../../components/user/direct_chat/ConversationList";

import ChatWindow
    from "../../../components/user/direct_chat/ChatWindow";

import "./ConversationsPage.css";


const ConversationsPage = ({
    user
}) => {

    const [searchParams]=useSearchParams()
    const conversationId=searchParams.get('conversation')
    const [
        conversations,
        setConversations
    ] = useState([]);

    const [
        selectedConversation,
        setSelectedConversation
    ] = useState(null);

    const [
        activeFilter,
        setActiveFilter
    ] = useState("all");

    const [
        loading,
        setLoading
    ] = useState(true);


    useEffect(() => {

        const loadConversations =
            async () => {

                try {

                    setLoading(true);

                    const response =
                        await api.get(
                            "/chat/conversations/"
                        );

                    setConversations(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "Failed to load conversations:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadConversations();

    }, []);

    useEffect(()=>{
        if (!conversationId||conversations.length===0){
            return
        }
        const conversation=conversations.find(
            (item)=>
                String(item.id)===String(conversationId)
        )
        if (conversation){
            setSelectedConversation(conversation)
        }
    },[conversationId,conversations])

    const filteredConversations =
        conversations.filter(
            (conversation) => conversation.conversation_type==='DIRECT'
        ).filter(
            (conversation)=>{

                if (activeFilter==='all'){
                    return true
                }

                if (activeFilter==='unread'){
                    return (conversation.unread_count>0)
                }

                if (activeFilter==='mentors'){
                    return (conversation.person?.type==='MENTOR')
                }

                if (activeFilter==='users'){
                    return (conversation.person?.type==='USER')
                }

                

                return true;

            }
        );


    return (

        <div className="conversations-page">

            
            <main className="conversations-layout">

                <ChatSidebar
                    activeFilter={
                        activeFilter
                    }
                    setActiveFilter={
                        setActiveFilter
                    }
                />


                <ConversationList
                    conversations={
                        filteredConversations
                    }
                    selectedConversation={
                        selectedConversation
                    }
                    onSelectConversation={
                        setSelectedConversation
                    }
                />


                <ChatWindow
                    conversation={
                        selectedConversation
                    }
                />


                </main>

        </div>

    );
};

export default ConversationsPage;