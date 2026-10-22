import React,{useEffect,useState} from 'react'

import adminApi from '../../../services/adminApi'

function NotificationForm({editingNotification,quickAction,onSaved,onDiscard,showAlert}){
    const [title,setTitle]=useState('')
    const [message,setMessage]=useState('')
    const [audience,setAudience]=useState('ALL')
    const [recipient,setRecipient]=useState(null)
    const [priority,setPriority]=useState('NORMAL')
    const [inApp,setInApp]=useState(true)
    const [push,setPush]=useState(false)
    const [email,setEmail]=useState(false)
    const [scheduledAt,setScheduledAt]=useState('')
    const [userSearch,setUserSearch]=useState('')
    const [users,setUsers]=useState([])
    const [searchingUsers,setSearchingUsers]=useState(false)
    const [loading,setLoading]=useState(false)
    const editing=Boolean(editingNotification)
    useEffect(()=>{
        if (editingNotification){
            setTitle(editingNotification.title||'')
            setMessage(editingNotification.message||'')
            setAudience(editingNotification.audience||'ALL')
            setRecipient(editingNotification.recipient?{
                id:editingNotification.recipient,
                username:editingNotification.recipient_username||''
            }:null)
            setPriority(editingNotification.priority||'NORMAL')
            setInApp(editingNotification.in_app??true)
            setPush(editingNotification.push??false)
            setEmail(editingNotification.email??false)
            if (editingNotification.scheduled_at){
                setScheduledAt(
                    formatDateTimeLocal(editingNotification.scheduled_at)
                )
            }else{
                setScheduledAt('')
            }
            return
        }
        resetForm()
    },[editingNotification])
    useEffect(()=>{
        if (!quickAction||editing){
            return
        }
        switch(quickAction){
            case 'GLOBAL':
                setAudience('ALL')
                setRecipient(null)
                break
            case 'SCHEDULE':
                setScheduledAt(getDefaultScheduleTime())
                break
            case 'PUSH':
                setPush(true)
                setInApp(true)
                break
            case 'EMAIL':
                setEmail(true)
                setInApp(false)
                break
            case 'ANNOUNCEMENT':
                setAudience('ALL')
                setRecipient(null)
                break
            default:
                break
        }
    },[quickAction,editing])
    const resetForm=()=>{
        setTitle('')
        setMessage('')
        setAudience('ALL')
        setRecipient(null)
        setPriority('NORMAL')
        setInApp(true)
        setPush(false)
        setEmail(false)
        setScheduledAt('')
        setUserSearch('')
        setUsers([])
    }
    const formatDateTimeLocal=(value)=>{
        if (!value){
            return
        }
        const date=new Date(value)
        if (Number.isNaN(date.getTime())){
            return ''
        }
        const offset=date.getTimezoneOffset()*60000
        return new Date(date.getTime()-offset).toISOString().slice(0,16)
    }
    const getDefaultScheduleTime=()=>{
        const date=new Date()
        date.setMinutes(date.getMinutes()+30)
        const offset=date.getTimezoneOffset()*60000 
        return new Date(date.getTime()-offset).toISOString().slice(0,16)
    }
    useEffect(()=>{
        if (audience!=='INDIVIDUAL'){
            setUsers([])
            return
        }
        if (!userSearch.trim()){
            setUsers([])
            return
        }
        const timeOut=setTimeout(
            async ()=>{
                try{
                    setSearchingUsers(true)
                    const response=await adminApi.get(
                        "/notifications/admin/users/search/",
                        {
                            params:{
                                search:userSearch.trim()
                            }
                        }
                    )
                    setUsers(response.data.users||[])
                }catch(error){
                    console.error('user search error:',error)
                    setUsers([])
                }finally{
                    setSearchingUsers(false)
            }
        },
        400
        )
        return ()=>clearTimeout(timeOut)
    },[userSearch,audience])
    const handleSelectUser=(user)=>{
        setRecipient(user)
        setUserSearch('')
        setUsers([])
    }
    const handleAudienceChange=(value)=>{
        setAudience(value)
        if (value!=='INDIVIDUAL'){
            setRecipient(null)
            setUserSearch('')
            setUsers([])
        }
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!title.trim()){
            showAlert('notification title is required','danger')
            return
        }
        if (!message.trim()){
            showAlert('notification message is required','danger')
            return
        }
        if (!inApp&&!push&&!email){
            showAlert('select atleast one notification channel','danger')
            return
        }
        if (audience==='INDIVIDUAL'&&!recipient){
            showAlert('please select a recipient','danger')
            return
        }
        if (scheduledAt){
            const selectedDate=new Date(scheduledAt)
            if (Number.isNaN(selectedDate.getTime())){
                showAlert('please select a valid schedule time','danger')
                return
            }
            if (selectedDate<=new Date()){
            showAlert('scheduled time must be in the future','danger')
            return
        }
        }
        const payload={
            title:title.trim(),
            message:message.trim(),
            audience,
            recipient:audience==='INDIVIDUAL'?recipient.id:null,
            priority,
            in_app:inApp,
            push,
            email,
            scheduled_at:scheduledAt?new Date(scheduledAt).toISOString():null
        }
        try{
            setLoading(true)
            let response
            if (editing){
                response=await adminApi.patch(
                    `/notifications/admin/${editingNotification.id}/`,
                    payload
                )
                showAlert('notification updated successfully','success')
            }else{
                response=await adminApi.post(
                    '/notifications/admin/',
                    payload
                )
                if (scheduledAt){
                    showAlert('notification scheduled successfully','success')
                }else{
                    showAlert(
                        'notification sent successfully',
                        'success'
                    )
                }
            }
            if (onSaved){
                onSaved(response.data)
            }
            resetForm()
        }catch(error){
            console.error('notification save error:',error)
            const backendError=error.response?.data
            let errorMessage='unable to save notification'
            if (backendError?.detail){
                errorMessage=backendError.detail
            }
            else if(backendError?.channels){
                errorMessage=backendError.channels
            }
            else if(backendError?.recipient){
                errorMessage=Array.isArray(backendError.recipient)?backendError.recipient[0]:backendError.recipient
            }
            showAlert(errorMessage,'danger')
        }finally{
            setLoading(false)
        }
    }
    const handleDiscard=()=>{
        resetForm()
        if (onDiscard()){
            onDiscard()
        }
    }
    return (
        <div className="notification-form-card">

            <div className="notification-form-header">

                <div>
                    <h4>
                        {editing
                            ? "Edit Notification"
                            : "New Notification"}
                    </h4>

                    <p>
                        Create and send a notification
                        to users or mentors.
                    </p>
                </div>

                <span className="notification-draft-badge">
                    {editing
                        ? "Editing"
                        : "Ready"}
                </span>

            </div>

            <form onSubmit={handleSubmit}>

                {/* ==================================
                    TITLE + AUDIENCE
                ================================== */}

                <div className="row g-4 mb-4">

                    <div className="col-md-6">

                        <label className="form-label">
                            Notification Title
                        </label>

                        <input
                            type="text"
                            className="form-control notification-input"
                            placeholder="e.g. System Maintenance Update"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="col-md-6">

                        <label className="form-label">
                            Recipient Group
                        </label>

                        <select
                            className="form-select notification-input"
                            value={audience}
                            onChange={(event) =>
                                handleAudienceChange(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Users
                            </option>

                            <option value="USERS">
                                Users Only
                            </option>

                            <option value="MENTORS">
                                Mentors Only
                            </option>

                            <option value="INDIVIDUAL">
                                Individual User
                            </option>

                        </select>

                    </div>

                </div>

                {/* ==================================
                    INDIVIDUAL USER
                ================================== */}

                {audience === "INDIVIDUAL" && (

                    <div className="mb-4">

                        <label className="form-label">
                            Select User
                        </label>

                        {recipient ? (

                            <div className="selected-recipient">

                                <div>
                                    <strong>
                                        {recipient.full_name ||
                                            recipient.username}
                                    </strong>

                                    <small>
                                        {recipient.email}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                        setRecipient(null);
                                        setUserSearch("");
                                    }}
                                >
                                    Remove
                                </button>

                            </div>

                        ) : (

                            <div className="position-relative">

                                <input
                                    type="text"
                                    className="form-control notification-input"
                                    placeholder="Search by username, email or name..."
                                    value={userSearch}
                                    onChange={(event) =>
                                        setUserSearch(
                                            event.target.value
                                        )
                                    }
                                />

                                {searchingUsers && (
                                    <div className="user-search-loading">
                                        Searching...
                                    </div>
                                )}

                                {!searchingUsers &&
                                    users.length > 0 && (

                                        <div className="user-search-results">

                                            {users.map(
                                                (user) => (

                                                    <button
                                                        type="button"
                                                        key={user.id}
                                                        className="user-search-item"
                                                        onClick={() =>
                                                            handleSelectUser(
                                                                user
                                                            )
                                                        }
                                                    >

                                                        <div>
                                                            <strong>
                                                                {user.full_name ||
                                                                    user.username}
                                                            </strong>

                                                            <small>
                                                                {
                                                                    user.email
                                                                }
                                                            </small>
                                                        </div>

                                                        <span>
                                                            {
                                                                user.role
                                                            }
                                                        </span>

                                                    </button>

                                                )
                                            )}

                                        </div>
                                    )}

                            </div>
                        )}

                    </div>
                )}

                {/* ==================================
                    MESSAGE
                ================================== */}

                <div className="mb-4">

                    <label className="form-label">
                        Message Content
                    </label>

                    <textarea
                        className="form-control notification-input"
                        rows="5"
                        placeholder="Enter your notification message here..."
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                    />

                </div>

                {/* ==================================
                    CHANNELS
                ================================== */}

                <div className="notification-options">

                    <div className="notification-channels">

                        <span className="notification-option-label">
                            Channels
                        </span>

                        <label className="form-check">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={inApp}
                                onChange={(event) =>
                                    setInApp(
                                        event.target.checked
                                    )
                                }
                            />

                            <span className="form-check-label">
                                In-app
                            </span>

                        </label>

                        <label className="form-check">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={push}
                                onChange={(event) =>
                                    setPush(
                                        event.target.checked
                                    )
                                }
                            />

                            <span className="form-check-label">
                                Push
                            </span>

                        </label>

                        <label className="form-check">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.checked
                                    )
                                }
                            />

                            <span className="form-check-label">
                                Email
                            </span>

                        </label>

                    </div>

                    <div className="notification-priority">

                        <span className="notification-option-label">
                            Priority
                        </span>

                        <div className="priority-buttons">

                            {[
                                {
                                    value: "NORMAL",
                                    label: "Normal",
                                },
                                {
                                    value: "HIGH",
                                    label: "High",
                                },
                                {
                                    value: "URGENT",
                                    label: "Urgent",
                                },
                            ].map(
                                (option) => (

                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        className={
                                            priority ===
                                            option.value
                                                ? "priority-btn active"
                                                : "priority-btn"
                                        }
                                        onClick={() =>
                                            setPriority(
                                                option.value
                                            )
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* ==================================
                    SCHEDULE
                ================================== */}

                <div className="row align-items-end g-3 mt-1 mb-4">

                    <div className="col-md-7">

                        <label className="form-label">
                            Schedule Send
                            <span className="optional-label">
                                Optional
                            </span>
                        </label>

                        <input
                            type="datetime-local"
                            className="form-control notification-input"
                            value={scheduledAt}
                            onChange={(event) =>
                                setScheduledAt(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    {scheduledAt && (

                        <div className="col-md-5">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() =>
                                    setScheduledAt("")
                                }
                            >
                                Send Immediately Instead
                            </button>

                        </div>

                    )}

                </div>

                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="notification-form-actions">

                    <button
                        type="button"
                        className="btn btn-light notification-discard-btn"
                        onClick={handleDiscard}
                        disabled={loading}
                    >
                        Discard
                    </button>

                    <button
                        type="submit"
                        className="btn notification-submit-btn"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    aria-hidden="true"
                                />

                                Saving...
                            </>

                        ) : (

                            <>
                                <span className="material-symbols-outlined me-2">
                                    {scheduledAt
                                        ? "schedule"
                                        : "send"}
                                </span>

                                {scheduledAt
                                    ? "Schedule Notification"
                                    : editing
                                    ? "Update Notification"
                                    : "Send Notification Now"}
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>
    )
}

export default NotificationForm