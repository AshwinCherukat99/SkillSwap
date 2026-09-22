import {useState,useEffect} from 'react'
import api from '../../../services/api'

import NotificationCard from '../../../components/user/notifications/NotificationCard'
import NotificationFilters from '../../../components/user/notifications/NotificationFilters'

import './Notifications.css'

function Notifications(){
    const [notifications,setNotifications]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [activeFilter,setActiveFilter]=useState("All")
    const loadNotifications=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await api.get("/notifications/")
            setNotifications(response.data)
        }catch(error){
            console.error('notification loading error:',error)
            setError(error.response?.data?.detail||
                error.response?.data?.error||
                'unable to load notifications'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        loadNotifications()
    },[])
    const handleMarkAsRead=async (notificationId)=>{
        try{
            await api.patch(
                `/notifications/${notificationId}/read/`
            )
            setNotifications(
                (currentNotifications)=>{
                    currentNotifications.map(
                        (notification)=>notification.id===notificationId?{
                            ...notifiation,
                            is_read:true,
                        }
                        :notification
                    )
                }
            )
        }catch(error){
            console.error('mark notification read error:',error)
        }
    }
    const handleMarkAllAsRead=async ()=>{
        try {
            await api.patch(
                "notifications/read_all"
            )
            setNotifications(
                (currentNotifications)=>
                    currentNotifications.map(
                        (notification)=>({
                            ...notification,
                            is_read:true,
                        })
                    )
            )
        }catch(error){
            console.error('mark all as read error:',error)
            alert('unable to mark notifications as read')
        }
    }
    const handleClearRead=async ()=>{
        const confirmed=window.confirm(
            'remove all read notifications?'
        )
        if (!confirmed){
            return
        }
        try{
            await api.delete(
                "/notifications/clear_read/"
            )
            setNotifications(
                (currentNotifications)=>
                    currentNotifications.filter(
                        (notification)=>
                            !notification.is_read
                    )
            )
        }catch(error){
            console.error(
                'clear notifications error:',error
            )
            alert('unable to clear read notifications')
        }
    }
    const filteredNotifications=notifications.filter(
        (notification)=>{
            if (activeFilter==="All"){
                return true
            }
            if (activeFilter==='Unread'){
                return !notification.is_read
            }
            if (activeFilter==='Messages'){
                return notification.notification_type.includes('MESSAGE')
            }
            if (activeFilter==='Sessions'){
                return notification.notification_type.includes('SESSION')
            }
            if (activeFilter==='Ratings'){
                return notification.notification_type.includes('RATING')
            }
            if (activeFilter==='Achievements'){
                return (
                    notification.notification_type.includes('STREAK')||
                    notification.notification_type.includes('WELCOME')
                )
            }
            return true
        }
    )
    const unreadCount=notifications.filter(
        (notification)=>!notification.is_read
    ).length
    return (
        <div className="notifications-page">

            <div className="container notifications-container">


                {/* =========================
                    PAGE HEADER
                ========================== */}

                <div className="notifications-header">

                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with your
                            learning journey and
                            community activity.
                        </p>

                    </div>


                    <div className="notification-actions">

                        <button
                            type="button"
                            className="btn mark-read-btn"
                            onClick={
                                handleMarkAllAsRead
                            }
                            disabled={
                                unreadCount === 0
                            }
                        >
                            Mark All as Read
                        </button>


                        <button
                            type="button"
                            className="btn clear-read-btn"
                            onClick={
                                handleClearRead
                            }
                        >
                            Clear Read
                        </button>

                    </div>

                </div>


                {/* =========================
                    UNREAD COUNT
                ========================== */}

                <div className="unread-summary">

                    <span className="material-symbols-outlined">
                        notifications
                    </span>

                    <span>

                        {unreadCount} unread
                        notification{
                            unreadCount !== 1
                                ? "s"
                                : ""
                        }

                    </span>

                </div>


                {/* =========================
                    FILTERS
                ========================== */}

                <NotificationFilters
                    activeFilter={
                        activeFilter
                    }
                    setActiveFilter={
                        setActiveFilter
                    }
                />


                {/* =========================
                    LOADING
                ========================== */}

                {loading && (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                    </div>

                )}


                {/* =========================
                    ERROR
                ========================== */}

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}


                {/* =========================
                    NOTIFICATIONS
                ========================== */}

                {!loading &&
                    !error && (

                    <div className="notifications-list">

                        {filteredNotifications.length ===
                        0 ? (

                            <div className="empty-notifications">

                                <span className="material-symbols-outlined">
                                    notifications_off
                                </span>

                                <h4>
                                    No notifications
                                </h4>

                                <p>
                                    You're all caught up!
                                </p>

                            </div>

                        ) : (

                            filteredNotifications.map(
                                (notification) => (

                                    <NotificationCard
                                        key={
                                            notification.id
                                        }
                                        notification={
                                            notification
                                        }
                                        onMarkAsRead={
                                            handleMarkAsRead
                                        }
                                    />

                                )
                            )

                        )}

                    </div>

                )}

            </div>

        </div>
    )
}

export default Notifications