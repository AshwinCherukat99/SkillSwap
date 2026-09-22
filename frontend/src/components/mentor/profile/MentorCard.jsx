import React from 'react'
import {useNavigate} from 'react-router-dom'

function MentorCard({mentor}){
    const navigate=useNavigate()
    const image=mentor.profile_image||'/default-mentor.png' 
    return (
        <div className="card mentor-card border-0 shadow-sm h-100">

            <div className="card-body p-4">

                <div className="d-flex align-items-start gap-3">

                    <img
                        src={image}
                        alt={mentor.full_name}
                        className="mentor-card-image"
                    />

                    <div className="flex-grow-1">

                        <div className="d-flex align-items-center gap-2">

                            <h5 className="mb-1">
                                {mentor.full_name}
                            </h5>

                            {mentor.is_verified && (
                                <i
                                    className="bi bi-patch-check-fill text-success"
                                    title="Verified mentor"
                                ></i>
                            )}

                        </div>

                        <p className="text-muted small mb-1">
                            {mentor.current_profession ||
                                "Professional Mentor"}
                        </p>

                        {mentor.organization && (
                            <p className="text-muted small mb-0">
                                {mentor.organization}
                            </p>
                        )}

                    </div>

                </div>

                <div className="d-flex gap-4 mt-4">

                    <div>
                        <strong>
                            {Number(mentor.rating || 0).toFixed(1)}
                        </strong>

                        <div className="small text-muted">
                            <i className="bi bi-star-fill text-warning"></i>{" "}
                            Rating
                        </div>
                    </div>

                    <div>
                        <strong>
                            {mentor.total_reviews || 0}
                        </strong>

                        <div className="small text-muted">
                            Reviews
                        </div>
                    </div>

                    <div>
                        <strong>
                            {mentor.experience_years || 0}
                        </strong>

                        <div className="small text-muted">
                            Years
                        </div>
                    </div>

                </div>

                {mentor.teaching_niche && (
                    <p className="text-muted small mt-3 mb-3">
                        {mentor.teaching_niche}
                    </p>
                )}

                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() =>
                        navigate(`/mentors/${mentor.id}/`)
                    }
                >
                    View Profile
                </button>

            </div>

        </div>
    )
}

export default MentorCard