import React from "react";

import CourseStatusBadge from "./CourseStatusBadge";
import CourseActionMenu from "./CourseActionMenu";

const CourseRow=({
    course,
    onView,
    onApprove,
    onReject,
})=>{
    return (
        <tr>

            <td>

                <div className="d-flex align-items-center gap-3">

                    <div className="admin-course-thumbnail">

                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                            />
                        ) : (
                            <i className="bi bi-book" />
                        )}

                    </div>

                    <div>

                        <h6 className="fw-semibold mb-1">
                            {course.title}
                        </h6>

                        <small className="text-muted">
                            #{course.id}
                        </small>

                    </div>

                </div>

            </td>

            <td>

                <div className="fw-semibold">
                    {course.mentor_name || "Unknown"}
                </div>

                {course.mentor_username && (
                    <small className="text-muted">
                        @{course.mentor_username}
                    </small>
                )}

            </td>

            <td>
                {course.category_name || "—"}
            </td>

            <td>

                <div className="small">
                    {course.modules_count || 0} modules
                </div>

                <div className="small text-muted">
                    {course.lessons_count || 0} lessons
                </div>

            </td>

            <td>

                <span className="fw-semibold">
                    {course.price > 0
                        ? `₹${course.price}`
                        : "Free"}
                </span>

            </td>

            <td>
                <CourseStatusBadge
                    status={course.status}
                />
            </td>

            <td>

                <CourseActionMenu
                    course={course}
                    onView={onView}
                    onApprove={onApprove}
                    onReject={onReject}
                />

            </td>

        </tr>
    )
}

export default CourseRow