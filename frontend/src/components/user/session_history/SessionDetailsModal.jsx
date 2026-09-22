import React from 'react'

import {
    Clock3,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CalendarDays,
    UserRound,
    GraduationCap,
} from 'lucide-react'


const SessionDetailsModal = ({
    session,
    onClose,
}) => {


    const isSkillExchange =
        session.skill_wanted !== undefined &&
        session.skill_offered !== undefined


    const formatDate = (dateString) => {

        if (!dateString) {
            return 'Unknown date'
        }

        return new Date(
            dateString
        ).toLocaleDateString(
            'en-IN',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }
        )
    }


    const formatTime = (dateString) => {

        if (!dateString) {
            return ''
        }

        return new Date(
            dateString
        ).toLocaleTimeString(
            'en-IN',
            {
                hour: 'numeric',
                minute: '2-digit',
            }
        )
    }


    const formatDuration = (minutes) => {

        if (minutes < 60) {
            return `${minutes} minutes`
        }

        const hours = Math.floor(
            minutes / 60
        )

        const remainingMinutes =
            minutes % 60

        if (remainingMinutes === 0) {
            return `${hours} hour${
                hours > 1 ? 's' : ''
            }`
        }

        return `${hours}h ${remainingMinutes}m`
    }


    const getStatusIcon = (status) => {

        switch (status) {

            case 'COMPLETED':
                return <CheckCircle2 size={18} />

            case 'CANCELLED':
                return <XCircle size={18} />

            case 'EXPIRED':
                return <AlertCircle size={18} />

            default:
                return <Clock3 size={18} />
        }
    }


    return (

        <div
            className="session-modal-backdrop"
            onClick={onClose}
        >

            <div
                className="session-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* Header */}

                <div className="session-modal-header">

                    <h4>
                        Session Details
                    </h4>

                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                    />

                </div>


                {/* Body */}

                <div className="session-modal-body">

                    {/* Session type */}

                    <span className="session-category">

                        {isSkillExchange
                            ? 'Skill Exchange'
                            : 'Course Session'
                        }

                    </span>


                    {/* Title */}

                    <h3 className="mt-3">

                        {session.title}

                    </h3>


                    {/* Person */}

                    <div className="session-detail-row">

                        {isSkillExchange
                            ? (
                                <UserRound
                                    size={18}
                                />
                            )
                            : (
                                <GraduationCap
                                    size={18}
                                />
                            )
                        }

                        <span>
                            {session.person_name}
                        </span>

                    </div>


                    {/* Date */}

                    <div className="session-detail-row">

                        <CalendarDays
                            size={18}
                        />

                        <span>
                            {formatDate(
                                session.scheduled_start
                            )}
                        </span>

                    </div>


                    {/* Time */}

                    <div className="session-detail-row">

                        <Clock3
                            size={18}
                        />

                        <span>

                            {formatTime(
                                session.scheduled_start
                            )}

                            {' • '}

                            {formatDuration(
                                session.duration_minutes
                            )}

                        </span>

                    </div>


                    {/* Status */}

                    <div className="session-detail-row">

                        {getStatusIcon(
                            session.status
                        )}

                        <span>
                            {session.status}
                        </span>

                    </div>


                    {/* Skill exchange information */}

                    {isSkillExchange && (

                        <div className="session-skills-box">

                            <div>

                                <strong>
                                    Skill Wanted
                                </strong>

                                <span>
                                    {
                                        session.skill_wanted
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Skill Offered
                                </strong>

                                <span>
                                    {
                                        session.skill_offered
                                    }
                                </span>

                            </div>

                        </div>

                    )}


                    {/* Message */}

                    {session.message && (

                        <div className="session-detail-message">

                            <strong>
                                Message
                            </strong>

                            <p>
                                {session.message}
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}


export default SessionDetailsModal