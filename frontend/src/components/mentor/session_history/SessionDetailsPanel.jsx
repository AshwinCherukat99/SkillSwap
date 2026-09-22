import React from "react";

import {
    X,
    CalendarDays,
    Clock3,
    User,
    BookOpen,
    MessageSquare,
} from 'lucide-react'

import SessionStatusBadge from "./SessionStatusBadge";

const SessionDetailsPanel=({
    session,
    onClose,
})=>{
    if (!session){
        return null
    }
    const date=session.scheduled_start?new Date(session.scheduled_start):null
    const formattedDate =
        date
            ? date.toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }
            )
            : '-'


    const formattedTime =
        date
            ? date.toLocaleTimeString(
                'en-IN',
                {
                    hour: 'numeric',
                    minute: '2-digit',
                }
            )
            : '-'

    const studentName=session.person_name||'student'
    const initails=studentName.split(' ').map(word=>word.charAt(0)).slice(0,2).join('').toUpperCase()
    return (
        <div
            className="session-details-overlay"
            onClick={onClose}
        >

            <div
                className="session-details-panel"
                onClick={e =>
                    e.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="session-details-header">

                    <div className="d-flex align-items-center gap-3">

                        <div className="session-details-icon">
                            <BookOpen size={22} />
                        </div>

                        <div>

                            <div className="d-flex align-items-center gap-2 flex-wrap">

                                <h3 className="mb-0">
                                    Session #{session.id}
                                </h3>

                                <SessionStatusBadge
                                    status={
                                        session.status
                                    }
                                />

                            </div>

                            <small className="text-muted">
                                Mentorship Session
                            </small>

                        </div>

                    </div>


                    <button
                        className="session-details-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>


                <div className="session-details-body">

                    {/* SNAPSHOT */}

                    <div className="session-snapshot">

                        <div>
                            <span>
                                Date
                            </span>

                            <strong>
                                {formattedDate}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Time
                            </span>

                            <strong>
                                {formattedTime}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Duration
                            </span>

                            <strong>
                                {session.duration_minutes}
                                {' '}Minutes
                            </strong>
                        </div>

                    </div>


                    {/* STUDENT */}

                    <div className="session-detail-card">

                        <div className="d-flex align-items-center gap-3">

                            <div className="session-details-avatar">
                                {initials}
                            </div>

                            <div>

                                <span className="detail-label">
                                    Student
                                </span>

                                <h5 className="mb-0">
                                    {studentName}
                                </h5>

                                {session.person_username && (
                                    <small className="text-muted">
                                        @{session.person_username}
                                    </small>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* COURSE */}

                    <div className="session-detail-card">

                        <span className="detail-label">
                            Course
                        </span>

                        <h5>
                            {session.title || '-'}
                        </h5>

                    </div>


                    {/* MESSAGE */}

                    {session.message && (
                        <div className="session-message-card">

                            <div className="d-flex align-items-center gap-2 mb-2">

                                <MessageSquare
                                    size={17}
                                />

                                <strong>
                                    Session Objective
                                </strong>

                            </div>

                            <p className="mb-0">
                                {session.message}
                            </p>

                        </div>
                    )}


                    {/* CREATED */}

                    <div className="session-detail-meta">

                        <span>
                            Created
                        </span>

                        <strong>
                            {session.created_at
                                ? new Date(
                                    session.created_at
                                ).toLocaleString(
                                    'en-IN'
                                )
                                : '-'}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SessionDetailsPanel