import React from "react";

const CourseActionMenu=({
    course,
    onView,
    onApprove,
    onReject
})=>{
    return (
        <div className="dropdown">

            <button
                className="btn btn-sm btn-light"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-three-dots-vertical" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() => onView(course)}
                    >
                        <i className="bi bi-eye me-2" />
                        View Course
                    </button>
                </li>

                {course.status === "PENDING_REVIEW" && (
                    <>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <button
                                className="dropdown-item text-success"
                                onClick={() => onApprove(course)}
                            >
                                <i className="bi bi-check-circle me-2" />
                                Approve & Publish
                            </button>
                        </li>

                        <li>
                            <button
                                className="dropdown-item text-danger"
                                onClick={() => onReject(course)}
                            >
                                <i className="bi bi-x-circle me-2" />
                                Reject
                            </button>
                        </li>
                    </>
                )}

                </ul>

        </div>
    )
}

export default CourseActionMenu