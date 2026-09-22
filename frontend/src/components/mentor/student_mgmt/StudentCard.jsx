import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudentCard=({student,onScheduleSession,onMessage})=>{
    const navigate=useNavigate()
    const progress=student.progress??0
    const initials=(student.full_name||student.username||'?').split(' ').map((name)=>name[0]).join('').slice(0,2).toUpperCase()
    const handleViewProfile=()=>{
        navigate(`/mentor/students/${student.student_id}/`)
    }
    return (
        <div className="col-12 col-md-6">
            <div className="mentor-student-card h-100">

                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div className="d-flex align-items-center gap-3">

                        {student.profile_image ? (
                            <img
                                src={student.profile_image}
                                alt={student.full_name}
                                className="mentor-student-avatar"
                            />
                        ) : (
                            <div className="mentor-student-avatar mentor-student-avatar-placeholder">
                                {initials}
                            </div>
                        )}

                        <div>
                            <h5 className="mb-1 fw-bold">
                                {student.full_name || student.username}
                            </h5>

                            <span className="badge text-bg-light text-primary">
                                {student.course_title || "Course"}
                            </span>
                        </div>

                    </div>

                    <span className="badge bg-success-subtle text-success">
                        Active
                    </span>

                </div>

                <div className="mb-4">

                    <div className="d-flex justify-content-between mb-2">
                        <span className="small text-secondary">
                            Course Progress
                        </span>

                        <span className="small fw-bold text-primary">
                            {progress}%
                        </span>
                    </div>

                    <div
                        className="progress"
                        style={{ height: "8px" }}
                    >
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>

                </div>

                <div className="border-top pt-3">

                    <div className="d-flex flex-wrap justify-content-end gap-2">

                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={() => onMessage(student)}
                        >
                            <i className="bi bi-chat-dots me-1"></i>
                            Message
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onScheduleSession(student)}
                        >
                            <i className="bi bi-camera-video me-1"></i>
                            Request Session
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleViewProfile}
                        >
                            View Profile
                        </button>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default StudentCard