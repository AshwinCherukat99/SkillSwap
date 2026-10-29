import {useEffect,useRef,useState} from 'react'
import {useDispatch} from 'react-redux'
import { NavLink,useNavigate } from 'react-router-dom'
import {Bell,MessageSquare,LogOut,UserRound,ChevronDown} from 'lucide-react'
import { logout } from '../../../store/slices/authSlice'

import './Navbar.css'

const mainNavItems=[
        {name:"Home",path:'/feed'},
        {name:"My Skills",path:'/my_skills'},
        {name:"Mentors",path:'/mentors'},
        { name: "Upcoming Sessions", path: "/upcoming_sessions" },
    { name: "Group Chats", path: "/chat" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "Friends", path: "/friends" },
    { name: "Courses", path: "/courses" },
    ]

    const profileNavItems=[
      {name:"My Profile",path:'/profile'},
      { name: "Session History", path: "/session_history" },    
      { name: "My Posts", path: "/my_posts" },
      { name: "Leaderboard", path: "/leaderboard" },
      { name: "Badges", path: "/badges" },
      { name: "Certificates", path: "/certificates" },
    ]

const Navbar=()=>{
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const dropDownRef=useRef(null)
    const [profileOpen,setProfileOpen]=useState(false)
    useEffect(()=>{
      const handleOutsideClick=(event)=>{
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)){
          setProfileOpen(false)
        }
      }
      const handleEscape=(event)=>{
        if (event.key==='Escape'){
          setProfileOpen(false)
        }
      }
      document.addEventListener('mousedown',handleOutsideClick)
      document.addEventListener('keydown',handleEscape)   
      return ()=>{
        document.removeEventListener('mousedown',handleOutsideClick)
        document.removeEventListener('keydown',handleEscape)
      }
    },[])
    const handleLogout=()=>{
            setProfileOpen(false)
            dispatch(logout())
            navigate('/login/')
        }
    return (
        <nav className="navbar skillswap-navbar">
            <div className="container-fluid skillswap-navbar-inner">
                <NavLink to="/" className="navbar-brand skillswap-logo">
                    SkillSwap
                </NavLink>

                <div className="navbar-nav skillswap-nav">
                    {mainNavItems.map((item) => (
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

                <div className="skillswap-actions">
                    <NavLink
                        to="/notifications/"
                        className="icon-btn"
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                    </NavLink>

                    <NavLink
                        to="/direct-chat/"
                        className="icon-btn"
                        title="Chat"
                        aria-label="Chat"
                    >
                        <MessageSquare size={20} />
                    </NavLink>

                    <div className="profile-dropdown" ref={dropdownRef}>
                        <button
                            type="button"
                            className={`profile-trigger ${
                                profileOpen ? "open" : ""
                            }`}
                            onClick={() =>
                                setProfileOpen((previous) => !previous)
                            }
                            aria-expanded={profileOpen}
                            aria-haspopup="menu"
                            aria-label="Open profile menu"
                        >
                            <span className="profile-avatar">
                                <UserRound size={19} />
                            </span>
                            <ChevronDown
                                size={15}
                                className="profile-chevron"
                            />
                        </button>

                        {profileOpen && (
                            <div className="profile-menu" role="menu">
                                <div className="profile-menu-heading">
                                    <span className="profile-avatar">
                                        <UserRound size={19} />
                                    </span>
                                    <div>
                                        <strong>My Account</strong>
                                        <span>Manage your profile</span>
                                    </div>
                                </div>

                                <div className="profile-menu-divider" />

                                {profileNavItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        role="menuitem"
                                        className={({ isActive }) =>
                                            `profile-menu-link ${
                                                isActive ? "active" : ""
                                            }`
                                        }
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}

                                <div className="profile-menu-divider" />

                                <button
                                    type="button"
                                    className="profile-menu-link logout-link"
                                    role="menuitem"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar