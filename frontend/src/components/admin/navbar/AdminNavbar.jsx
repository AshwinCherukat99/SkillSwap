import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../../store/slices/authSlice";

import './AdminNavbar.css'

const AdminNavbar=()=>{
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const navItems=[
        {name:"Dashboard",path:'/admin/dashboard'},
        {name:"Documents",path:'/admin/verification-list'},
        {name:"Notifications",path:'/admin/notification-management'},
        {name:"Courses",path:'/admin/course-management'},
        { name: "Users", path: "/admin/user-management" },
        { name: "Skills", path: "/admin/skill-management" },
        { name: "Reviews", path: "/admin/review-management" },
    { name: "Reports", path: "/admin/report-management" },
    { name: "Mentors", path: "/admin/mentor-management" },
    { name: "Badges", path: "/admin/badge-management" },
    { name: "Sessions", path: "/admin/session-management" },
    { name: "Payments", path: "/admin/payment-management" },
    ]
    const handleLogout=()=>{
        dispatch(adminLogout())
        navigate('/admin/login/')
    }
    return (
        <nav className='navbar skillswap-navbar'>
            <div className='container-fluid'>
                <NavLink to="/admin/dashboard" className="navbar-brand skillswap-logo">
          SkillSwap Admin
        </NavLink>
        <div className="navbar-nav skillswap-nav">
            {navItems.map((item)=>(
                <NavLink key={item.name} to={item.path} className={({isActive})=>`nav-link skillswap-link ${
                  isActive ? "active" : ""
                }`
}>
    {item.name}
</NavLink>
            ))}
        </div>
        <button type='button' className="icon-btn" title="Logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
            </div>
        </nav>
    )
}

export default AdminNavbar