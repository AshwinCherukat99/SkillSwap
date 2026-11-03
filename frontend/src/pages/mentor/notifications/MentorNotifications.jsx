import { useCallback,useEffect,useMemo,useState } from "react";

import mentorApi from '../../../services/mentorApi'

import {getNotificationCategory} from '../../../components/mentor/notifications/NotificationFilters'

import NotificationFilters from "../../../components/mentor/notifications/NotificationFilters";
import NotificationCard from "../../../components/mentor/notifications/NotificationCard";
import './MentorNotifications.css'

function MentorNotifications(){
    const [notifications,setNotifications]=useState([])
    const [activeFilter,setActiveFilter]=useState('All')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [actionLoading,setActionLoading]=useState(false)
    const loadNotifications=useCallback(async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await mentorApi.get(
                "/notifications/mentor/"
            )
            setNotifications(
                Array.isArray(response.data)?response.data:[]
            )
        }catch(err){
            console.error('notification loading error:',err)
            setError(
                err.response?.data?.detail||
                err.response?.data?.error||
                'unable to load notifications'
            )
        }finally{
            setLoading(false)
        }
    },[])   
    useEffect(()=>{
        loadNotifications()
    },[loadNotifications])
    const unreadCount=useMemo(
        ()=>notifications.filter(item=>!item.is_read).length,
        [notifications]
    )
    const handleNotificationClick=async (notificationId)=>{
        const selected=notifications.find(
            item=>item.id===notificationId
        )
        if (!selected||selected.is_read||actionLoading){
            return
        }
        try{
            setActionLoading(true) 
            await mentorApi.patch(
                `/notifications/mentor/${notificationId}/read/`
            )
            setNotifications(current=>
                current.map(item=>
                    item.id===notificationId
                    ?{...item,is_read:true}
                    :item
                )
            )
        }catch(err){
            console.error('mark notification as read error:',err)     
            setError(err.response?.data?.detail||
                'unable to mark notification as read'
            )
        }finally{
            setActionLoading(false)
        }
    }
    const handleMarkAllAsRead=async ()=>{
        if (unreadCount===0||actionLoading) return
        try{
            setActionLoading(true)
            setError('')
            await mentorApi.patch(
                '/notifications/mentor/read_all/'
            )
            setNotifications(current=>
                current.map(item=>({
                    ...item,
                    is_read:true
                }))
            )
        }catch(err){
            console.error('mark all as read error:',err)
            setError(err.response?.data?.detail||
                'unable to mark all notifications as read'
            )
        }finally{
            setActionLoading(false)
        }
    }
    const handleClearRead=async ()=>{
        const readCount=notifications.filter(
            item=>item.is_read
        ).length
        if (readCount===0||actionLoading) return
        const confirmed=window.confirm(
            `are you sure you want to clear ${readCount} notifications? unread notifictions will be preserved`
        )
        if (!confirmed) return
        try{
            setActionLoading(true)
            setError('')
            await mentorApi.delete(
                '/notifications/mentor/clear_read/'
            )
            setNotifications(current=>
                current.filter(item=>!item.is_read)
            )
        }catch(err){
            console.error('clear read notifications error:',err)
            setError(
                err.response?.data?.detail||
                'unable to clear read notifications'
            )
        }finally{
            setActionLoading(false)
        }
    }
    const filteredNotifications=useMemo(()=>{
        if (activeFilter==='All'){
            return notifications
        } 
        if (activeFilter==='Unread'){
            return notifications.filter(item=>!item.is_read)
        }
        return notifications.filter(item=>
            getNotificationCategory(item.notification_type)===activeFilter
        )
    },[notifications,activeFilter])
    return (
        <main className="mentor-notifications-page">
            <div className="container-fluid mentor-notifications-container">

                {/* Header */}
                <div className="notifications-header">
                    <div>
                        <div className="notifications-breadcrumb">
                            Mentor Studio
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                            <span>Notifications</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <h1>Notifications</h1>

                            <span className="unread-pill">
                                <span className="unread-pill-dot" />
                                {unreadCount} Unread
                            </span>
                        </div>

                        <p>
                            Stay updated with your students, sessions,
                            reviews, and earnings.
                        </p>
                    </div>

                    <div className="notification-actions">
                        <button
                            type="button"
                            className="btn mark-all-read-btn"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0 || actionLoading}
                        >
                            <span className="material-symbols-outlined">
                                check_circle
                            </span>
                            Mark All as Read
                        </button>

                        <button
                            type="button"
                            className="btn clear-read-btn"
                            onClick={handleClearRead}
                            disabled={
                                notifications.every(item => !item.is_read) ||
                                actionLoading
                            }
                        >
                            <span className="material-symbols-outlined">
                                delete_sweep
                            </span>
                            Clear Read
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span>{error}</span>
                        <button
                            className="btn-close"
                            type="button"
                            onClick={() => setError("")}
                        />
                    </div>
                )}

                {/* Filters */}
                <NotificationFilters
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    notifications={notifications}
                />

                {/* Notification feed */}
                <section className="notifications-feed">

                    {loading ? (
                        <div className="notifications-loading">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            />
                            <p>Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="notifications-empty">
                            <span className="material-symbols-outlined">
                                notifications_off
                            </span>

                            <h5>No notifications found</h5>

                            <p>
                                There are currently no notifications
                                under this filter.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onClick={handleNotificationClick}
                                busy={actionLoading}
                            />
                        ))
                    )}

                </section>
            </div>
        </main>
    )
}

export default MentorNotifications