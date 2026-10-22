import React from 'react'

import {ArrowLeft,Edit3} from 'lucide-react'

const CourseHeader=({course,onBack,onEdit,onSubmitForReview,submitLoading})=>{
    const statusLabel=course.status==='PUBLISHED'?'Published':course.status==='DRAFT'?'Draft':course.status==='PENDING_REVIEW'?'Pending Review':'Archived'
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

            <div>

                <div className="small text-muted mb-2">
                    Course Management
                    <span className="mx-2">/</span>
                    {course.title}
                </div>

                <div className="d-flex flex-wrap align-items-center gap-3">

                    <h1 className="h3 fw-bold mb-0">
                        {course.title}
                    </h1>

                    <span
                        className={`badge ${
                            course.status === "PUBLISHED"
                                ? "text-bg-success"
                                : course.status === "DRAFT"
                                    ? "text-bg-warning"
                                    : "text-bg-secondary"
                        }`}
                    >
                        {statusLabel}
                    </span>

                </div>

                <div className="mt-2 text-muted small">

                    <span className="me-3">
                        /courses/{course.slug}
                    </span>

                    <span className="me-3">
                        {course.category_name}
                    </span>

                    <span>
                        {course.level}
                    </span>

                </div>

            </div>


            <div className="d-flex gap-2">

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onBack}
                >
                    <ArrowLeft
                        size={17}
                        className="me-2"
                    />
                    Back to Courses
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onEdit}
                >
                    <Edit3
                        size={17}
                        className="me-2"
                    />
                    Edit Course
                </button>

                {course.status==='DRAFT'&&(
                    <button
                    type='button'
                    className='btn btn-primary'
                    onClick={onSubmitForReview}
                    disabled={submitLoading}>
                        {submitLoading?(
                            <>
                <span
                    className="spinner-border spinner-border-sm me-2"
                />
                Submitting...
            </>
                        ):(
                             <>
                <i className="bi bi-send me-2"></i>
                Submit for Review
            </>
                        )}
                    </button>
                )}

            </div>

        </div>
    )
}

export default CourseHeader