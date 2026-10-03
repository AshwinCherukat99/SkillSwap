import React from "react";

import MentorActionMenu from "./MentorActionMenu";

const MentorTable=({
    mentors,
    loading,
    onView,
    onEdit,
    onAction
})=>{
    const getStatusClass=({status})=>{
        if (status==='ACTIVE')
            return 'mentor-status-active'
        if (status==='SUSPENDED')
            return 'mentor-status-suspended'
        if (status==='BLOCKED')
            return 'mentor-status-blocked'
        return ''
    }
    return (
        <div className="table-responsive">

            <table className="table mentor-table align-middle mb-0">

                <thead>

                    <tr>
                        <th>Mentor</th>
                        <th>Expertise</th>
                        <th>Performance</th>
                        <th>Verification</th>
                        <th>Status</th>
                        <th className="text-end">
                            Actions
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {loading ? (

                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-5"
                            >
                                <div
                                    className="spinner-border text-primary"
                                ></div>
                            </td>
                        </tr>

                    ) : mentors.length === 0 ? (

                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-5 text-muted"
                            >
                                No mentors found.
                            </td>
                        </tr>

                    ) : (

                        mentors.map((mentor) => (

                            <tr
                                key={mentor.id}
                                className={
                                    mentor.status === "BLOCKED"
                                        ? "mentor-row-blocked"
                                        : ""
                                }
                            >

                                <td>

                                    <div className="d-flex align-items-center gap-3">

                                        {mentor.profile_image_url ? (

                                            <img
                                                src={
                                                    mentor.profile_image_url
                                                }
                                                className="mentor-avatar"
                                                alt={
                                                    mentor.full_name
                                                }
                                            />

                                        ) : (

                                            <div className="mentor-avatar mentor-avatar-placeholder">
                                                {(
                                                    mentor.full_name ||
                                                    mentor.username ||
                                                    "M"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                        )}

                                        <div>

                                            <div className="fw-semibold">
                                                {mentor.full_name ||
                                                    mentor.username}
                                            </div>

                                            <div className="small text-muted">
                                                @{mentor.username}
                                                {" • "}
                                                <span className="text-primary font-monospace">
                                                    {mentor.mentor_id}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                </td>

                                <td>

                                    <div className="mentor-expertise">

                                        {mentor.current_profession && (
                                            <span>
                                                {
                                                    mentor.current_profession
                                                }
                                            </span>
                                        )}

                                        {mentor.qualification && (
                                            <span>
                                                {
                                                    mentor.qualification
                                                }
                                            </span>
                                        )}

                                        {!mentor.current_profession &&
                                            !mentor.qualification && (
                                                <span className="text-muted">
                                                    Not specified
                                                </span>
                                            )}

                                    </div>

                                </td>

                                <td>

                                    <div className="mentor-performance">

                                        <div className="d-flex align-items-center gap-1">

                                            <i className="bi bi-star-fill text-warning"></i>

                                            <strong>
                                                {mentor.rating || "0.00"}
                                            </strong>

                                        </div>

                                        <small className="text-muted">
                                            {mentor.students_count}
                                            {" "}
                                            students
                                            {" • "}
                                            {mentor.courses_count}
                                            {" "}
                                            courses
                                        </small>

                                    </div>

                                </td>

                                <td>

                                    {mentor.is_verified ? (

                                        <div className="text-success small fw-semibold">
                                            <i className="bi bi-check-circle-fill me-1"></i>
                                            Verified
                                        </div>

                                    ) : (

                                        <div className="text-warning small fw-semibold">
                                            <i className="bi bi-clock me-1"></i>
                                            Pending
                                        </div>

                                    )}

                                </td>

                                <td>

                                    <span
                                        className={`mentor-status ${getStatusClass(
                                            mentor.status
                                        )}`}
                                    >

                                        <span className="status-dot"></span>

                                        {mentor.status === "ACTIVE" &&
                                            "Active"}

                                        {mentor.status === "SUSPENDED" &&
                                            "Suspended"}

                                        {mentor.status === "BLOCKED" &&
                                            "Blocked"}

                                    </span>

                                </td>

                                <td>

                                    <div className="d-flex justify-content-end align-items-center gap-1">

                                        <button
                                            type="button"
                                            className="mentor-icon-btn"
                                            title="View Profile"
                                            onClick={() =>
                                                onView(mentor)
                                            }
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>

                                        <button
                                            type="button"
                                            className="mentor-icon-btn"
                                            title="Edit Mentor"
                                            onClick={() =>
                                                onEdit(mentor)
                                            }
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>

                                        <MentorActionMenu
                                            mentor={mentor}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onAction={onAction}
                                        />

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    )
}

export default MentorTable