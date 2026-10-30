import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudentCard=({student,onScheduleSession,onMessage})=>{
    const navigate=useNavigate()
    const initials=(student.full_name||student.username||'?').split(' ').map((name)=>name[0]).join('').slice(0,2).toUpperCase()
    const handleViewProfile=()=>{
        const enrollmentId=student.enrollments?.[0]?.id
        if (!enrollmentId){
            console.error('no enrollment found for this student')
            return
        }
        navigate(`/mentor/students/${enrollmentId}/`)
    }
    return (
        <div className="col-12 col-md-6">
            <div className="mentor-student-card h-100">

                <div className="d-flex justify-content-between align-items-start mb-1">

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

                            <span className="small text-secondary">

                                {student.courses.length}

                                {" "}

                                {student.courses.length === 1
                                    ? "Course"
                                    : "Courses"}

                            </span>

                        </div>

                    </div>


                    {/* Overall status */}

                    <span className="badge bg-success-subtle text-success">

                        Active

                    </span>

                </div>



                {/* ================================= */}
                {/* Enrolled Courses */}
                {/* ================================= */}

                <div className="mb-3">

                    <div className="small fw-semibold text-secondary mb-2">

                        Enrolled Courses

                    </div>


                    <div className="d-flex flex-column gap-1">

                        {student.courses.map((course) => {

                            const progress =
                                Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(
                                            course.progress
                                        ) || 0
                                    )
                                )

                            return (

                                <div
                                    key={
                                        course.enrollment_id
                                    }
                                    className="student-course-progress py-1"
                                >


                                    {/* Course title + percentage */}

                                    <div className="d-flex justify-content-between align-items-center mb-1">

                                        <span
                                            className="badge bg-primary-subtle text-primary"
                                        >

                                            {course.course_title}

                                        </span>


                                        <span className="small fw-bold text-primary">

                                            {progress}%

                                        </span>

                                    </div>


                                    {/* Progress */}

                                    <div
                                        className="progress"
                                        style={{
                                            height: "5px"
                                        }}
                                    >

                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width:
                                                    `${progress}%`
                                            }}
                                            aria-valuenow={
                                                progress
                                            }
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />

                                    </div>


                                    {/* Course status */}

                                    <div className="mt-1">

                                        {course.completed_at ? (

                                            <span className="small text-success">

                                                <i className="bi bi-check-circle-fill me-1"></i>

                                                Completed

                                            </span>

                                        ) : (

                                            <span className="small text-secondary">

                                                <i className="bi bi-clock me-1"></i>

                                                In Progress

                                            </span>

                                        )}

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                </div>



                {/* ================================= */}
                {/* Actions */}
                {/* ================================= */}

                <div className="border-top pt-3">

                    <div className="d-flex flex-wrap justify-content-end gap-2">


                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={() =>
                                onMessage &&
                                onMessage(student)
                            }
                        >

                            <i className="bi bi-chat-dots me-1"></i>

                            Message

                        </button>


                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                                onScheduleSession &&
                                onScheduleSession(student)
                            }
                        >

                            <i className="bi bi-camera-video me-1"></i>

                            Schedule Session

                        </button>


                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={
                                handleViewProfile
                            }
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