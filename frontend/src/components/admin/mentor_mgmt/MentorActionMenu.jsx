import React from "react";

const MentorActionMenu=({
    mentor,
    onView,
    onEdit,
    onAction
})=>{
    const handleAction=(action)=>{
        onAction(mentor,action)
    }
    return (
        <div className="dropdown">

            <button
                className="btn btn-sm mentor-more-btn"
                data-bs-toggle="dropdown"
                type="button"
            >
                <i className="bi bi-three-dots-vertical"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onView(mentor)
                        }
                    >
                        <i className="bi bi-eye me-2"></i>
                        View Profile
                    </button>
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onEdit(mentor)
                        }
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Mentor
                    </button>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onView(mentor, "courses")
                        }
                    >
                        <i className="bi bi-book me-2"></i>
                        View Courses
                    </button>
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onView(mentor, "sessions")
                        }
                    >
                        <i className="bi bi-calendar-event me-2"></i>
                        View Sessions
                    </button>
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onView(mentor, "earnings")
                        }
                    >
                        <i className="bi bi-cash-stack me-2"></i>
                        View Earnings
                    </button>
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        onClick={() =>
                            onView(mentor, "payouts")
                        }
                    >
                        <i className="bi bi-wallet2 me-2"></i>
                        View Payouts
                    </button>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                {mentor.status === "ACTIVE" && (
                    <>
                        <li>
                            <button
                                className="dropdown-item text-warning"
                                onClick={() =>
                                    handleAction("suspend")
                                }
                            >
                                <i className="bi bi-pause-circle me-2"></i>
                                Suspend Mentor
                            </button>
                        </li>

                        <li>
                            <button
                                className="dropdown-item text-danger"
                                onClick={() =>
                                    handleAction("block")
                                }
                            >
                                <i className="bi bi-person-x me-2"></i>
                                Block Mentor
                            </button>
                        </li>
                    </>
                )}

                {mentor.status === "SUSPENDED" && (
                    <>
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() =>
                                    handleAction("activate")
                                }
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Activate Mentor
                            </button>
                        </li>

                        <li>
                            <button
                                className="dropdown-item text-danger"
                                onClick={() =>
                                    handleAction("block")
                                }
                            >
                                <i className="bi bi-person-x me-2"></i>
                                Block Mentor
                            </button>
                        </li>
                    </>
                )}

                {mentor.status === "BLOCKED" && (
                    <li>
                        <button
                            className="dropdown-item"
                            onClick={() =>
                                handleAction("activate")
                            }
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Unblock Mentor
                        </button>
                    </li>
                )}

            </ul>

        </div>
    )
}

export default MentorActionMenu