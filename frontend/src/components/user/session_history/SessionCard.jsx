import React from 'react'

import {Clock3,CheckCircle2,XCircle,AlertCircle,CalendarDays,UserRound,GraduationCap,CircleSlash2, CircleSlash} from 'lucide-react'

const SessionCard=({session,onClick})=>{
    const isSkillExchange=session.skill_wanted!=='undefined' && session.skill_offered!=='undefined'
    const formatDate=(dateString)=>{
        if (!dateString){
            return 'unknown date'
        }
        return new Date(
            dateString.toLocaleDateString(
                'en-IN',
                {
                    day:'numeric',
                    month:'short',
                    year:'numeric',
                }
            )
        )
    }
    const formatTime=(dateString)=>{
        if (!dateString){
            return ''
        }
        return new Date(
            dateString
        ).toLocaleTimeString(
            'en-IN',
            {
                hour:'numeric',
                minute:'2-digit',
            }
        )
    }
    const formatDuration=(minutes)=>{
        if (minutes<60){
            return `${minutes}m`
        }
        const hours=Math.floor(
            minutes/60
        )
        const remainingMinutes=minutes%60
        if (remainingMinutes===0){
            return `${hours}h`
        }
        return `${hours}h ${remainingMinutes}m`
    }
    const getStatusClass=(status)=>{
        switch(status){
            case 'COMPLETED':
                return 'session-status-completed'
            case 'CANCELLED':
                return 'session-status-cancelled'
            case 'EXPIRED':
                return 'session-status-expired'
            case 'REJECTED':
                return 'session-status-rejected'
            default:
                return 'session-status-default'
        }
    }
    const getStatusIcon=(status)=>{
        switch(status){
            case 'COMPLETED':
                return <CheckCircle2 size={15}/>
            case 'CANCELLED':
                return <XCircle size={15}/>
            case 'EXPIRED':
                return <AlertCircle size={15}/>
            case 'REJECTED':
                return <CircleSlash2 size={15}/>
        }
    }
    return (
        <div
            className="session-card"
            onClick={onClick}
        >

            <div className="session-card-top">

                <div className="session-card-main">

                    <div className="session-card-meta">

                        <span className="session-category">

                            {isSkillExchange
                                ? 'Skill Exchange'
                                : 'Course Session'
                            }

                        </span>


                        <span className="session-duration">

                            <Clock3
                                size={15}
                            />

                            {formatDuration(
                                session.duration_minutes
                            )}

                        </span>

                    </div>


                    <h3>
                        {session.title}
                    </h3>


                    <div className="session-person">

                        {isSkillExchange
                            ? (
                                <UserRound
                                    size={17}
                                />
                            )
                            : (
                                <GraduationCap
                                    size={17}
                                />
                            )
                        }

                        <span>
                            {session.person_name}
                        </span>

                    </div>

                </div>


                <span
                    className={
                        `session-status ${
                            getStatusClass(
                                session.status
                            )
                        }`
                    }
                >

                    {getStatusIcon(
                        session.status
                    )}

                    {session.status}

                </span>

            </div>


            <div className="session-card-footer">

                <span>

                    <CalendarDays
                        size={15}
                    />

                    {formatDate(
                        session.scheduled_start
                    )}

                </span>


                <span>

                    <Clock3
                        size={15}
                    />

                    {formatTime(
                        session.scheduled_start
                    )}

                </span>


                {session.message && (

                    <span className="session-message">

                        {session.message}

                    </span>

                )}

            </div>

        </div>
    )
}

export default SessionCard