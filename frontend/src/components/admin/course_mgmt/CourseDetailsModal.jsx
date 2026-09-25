import React from "react";

import CourseStatusBadge from "./CourseStatusBadge";

const CourseDetailsModal=({
    course,
    onClose,
    onApprove,
    onReject,
})=>{
    if (!course) return null
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,.5)"
            }}
        >

            <div className="modal-dialog modal-xl modal-dialog-scrollable">

                <div className="modal-content">

                    <div className="modal-header">

                        <div>

                            <h5 className="modal-title fw-bold">
                                {course.title}
                            </h5>

                            <div className="mt-1">
                                <CourseStatusBadge
                                    status={course.status}
                                />
                            </div>

                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <div className="row g-4 mb-4">

                            <div className="col-md-8">

                                <h6 className="fw-bold">
                                    Course Description
                                </h6>

                                <p className="text-muted">
                                    {course.description ||
                                        "No description provided."}
                                </p>

                            </div>

                            <div className="col-md-4">

                                <div className="bg-light rounded-3 p-3">

                                    <div className="mb-2">
                                        <small className="text-muted">
                                            Mentor
                                        </small>

                                        <div className="fw-semibold">
                                            {course.mentor_name}
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <small className="text-muted">
                                            Category
                                        </small>

                                        <div>
                                            {course.category_name || "—"}
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <small className="text-muted">
                                            Level
                                        </small>

                                        <div>
                                            {course.level || "—"}
                                        </div>
                                    </div>

                                    <div>
                                        <small className="text-muted">
                                            Duration
                                        </small>

                                        <div>
                                            {course.estimated_duration || "—"}
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <hr />

                        <h5 className="fw-bold mb-3">
                            Curriculum
                        </h5>

                        {course.modules?.length === 0 ? (

                            <p className="text-muted">
                                No modules available.
                            </p>

                        ) : (

                            <div className="d-flex flex-column gap-3">

                                {course.modules.map(
                                    (module, moduleIndex) => (

                                        <div
                                            key={module.id}
                                            className="border rounded-3"
                                        >

                                            <div className="p-3 bg-light">

                                                <div className="d-flex gap-3">

                                                    <div className="fw-bold">
                                                        {String(
                                                            moduleIndex + 1
                                                        ).padStart(2, "0")}
                                                    </div>

                                                    <div>

                                                        <h6 className="fw-bold mb-1">
                                                            {module.title}
                                                        </h6>

                                                        {module.description && (
                                                            <small className="text-muted">
                                                                {module.description}
                                                            </small>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="p-3">

                                                {module.lessons?.length === 0 ? (

                                                    <p className="text-muted small mb-0">
                                                        No lessons.
                                                    </p>

                                                ) : (

                                                    <div className="d-flex flex-column gap-2">

                                                        {module.lessons.map(
                                                            (
                                                                lesson,
                                                                lessonIndex
                                                            ) => (

                                                                <div
                                                                    key={lesson.id}
                                                                    className="border-bottom pb-2"
                                                                >

                                                                    <div className="fw-semibold">

                                                                        {lessonIndex + 1}.
                                                                        {" "}
                                                                        {lesson.title}

                                                                    </div>

                                                                    <small className="text-muted">

                                                                        {lesson.content}

                                                                    </small>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>

                        {course.status === "PENDING_REVIEW" && (
                            <>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() =>
                                        onReject(course)
                                    }
                                >
                                    <i className="bi bi-x-circle me-2" />
                                    Reject
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={() =>
                                        onApprove(course)
                                    }
                                >
                                    <i className="bi bi-check-circle me-2" />
                                    Approve & Publish
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CourseDetailsModal