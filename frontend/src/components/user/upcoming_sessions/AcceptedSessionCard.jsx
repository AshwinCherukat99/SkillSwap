import React from 'react'

import {CalendarDays,Clock3,UserRound,GraduationCap} from 'lucide-react'

import CountDownSession from './CountDownSession'        

const AcceptedSessionCard=({session})=>{
    const isSkillExchange=session.type==='SKILL EXCHANGE'
    const formatDate=(date)=>{
        return new Date(date).toLocaleDateString(
            'en-IN',
                {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }
        )
    }
    const formatTime=(date)=>{
        return new Date(data).toLocaleTimeString(
            'en-IN',
                {
                    hour: 'numeric',
                    minute: '2-digit',
                }
        )
    }
    return (
        <div className="accepted-session-card">

            <div className="accepted-session-header">

                <div>

                    <span
                        className={
                            isSkillExchange
                                ? 'session-type-badge skill'
                                : 'session-type-badge mentor'
                        }
                    >
                        {isSkillExchange
                            ? 'Skill Exchange'
                            : 'Mentor Session'
                        }
                    </span>

                    <h2>
                        {session.title}
                    </h2>

                </div>

                <span className="confirmed-badge">
                    Confirmed
                </span>

            </div>


            <div className="accepted-session-person">

                {isSkillExchange
                    ? (
                        <UserRound
                            size={19}
                        />
                    )
                    : (
                        <GraduationCap
                            size={19}
                        />
                    )
                }

                <span>
                    {session.person_name}
                </span>

            </div>


            <div className="accepted-session-details">

                <span>

                    <CalendarDays
                        size={17}
                    />

                    {formatDate(
                        session.scheduled_start
                    )}

                </span>


                <span>

                    <Clock3
                        size={17}
                    />

                    {formatTime(
                        session.scheduled_start
                    )}

                    {' • '}

                    {session.duration_minutes} minutes

                </span>

            </div>


            <div className="accepted-session-countdown">

                <CountdownSession
                    scheduledStart={
                        session.scheduled_start
                    }
                />

            </div>

        </div>
    )
}

export default AcceptedSessionCard