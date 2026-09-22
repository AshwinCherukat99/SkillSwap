import React from 'react'
import {useDispatch} from 'react-redux'
import {NavLink} from 'react-router-dom'
import {MessageSquare,LogOut} from 'lucide-react'

import './MentorNavbar.css'

const MentorNavbar=()=>{
    const dispatch=useDispatch()
    const navItems=[
        {name:'Home',path:'/mentor/dashboard'},
        {name:'Students',path:'/mentor/students'},
        {name:'Courses',path:'/mentor/courses'},
        {name:'Revenue',path:'/mentor/revenue'},
        {name:'Study Group Chat',path:'/mentor/group-chat'},
        {name:'Reviews',path:'/mentor/reviews'},
    ]
    return ( 
        <nav className='navbar skillswap-navbar'>
            <div className='container-fluid'>
                <NavLink to='/mentor/dashboard'>
                    SkillSwap Mentor
                </NavLink>
                <div className='navbar-nav skillswap-nav'>
                {navItems.map((item)=>(
                    <NavLink
                    key={item.name}
                    to={item.path}
                    className={({isActive})=>
                    `nav-link skillswap-link ${
                        isActive?'active':''
                    }`
                    }
                    >
                        {item.name}
                    </NavLink>
                ))}
                </div>
                <div className='skillswap-actions'>
                <button className='icon-btn' title='Chat'>
                    <MessageSquare size={20}/>
                </button>
                <button type='button' className='icon-btn' title='LogOut'>
                    <LogOut size={20}/>
                </button>
                </div>
            </div>
        </nav>
    )
}

export default MentorNavbar