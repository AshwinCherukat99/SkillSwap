import React from 'react'
import Navbar from '../components/user/navbar/Navbar'
import SkillSwapChatbot from '../components/chatbot/SkillSwapChatbot'
import {Outlet} from 'react-router-dom'
import api from '../services/api'

import useRealtimeNotifications from '../hooks/useRealtimeNotifications'

function MainLayout({children}){
    useRealtimeNotifications('access_token')
    return (
        <>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
        <SkillSwapChatbot apiClient={api}/>
        </>
    )
}

export default MainLayout