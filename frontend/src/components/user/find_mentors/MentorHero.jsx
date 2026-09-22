import React from 'react'

function MentorHero(){
    return (
        <section className="mentor-hero">

            <div className="row align-items-center g-5">

                <div className="col-lg-7">

                    <span className="badge elite-badge">
                        ELITE EDUCATION
                    </span>

                    <h1 className="mt-3">
                        Learn From Verified{" "}
                        <span>Professionals</span>
                    </h1>

                    <p className="hero-description">
                        Accelerate your career with personalized guidance
                        from experienced professionals and industry experts.
                    </p>

                    <div className="d-flex flex-wrap gap-3">

                        <button
                            type="button"
                            className="btn btn-primary hero-btn"
                            onClick={() => {
                                document
                                    .getElementById("mentor-results")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }}
                        >
                            Explore Mentors
                        </button>

                    </div>

                </div>

                <div className="col-lg-5 text-center">

                    <div className="hero-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default MentorHero