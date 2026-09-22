import React from 'react'
import {useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
import {Bell,MessageSquare,LogOut} from 'lucide-react'
import { logout } from '../../../store/slices/authSlice'

import './Navbar.css'

const Navbar=()=>{
    const dispatch=useDispatch()
    const navItems=[
        {name:"Home",path:'/feed'},
        {name:"My Skills",path:'/my_skills'},
        {name:"My Profile",path:'/profile'},
        {name:"Mentors",path:'/mentors'},
        { name: "Upcoming Sessions", path: "/upcoming_sessions" },
        { name: "Session History", path: "/session_history" },
    { name: "Settings", path: "/settings" },
    { name: "My Posts", path: "/my_posts" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "Badges", path: "/badges" },
    { name: "Friends", path: "/friends" },
    { name: "Courses", path: "/courses" },
    { name: "Certificates", path: "/certificates" },
    ]
    const handleLogout=()=>{
            dispatch(logout())
            navigate('/login/')
        }
    return (
        <nav className="navbar skillswap-navbar">
      <div className="container-fluid">

        {/* Logo */}
        <NavLink to="/" className="navbar-brand skillswap-logo">
          SkillSwap
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar-nav skillswap-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link skillswap-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Notification, Chat and Logout */}
        <div className="skillswap-actions">

          {/* Notification */}
          <NavLink to="/notifications/" className="icon-btn" title="Notifications">
            <Bell size={20} />
          </NavLink>

          {/* Chat */}
          <NavLink to='/chat/' className='icon-btn' title='Chat'>
            <MessageSquare size={20} />
          </NavLink>
          
          {/* Logout */}
          <button type='button' className="icon-btn" title="Logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>

        </div>

      </div>
    </nav>
    )
}

export default Navbar