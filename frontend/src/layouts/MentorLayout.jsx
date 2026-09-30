import React from "react";
import MentorNavbar from "../components/mentor/navbar/MentorNavbar";
import { Outlet } from "react-router-dom";

function MentorLayout({children}){
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