import React from 'react' 
import {useNavigate} from 'react-router-dom'

function TopRatedMentors({mentors=[]}){
    const navigate=useNavigate()
    const topMentors=[...mentors]
    .sort(
        (a,b)=>
            Number(b.rating||0)-Number(a.rating||0)
    )
    .slice(0,3)
    if (topMentors.length===0){
        return null
    }
    return (
        <section className="mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h3 className="mb-1">
                        Top Rated Mentors
                    </h3>

                    <p className="text-muted mb-0">
                        Learn from some of the highest-rated
                        mentors on SkillSwap.
                    </p>
                </div>

            </div>


            <div className="row g-4">

                {topMentors.map((mentor) => (

                    <div
                        className="col-md-4"
                        key={mentor.id}
                    >

                        <div className="card border-0 shadow-sm rounded-4 h-100">

                            <div className="card-body p-4 text-center">

                                {/* Profile image */}

                                <img
                                    src={
                                        mentor.profile_image ||
                                        "/default-mentor.png"
                                    }
                                    alt={
                                        mentor.full_name ||
                                        "Mentor"
                                    }
                                    className="top-mentor-image mb-3"
                                />


                                {/* Name */}

                                <div className="d-flex justify-content-center align-items-center gap-2">

                                    <h5 className="mb-0">
                                        {mentor.full_name}
                                    </h5>

                                    {mentor.is_verified && (
                                        <i
                                            className="bi bi-patch-check-fill text-success"
                                            title="Verified mentor"
                                        ></i>
                                    )}

                                </div>


                                {/* Profession */}

                                <p className="text-muted small mt-1 mb-3">
                                    {mentor.current_profession ||
                                        "Professional Mentor"}
                                </p>


                                {/* Rating */}

                                <div className="mb-3">

                                    <span className="fw-semibold">
                                        {Number(
                                            mentor.rating || 0
                                        ).toFixed(1)}
                                    </span>

                                    <i className="bi bi-star-fill text-warning ms-1"></i>

                                    <span className="text-muted small ms-1">
                                        ({mentor.total_reviews || 0} reviews)
                                    </span>

                                </div>


                                {/* Teaching niche */}

                                {mentor.teaching_niche && (
                                    <p className="text-muted small">
                                        {mentor.teaching_niche}
                                    </p>
                                )}


                                {/* Profile button */}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100 mt-2"
                                    onClick={() =>
                                        navigate(
                                            `/mentors/${mentor.id}/`
                                        )
                                    }
                                >
                                    View Profile
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    )
}

export default TopRatedMentors