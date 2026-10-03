import React,{useEffect,useState} from 'react'

import api from '../../../services/api'

import './RequestSessionModal.css'

const RequestSessionModal=({
    show,
    onClose,
    recipient,
    skillWanted,
    skillOffered,
    onSuccess
})=>{
    const [date,setDate]=useState('')
    const [time,setTime]=useState('')
    const [duration,setDuration]=useState(60)
    const [message,setMessage]=useState('')
    const [loading,setLoading]=useState(false)
    const [success,setSuccess]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        if (show){
            setDate('')
            setTime('')
            setDuration(60)
            setMessage('')
            setLoading(false)
            setSuccess(false)
            setError('')
        }
    },[show])         
    useEffect(()=>{
        if (show){
            document.body.style.overflow='hidden'
        }
        return ()=>{
            document.body.style.overflow=''
        }
    },[show])
    if (!show){
        return null
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        setError('')
        if (!recipient?.id){
            setError('recipient information is missing')
            return
        }
        if (!skillWanted?.id){
            setError('please select a skill you want to learn')
            return
        }
        if (!skillOffered?.id){
            setError('please select a skill you can offer')
            return
        }
        if (!date||!time){
            setError('please select a date and time')
        }
        const scheduledStart=`${date}T${time}:00`
    const selectedDateTime=new Date(scheduledStart)
    if (selectedDateTime<=new Date()){
        setError('please select a future date and time')
        return
    }
    const payload={
        recipient:recipient.id,
        skill_wanted:skillWanted.id,
        skill_offered:skillOffered.id,
        scheduled_start:scheduledStart,
        duration_minutes:Number(duration),
        message:message,
    }
    try{
        setLoading(true)
        const response=await api.post(
            '/sessions/session-requests/send/',
            payload
        )
        setSuccess(true)
        if (onSuccess){
            onSuccess(response.data)
        }
        setTimeout(()=>{
            onClose()
        },1500)
    }catch(err){
        console.error('session request error:',err)
        const data=err.response?.data
        if (data){
            if (typeof data==='object'){
                const messages=Oject.values(data).flat().join(' ')
                setError(messages||data.detail||data.error||'failed to send session request')
            }else{
                setError(data||'failed to send session request')
            }
        }else{
            setError('unable to connect to server')
        }
    }finally{
        setLoading(false)
    }
    }
    const handleBackdropClick=(e)=>{
        if (e.target === e.currentTarget && !loading){
            onClose()
        }
    }
    const displayName=recipient?.full_name||
    recipient?.name||
    recipient?.username||
    'User'
    const username=recipient?.username||''
    const profileImage=recipient?.profile_image||
    recipient?.profileImage||"https://via.placeholder.com/100"
    return (
        <div
            className="request-session-backdrop"
            onMouseDown={handleBackdropClick}
        >

            <div className="request-session-modal">

                {/* ================= HEADER ================= */}

                <header className="request-session-header">

                    <div className="request-session-user">

                        <div className="request-session-avatar-wrapper">

                            <img
                                src={profileImage}
                                alt={displayName}
                                className="request-session-avatar"
                            />

                            {recipient?.is_mentor && (
                                <span
                                    className="request-session-verified"
                                    title="Verified Mentor"
                                >
                                    ✓
                                </span>
                            )}

                        </div>


                        <div className="request-session-user-info">

                            <div className="request-session-name-row">

                                <h2>
                                    {displayName}
                                </h2>

                                {recipient?.is_mentor && (
                                    <span className="request-session-badge">
                                        Verified Mentor
                                    </span>
                                )}

                            </div>


                            <p>
                                {recipient?.headline ||
                                    recipient?.bio ||
                                    username}
                            </p>


                            {recipient?.experience && (
                                <small>
                                    {recipient.experience} Experience
                                </small>
                            )}

                        </div>

                    </div>


                    <button
                        type="button"
                        className="request-session-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </header>


                {/* ================= CONTENT ================= */}

                <div className="request-session-content">

                    <h1>
                        Request a Mentoring Session
                    </h1>


                    <form
                        id="sessionRequestForm"
                        onSubmit={handleSubmit}
                    >

                        {/* DATE + TIME */}

                        <div className="row g-3 mb-4">

                            <div className="col-md-6">

                                <label className="form-label">
                                    Preferred Date
                                </label>

                                <div className="input-icon-wrapper">

                                    <span className="input-icon">
                                        📅
                                    </span>

                                    <input
                                        type="date"
                                        className="form-control session-input"
                                        value={date}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="col-md-6">

                                <label className="form-label">
                                    Preferred Time
                                </label>

                                <div className="input-icon-wrapper">

                                    <span className="input-icon">
                                        🕐
                                    </span>

                                    <input
                                        type="time"
                                        className="form-control session-input"
                                        value={time}
                                        onChange={(e) =>
                                            setTime(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* DURATION */}

                        <div className="mb-4">

                            <label className="form-label">
                                Estimated Duration
                            </label>

                            <div className="input-icon-wrapper">

                                <span className="input-icon">
                                    ⏱
                                </span>

                                <select
                                    className="form-select session-input"
                                    value={duration}
                                    onChange={(e) =>
                                        setDuration(e.target.value)
                                    }
                                >
                                    <option value={15}>
                                        15 minutes
                                    </option>

                                    <option value={30}>
                                        30 minutes
                                    </option>

                                    <option value={45}>
                                        45 minutes
                                    </option>

                                    <option value={60}>
                                        60 minutes
                                    </option>

                                    <option value={90}>
                                        90 minutes
                                    </option>

                                    <option value={120}>
                                        120 minutes
                                    </option>
                                </select>

                            </div>

                        </div>


                        {/* SKILLS */}

                        <div className="row g-3 mb-4">

                            <div className="col-md-6">

                                <label className="form-label">
                                    Skill You Want to Learn
                                </label>

                                <div className="skill-preview">
                                    {skillWanted?.name ||
                                        "Not selected"}
                                </div>

                            </div>


                            <div className="col-md-6">

                                <label className="form-label">
                                    Skill You Offer
                                </label>

                                <div className="skill-preview">
                                    {skillOffered?.name ||
                                        "Not selected"}
                                </div>

                            </div>

                        </div>



                        {/* NOTE */}

                        <div className="mb-4">

                            <div className="d-flex justify-content-between">

                                <label className="form-label">
                                    Add a Note
                                    <span className="text-muted">
                                        {" "}
                                        (Optional)
                                    </span>
                                </label>

                                <small className="text-muted">
                                    {message.length}/500
                                </small>

                            </div>


                            <textarea
                                className="form-control session-textarea"
                                maxLength={500}
                                rows={3}
                                placeholder="Share specific questions or goals for this session..."
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                            />

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div
                                className="alert alert-danger"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}


                        {/* SUCCESS */}

                        {success && (
                            <div
                                className="alert alert-success d-flex align-items-center gap-2"
                                role="alert"
                            >
                                <span>✓</span>

                                <span>
                                    Session request sent successfully!
                                </span>
                            </div>
                        )}


                        {/* INFORMATION */}

                        <div className="session-information">

                            <div className="session-information-icon">
                                i
                            </div>

                            <div>

                                <h4>
                                    Session Request Information
                                </h4>

                                <p>
                                    Once sent, {displayName} will
                                    receive your request. They can
                                    accept or reject the request.
                                    You will be notified of their
                                    response.
                                </p>

                            </div>

                        </div>

                    </form>

                </div>


                {/* ================= FOOTER ================= */}

                <footer className="request-session-footer">

                    <button
                        type="button"
                        className="btn request-cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        form="sessionRequestForm"
                        className="btn request-submit-btn"
                        disabled={loading || success}
                    >

                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>

                                Sending...
                            </>
                        ) : success ? (
                            <>
                                ✓ Request Sent!
                            </>
                        ) : (
                            <>
                                Send Request
                                <span>➤</span>
                            </>
                        )}

                    </button>

                </footer>

            </div>

        </div>
    )
}

export default RequestSessionModal