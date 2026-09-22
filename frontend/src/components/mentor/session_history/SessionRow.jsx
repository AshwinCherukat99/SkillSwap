import React,{useState} from "react";

import {
    MoreVertical,
    Eye,
    User,
    BookOpen,
    FileText,
    Wallet,
    Clock3,
} from 'lucide-react'

import SessionStatusBadge from './SessionStatusBadge'

const SessionRow=({
    session,
    onViewDetails,
})=>{
    const [showMenu,setShowMenu]=useState(false)
    const studentName=session.person_name||'student'
    const initials=studentName.split(' ').map(name=>name.charAt(0)).slice(0,2).join('').toUpperCase()
    const date=session.scheduled_start?new Date(session.scheduled_start):null
    const formattedDate =
        date
            ? date.toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: 'short',
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
    return (
        <tr>

            {/* STUDENT */}

            <td>

                <div className="d-flex align-items-center gap-3">

                    <div className="session-avatar">
                        {initials}
                    </div>

                    <div>

                        <div className="session-student-name">
                            {studentName}
                        </div>

                        {session.person_username && (
                            <div className="session-student-username">
                                @{session.person_username}
                            </div>
                        )}

                    </div>

                </div>

            </td>


            {/* COURSE */}

            <td>

                <div className="session-course-name">
                    {session.title || '-'}
                </div>

                <div className="session-course-id">
                    Session #{session.id}
                </div>

            </td>


            {/* DATE */}

            <td>

                <div className="session-date">
                    {formattedDate}
                </div>

                <div className="session-time">
                    {formattedTime}
                </div>

            </td>


            {/* DURATION */}

            <td>

                <div className="session-duration">

                    <Clock3 size={15} />

                    <span>
                        {session.duration_minutes || 0}
                        {' '}min
                    </span>

                </div>

            </td>


            {/* STATUS */}

            <td>
                <SessionStatusBadge
                    status={session.status}
                />
            </td>


            {/* ACTIONS */}

            <td className="text-end">

                <div className="session-action-wrapper">

                    <button
                        type="button"
                        className="session-action-btn"
                        onClick={() =>
                            setShowMenu(
                                !showMenu
                            )
                        }
                    >
                        <MoreVertical
                            size={18}
                        />
                    </button>


                    {showMenu && (

                        <div className="session-action-menu">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMenu(false)
                                    onViewDetails(
                                        session
                                    )
                                }}
                            >
                                <Eye size={17} />
                                View Session Details
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowMenu(false)
                                }
                            >
                                <User size={17} />
                                View Student Profile
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowMenu(false)
                                }
                            >
                                <BookOpen size={17} />
                                View Course
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowMenu(false)
                                }
                            >
                                <FileText size={17} />
                                Session Notes
                            </button>


                            <hr />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMenu(false)
                                }
                            >
                                <Wallet size={17} />
                                Earnings Breakdown
                            </button>

                        </div>

                    )}

                </div>

            </td>

        </tr>
    )
}

export default SessionRow