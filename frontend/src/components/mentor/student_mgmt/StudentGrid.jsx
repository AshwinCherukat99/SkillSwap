import React from 'react'
import StudentCard from './StudentCard'

const StudentGrid=({students,loading,onScheduleSession,onMessage})=>{
    if (loading){
        return (
            <div className="row g-4">

                {[1, 2, 3, 4].map((item) => (
                    <div
                        className="col-12 col-md-6"
                        key={item}
                    >
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">

                                <div className="placeholder-glow">

                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <span
                                            className="placeholder rounded-circle"
                                            style={{
                                                width: "64px",
                                                height: "64px",
                                            }}
                                        />

                                        <div className="flex-grow-1">
                                            <span className="placeholder col-7 mb-2"></span>
                                            <span className="placeholder col-4"></span>
                                        </div>
                                    </div>

                                    <span className="placeholder col-12 mb-2"></span>
                                    <span className="placeholder col-8"></span>

                                </div>

                            </div>
                        </div>
                    </div>
                ))}

            </div>
        )
    }
    if (!students.length){
        return (
            <div className="alert alert-light border text-center py-5">
                <i className="bi bi-people fs-1 text-secondary"></i>

                <h5 className="mt-3">
                    No students found
                </h5>

                <p className="text-secondary mb-0">
                    Students matching your filters will appear here.
                </p>
            </div>
        )
    }
    return (
        <div className="row g-4">

            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    onScheduleSession={onScheduleSession}
                    onMessage={onMessage}
                />
            ))}

        </div>
    )
}

export default StudentGrid