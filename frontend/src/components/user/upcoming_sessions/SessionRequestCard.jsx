import React,{useState} from 'react' 

import {CalendarDays,Clock3,UserRound,Check,X} from 'lucide-react'

const SessionRequestCard=({session,onAction})=>{
    const [processing,setProcessing]=useState(false)
    const formatDate=(date)=>{
        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                weekday:'short',
                day:'numeric',
                month:'short',
                year:'numeric',
            }
        )
    }
    const formatTime=(date)=>{
        return new Date(date).toLocaleTimeString(
            'en-IN',{
                hour:'numeric',
                minute:'2-digit',
            }
        )
    }
    const handleAction=async (action)=>{
        try{
            setProcessing(true)
            await onAction(
                session.id,
                action
            )
        }finally{
            setProcessing(false)
        }
    }
    return (
        <div className="session-request-card">

            <div className="session-request-content">

                <div>

                    <span className="session-type-badge skill">
                        Skill Exchange
                    </span>

                    <h3>
                        {session.title}
                    </h3>

                    <div className="session-person">

                        <UserRound size={17} />

                        <span>
                            {session.person_name}
                        </span>

                    </div>

                </div>


                <span className="request-status">
                    Requested
                </span>

            </div>


            <div className="session-request-info">

                <span>

                    <CalendarDays size={16} />

                    {formatDate(
                        session.scheduled_start
                    )}

                </span>


                <span>

                    <Clock3 size={16} />

                    {formatTime(
                        session.scheduled_start
                    )}

                    {' • '}

                    {session.duration_minutes}m

                </span>

            </div>


            {session.message && (

                <p className="session-request-message">

                    {session.message}

                </p>

            )}


            <div className="session-request-actions">

                <button
                    className="btn btn-success"
                    disabled={processing}
                    onClick={() =>
                        handleAction('ACCEPT')
                    }
                >

                    <Check size={17} />

                    Accept

                </button>


                <button
                    className="btn btn-outline-danger"
                    disabled={processing}
                    onClick={() =>
                        handleAction('REJECT')
                    }
                >

                    <X size={17} />

                    Reject

                </button>

            </div>

        </div>
    )
}

export default SessionRequestCard