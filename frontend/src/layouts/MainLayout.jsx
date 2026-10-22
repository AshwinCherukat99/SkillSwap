import React from 'react'
import Navbar from '../components/user/navbar/Navbar'
import {Outlet} from 'react-router-dom'

import useRealtimeNotifications from '../hooks/useRealTimeNotifications'

function MainLayout({children}){
    useRealtimeNotifications('access_token')
    return (
        <>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
        </>
    )
}

export default MainLayout