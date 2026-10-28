import React from "react";
import { useNavigate } from "react-router-dom";

function MentorCard({ mentor }) {
    const navigate = useNavigate();

    const image = mentor.profile_image || "/default-mentor.png";

    return (
        <div className="card mentor-card border-0 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column">

                {/* TOP ROW: AVATAR & INFO */}
                <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="mentor-image-container flex-shrink-0">
                        <img
                            src={image}
                            alt={mentor.full_name || mentor.username}
                            className="mentor-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-mentor.png";
                            }}
                        />
                        {mentor.is_verified && (
                            <span className="verified-icon" title="Verified mentor">
                                <i className="bi bi-patch-check-fill"></i>
                            </span>
                        )}
                    </div>

                    <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center gap-2">
                            <h5 className="mb-0 text-truncate fw-bold text-dark">
                                {mentor.username}
                            </h5>
                        </div>

                        <p className="mentor-role text-muted small mb-0 text-truncate">
                            {mentor.current_profession || "Professional Mentor"}
                        </p>

                        {mentor.organization && (
                            <p className="text-muted small mb-0 text-truncate">
                                {mentor.organization}
                            </p>
                        )}
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="mentor-stats-grid mb-3">
                    <div className="mentor-stat text-center">
                        <strong>
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {Number(mentor.rating || 0).toFixed(1)}
                        </strong>
                        <small>Rating</small>
                    </div>

                    <div className="mentor-stat text-center">
                        <strong>{mentor.total_reviews || 0}</strong>
                        <small>Reviews</small>
                    </div>

                    <div className="mentor-stat text-center">
                        <strong>{mentor.experience_years || 0}</strong>
                        <small>Years</small>
                    </div>
                </div>

                {/* TEACHING NICHE (WRAPS PROPERLY & NEVER OVERFLOWS) */}
                {mentor.teaching_niche && (
                    <div className="mentor-niche-box mb-3">
                        <p className="mentor-niche-text text-muted small mb-0">
                            {mentor.teaching_niche}
                        </p>
                    </div>
                )}

                {/* ACTION BUTTON (LOCKED TO BOTTOM) */}
                <div className="mt-auto pt-2">
                    <button
                        type="button"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        onClick={() =>
                            navigate(`/mentors/mentor-profile/${mentor.id}/`)
                        }
                    >
                        View Profile
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MentorCard;