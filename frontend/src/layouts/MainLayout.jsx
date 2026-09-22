import React from 'react'
import Navbar from '../components/user/navbar/Navbar'
import {Outlet} from 'react-router-dom'

function MainLayout({children}){
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