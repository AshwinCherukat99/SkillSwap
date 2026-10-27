import React from "react";
import MentorNavbar from "../components/mentor/navbar/MentorNavbar";
import { Outlet } from "react-router-dom";

import useRealtimeNotifications from "../hooks/useRealtimeNotifications";

function MentorLayout({children}){
    useRealtimeNotifications('mentor_access_token')
    return (
        <>
        <MentorNavbar/>
        <main>
            <Outlet/>
        </main>
        </>
    )
}

export default MentorLayout