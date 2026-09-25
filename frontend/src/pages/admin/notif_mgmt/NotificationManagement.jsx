import React,{useEffect,useCallback,useState} from "react";

import NotificationStats from "../../../components/admin/notif_mgmt/NotificationStats";
import NotificationQuickActions from "../../../components/admin/notif_mgmt/NotificationQuickActions";
import NotificationForm from "../../../components/admin/notif_mgmt/NotificationForm";
import ScheduleNotificationList from "../../../components/admin/notif_mgmt/ScheduledNotificationList";

import adminApi from "../../../services/adminApi";

import './NotificationManagement.css'

function NotificationManagement(){
    const [stats,setStats]=useState({
        sent_today:0,
        scheduled:0,
        push_notifications:0,
        email_campaigns:0,
        announcements:0,
    })
    const [notifications,setNotifications]=useState([])
    const [editingNotification,setEditingNotification]=useState(null)
    const [quickAction,setQuickAction]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [alert,setAlert]=useState(null)
    const showAlert=useCallback(
        (message,type='success')=>{
            setAlert({
                message,
                type
            })
            setTimeout(()=>{
                setAlert(null)
            },5000)
        },
    [])
    const fetchNotifications=useCallback(async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                '/notifications/admin/'
            )
            setStats(response.data.stats||{})
            setNotifications(response.data.notifications||[])
        }catch(err){
            console.error('notification fetch error-',err)
            setError(err.response?.data?.detail||'unable to load notifications')
        }finally{
            setLoading(false)
        }
    },[])
    useEffect(()=>{
        fetchNotifications()
    },[fetchNotifications])
    const handleQuickAction=(action)=>{
        setEditingNotification(null)
        setQuickAction(action)
        setTimeout(()=>{
            document.getElementById('notification-form')?.scrollIntoView({
                behaviour:'smooth',
                block:'start',
            })
        },100)
    }
    const handleSaved=()=>{
        setEditingNotification(null)
        setQuickAction(null)    
        fetchNotifications()
    }
    const handleEdit=(notification)=>{
        setQuickAction(null)
        setEditingNotification(notification)
        setTimeout(()=>{
            document.getElementById('notification-form')?.scrollIntoView({
                behaviour:'smooth',
                block:'start',
            })
        },100)
    }
    const handleDiscard=()=>{
        setEditingNotification(null)
        setQuickAction(null)
    }
    const handleDelete=async (notificationId)=>{
        try{
            await adminApi.delete(
                `/notifications/admin/${notificationId}/`
            )
            showAlert('notification deleted successfully',
                'success'
            )
            fetchNotifications()
        }catch(err){
            console.error('delete notification error:',err)
            showAlert(err.response?.data?.detail||'unable to delete notification','danger')
        }
    }
    const handleCancel=async (notificationId)=>{
        const confirmed=window.confirm('cancel this scheduled notification?')
        if (!confirmed){
            return
        }
        try{
            await adminApi.post(
                `/notifications/admin/${notificationId}/cancel/`
            )
            showAlert('scheduled notification cancelled','success')
            fetchNotifications()
        }catch(err){
            console.error('cancel notification error:',err)
            showAlert(err.response?.data?.detail||'unable to cancel notification','danger')
        }
    }
    return (
        <div className="notification-management-page">

            {/* ==================================
                ALERT
            ================================== */}

            {alert && (

                <div
                    className={`alert alert-${alert.type} notification-alert alert-dismissible`}
                    role="alert"
                >

                    <span className="material-symbols-outlined me-2">
                        {alert.type ===
                        "success"
                            ? "check_circle"
                            : "error"}
                    </span>

                    {alert.message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setAlert(null)
                        }
                    />

                </div>

            )}

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="notification-page-header">

                <div>

                    <h1>
                        Notification Management
                    </h1>

                    <p>
                        Create, schedule, and manage
                        notifications across the platform.
                    </p>

                </div>

                <div className="notification-header-icon">

                    <span className="material-symbols-outlined">
                        notifications_active
                    </span>

                </div>

            </div>

            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                >

                    <span className="material-symbols-outlined me-2">
                        error
                    </span>

                    {error}

                    <button
                        className="btn btn-sm btn-outline-danger ms-auto"
                        onClick={fetchNotifications}
                    >
                        Retry
                    </button>

                </div>

            )}

            {/* ==================================
                LOADING
            ================================== */}

            {loading ? (

                <div className="notification-loading">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p>
                        Loading notification management...
                    </p>

                </div>

            ) : (

                <>

                    {/* ==================================
                        STATS
                    ================================== */}

                    <NotificationStats
                        stats={stats}
                    />

                    {/* ==================================
                        QUICK ACTIONS
                    ================================== */}

                    <NotificationQuickActions
                        onAction={
                            handleQuickAction
                        }
                    />

                    {/* ==================================
                        MAIN GRID
                    ================================== */}

                    <div className="row g-4">

                        <div className="col-12 col-xl-7">

                            <div
                                id="notification-form"
                            >

                                <NotificationForm
                                    editingNotification={
                                        editingNotification
                                    }
                                    quickAction={
                                        quickAction
                                    }
                                    onSaved={
                                        handleSaved
                                    }
                                    onDiscard={
                                        handleDiscard
                                    }
                                    showAlert={
                                        showAlert
                                    }
                                />

                            </div>

                            <div className="mt-4">

                                <ScheduleNotificationList
                                    notifications={
                                        notifications
                                    }
                                    onEdit={
                                        handleEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                    onCancel={
                                        handleCancel
                                    }
                                />

                            </div>

                        </div>

                        {/* ==================================
                            RIGHT COLUMN
                        ================================== */}

                        

                    </div>

                </>

            )}

        </div>
    )
}

export default NotificationManagement