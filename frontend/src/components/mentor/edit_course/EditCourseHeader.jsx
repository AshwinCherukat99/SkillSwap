import React from "react";

import {useNavigate} from 'react-router-dom'         

function EditCourseHeader({course}){
    const navigate=useNavigate()
    const isPublished=course.status==='PUBLISHED'
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

            <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-light border"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Back
                    </button>
                </div>

                <h2 className="fw-bold mb-1">
                    Edit Course
                </h2>

                <p className="text-muted mb-0">
                    Update your course information, modules and lessons.
                </p>
            </div>

            <div>
                {isPublished ? (
                    <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2">
                        <i className="bi bi-clock-history me-1"></i>
                        Published → Pending Review
                    </span>
                ) : (
                    <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                        <i className="bi bi-file-earmark me-1"></i>
                        Draft
                    </span>
                )}
            </div>

        </div>
    )
}

export default EditCourseHeader