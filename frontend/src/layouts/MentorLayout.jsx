import React from "react";
import MentorNavbar from "../components/mentor/navbar/MentorNavbar";
import SkillSwapChatbot from "../components/chatbot/SkillSwapChatbot";
import { Outlet } from "react-router-dom";
import mentorApi from '../services/mentorApi'

import useRealtimeNotifications from "../hooks/useRealtimeNotifications";

function MentorLayout({children}){
    useRealtimeNotifications('mentor_access_token')
    return (
        <>
        <MentorNavbar/>
        <main>
            <Outlet/>
        </main>
        <SkillSwapChatbot apiClient={mentorApi}/>
        </>
    )
}

export default MentorLayout