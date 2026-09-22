import {React,useEffect,useState} from 'react'

import {CalendarDays,Clock3,Lock,Video,X} from 'lucide-react'

import CountDown from './CountDown'

const UpcomingSessionCard=({session,onCancel})=>{
    const [canJoin,setCanJoin]=useState(
        new Date(session.scheduled_start).getTime()<=Date.now()
    )
    useEffect(()=>{
        const timer=setInterval(()=>{
            setCanJoin(
                new Date(
                    session.scheduled_start
                ).getTime()<=Date.now()
            )
        },1000)
        return ()=>clearInterval(timer)
    },[session.scheduled_start])
    const date=new Date(session.scheduled_start)
    const endTime=new Date(date.getTime()+session.duration_minutes*60000)
    const initials=session.student_name?.split(' ').map(word=>word[0]).join('').slice(0,2).toUpperCase()
    const handleJoin=()=>{
        console.log('joining session:',session.id)
    }
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    const formattedStartTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })

    const formattedEndTime = endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })
    return (
        <div className="card border-0 shadow-sm mb-3">

            <div className="card-body p-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                        <h5 className="fw-semibold mb-1">
                            {session.title}
                        </h5>

                        <span className="badge bg-primary-subtle text-primary">
                            Course Session
                        </span>
                    </div>

                    <span className="badge bg-warning-subtle text-warning-emphasis">
                        {session.status}
                    </span>

                </div>


                {/* Student */}
                <div className="d-flex align-items-center mb-4">

                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold me-3"
                        style={{
                            width: '48px',
                            height: '48px',
                        }}
                    >
                        {initials || 'ST'}
                    </div>

                    <div>
                        <div className="fw-semibold">
                            {session.student_name}
                        </div>

                        {session.student_username && (
                            <small className="text-muted">
                                @{session.student_username}
                            </small>
                        )}
                    </div>

                </div>


                {/* Session Information */}
                <div className="row g-3 mb-3">

                    {/* Date */}
                    <div className="col-md-4">

                        <div className="d-flex align-items-center">

                            <CalendarDays
                                size={18}
                                className="text-primary me-2"
                            />

                            <div>
                                <small className="text-muted d-block">
                                    Date
                                </small>

                                <span className="fw-medium">
                                    {formattedDate}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Time */}
                    <div className="col-md-4">

                        <div className="d-flex align-items-center">

                            <Clock3
                                size={18}
                                className="text-primary me-2"
                            />

                            <div>
                                <small className="text-muted d-block">
                                    Time
                                </small>

                                <span className="fw-medium">
                                    {formattedStartTime} - {formattedEndTime}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Duration */}
                    <div className="col-md-4">

                        <div className="d-flex align-items-center">

                            <Clock3
                                size={18}
                                className="text-primary me-2"
                            />

                            <div>
                                <small className="text-muted d-block">
                                    Duration
                                </small>

                                <span className="fw-medium">
                                    {session.duration_minutes} minutes
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Message */}
                {session.message && (
                    <div className="bg-light rounded p-3 mb-3">

                        <small className="text-muted d-block mb-1">
                            Session Message
                        </small>

                        <p className="mb-0">
                            {session.message}
                        </p>

                    </div>
                )}


                {/* Countdown */}
                {!canJoin && (
                    <div className="border rounded p-3 mb-3 text-center">

                        <small className="text-muted d-block mb-1">
                            Session starts in
                        </small>

                        <CountDown
                            targetDate={session.scheduled_start}
                        />

                    </div>
                )}


                {/* Actions */}
                <div className="d-flex justify-content-end gap-2">

                    {/* Cancel */}
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => onCancel(session)}
                    >
                        <X size={17} className="me-1" />
                        Cancel
                    </button>


                    {/* Join */}
                    <button
                        type="button"
                        className={`btn ${
                            canJoin
                                ? 'btn-primary'
                                : 'btn-secondary'
                        }`}
                        disabled={!canJoin}
                        onClick={handleJoin}
                    >

                        {canJoin ? (
                            <>
                                <Video size={17} className="me-1" />
                                Join Session
                            </>
                        ) : (
                            <>
                                <Lock size={17} className="me-1" />
                                Join Session
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    )
}

export default UpcomingSessionCard