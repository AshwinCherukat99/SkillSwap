import React from "react";

const statusClass=(status)=>{
    switch(status){
        case 'COMPLETED':
            return 'bg-success-subtle text-success'
        case 'SCHEDULED':
            return "bg-warning-subtle text-warning"
        case 'CANCELLED':
            return 'bg-danger-subtle text-danger'
        case 'REJECTED':
            return 'bg-secondary-subtle text-secondary'
        case 'EXPIRED':
            return 'bg-dark-subtle text-dark'
        default:
            return 'bg-light text-dark'
    }
}
const formatDate=(date)=>{
    if (!date) return '-'
    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month:'short',
            day:'numeric',
            year:'numeric',
        }
    )
}
const formatTime=(date)=>{
    if (!date) return '-'
    return new Date(date).toLocaleTimeString(
        [],
        {
            hour:'2-digit',
            minute:'2-digit',
        }
    )
}
const SessionTable=({sessions,
    onCancel,
    onReschedule,
onComplete})=>{
    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

            <div className="table-responsive">

                <table className="table align-middle mb-0">

                    <thead className="table-light">

                        <tr>

                            <th className="px-4 py-3">
                                Session ID
                            </th>

                            <th>
                                Mentor/Requester
                            </th>

                            <th>
                                Learner/Receiver
                            </th>

                            <th>
                                Skill / Course
                            </th>

                            <th>
                                Schedule
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Rating
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {sessions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-5"
                                >

                                    <i className="bi bi-calendar-x fs-1 text-muted"></i>

                                    <p className="text-muted mt-3 mb-0">
                                        No sessions found.
                                    </p>

                                </td>

                            </tr>

                        ) : (

                            sessions.map((session) => (

                                <tr key={`${session.session_type}-${session.id}`}>

                                    {/* ID */}

                                    <td className="px-4">

                                        <span className="badge text-primary bg-primary-subtle">
                                            {session.session_id}
                                        </span>

                                    </td>

                                    {/* Mentor */}

                                    <td>

                                        <Person
                                            person={session.mentor||session.recipient}
                                        />

                                    </td>

                                    {/* Learner */}

                                    <td>

                                        <Person
                                            person={session.learner||session.requester}
                                        />

                                    </td>

                                    {/* Skill */}

                                    <td>

                                        <div className="fw-semibold">

                                            {session.skill}

                                        </div>

                                        <small className="text-muted">

                                            {session.session_type ===
                                            "COURSE"
                                                ? "Course Session"
                                                : "Skill Exchange Session"}

                                        </small>

                                    </td>

                                    {/* Schedule */}

                                    <td>

                                        <div className="fw-semibold">

                                            {formatDate(
                                                session.scheduled_start
                                            )}

                                        </div>

                                        <small className="text-muted">

                                            {formatTime(
                                                session.scheduled_start
                                            )}

                                            {" • "}

                                            {session.duration_minutes}m

                                        </small>

                                    </td>

                                    {/* Status */}

                                    <td>

                                        <span
                                            className={`badge rounded-pill ${statusClass(
                                                session.status
                                            )}`}
                                        >
                                            {session.status}
                                        </span>

                                    </td>

                                    {/* Rating */}

                                    <td>

                                        {session.rating !== null &&
                                        session.rating !== undefined ? (

                                            <span>
                                                {session.rating}
                                                <i className="bi bi-star-fill text-warning ms-1"></i>
                                            </span>

                                        ) : (

                                            <span className="text-muted">
                                                —
                                            </span>

                                        )}

                                    </td>

                                    {/* Actions */}

                                    <td>

                                        <div className="dropdown">

                                            <button
                                                className="btn btn-sm btn-light"
                                                data-bs-toggle="dropdown"
                                            >
                                                <i className="bi bi-three-dots"></i>
                                            </button>

                                            <ul className="dropdown-menu dropdown-menu-end">

                                                {session.status ===
                                                    "SCHEDULED" && (

                                                    <>
                                                        <li>
                                                        <button 
                                                        type='button'
                                                        className="dropdown-item"
                                                        onClick={()=>onReschedule(session)}>
                                                            <i className="bi bi-calendar-event me-2"></i>
                                                            Reschedule Session
                                                        </button>
                                                    </li>
                                                        <li>
                                                        <button 
                                                        type='button'
                                                        className="dropdown-item text-success"
                                                        onClick={()=>onComplete(session)}>
                                                            <i className="bi bi-x-circle me-2"></i>
                                                            Mark As Completed
                                                        </button>
                                                    </li>
                                                        <li>
                                                        <button 
                                                        type='button'
                                                        className="dropdown-item text-danger"
                                                        onClick={()=>onCancel(session)}>
                                                            <i className="bi bi-x-circle me-2"></i>
                                                            Cancel Session
                                                        </button>
                                                    </li>
                                                    </>


                                                )}

                                            </ul>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    )
}
const Person=({person})=>{
    return (
        <div className="d-flex align-items-center gap-2">

            {person?.profile_image ? (

                <img
                    src={person.profile_image}
                    alt={person.name}
                    className="rounded-circle"
                    width="36"
                    height="36"
                    style={{
                        objectFit: "cover"
                    }}
                />

            ) : (

                <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                    style={{
                        width: "36px",
                        height: "36px"
                    }}
                >
                    {person?.name?.charAt(0)?.toUpperCase()}
                </div>

            )}

            <span className="fw-semibold">
                {person?.name || "Unknown"}
            </span>

        </div>
    )
}

export default SessionTable