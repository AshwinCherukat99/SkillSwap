import React from "react";
import AdminNavbar from '../components/admin/navbar/AdminNavbar'
import { Outlet } from "react-router-dom";

function AdminLayout({children}){
    return (
        <>
        <AdminNavbar/>
        <main>
            <Outlet/>
        </main>
        </>
    )
}

export default AdminLayout