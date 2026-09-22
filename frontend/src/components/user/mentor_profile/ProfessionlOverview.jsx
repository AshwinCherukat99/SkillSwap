function ProfessionalOverview({mentor}){
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4">

                <h3 className="h6 fw-bold mb-4 pb-3 border-bottom">
                    Professional Overview
                </h3>


                <div className="d-flex flex-column gap-4">

                    {/* Qualification */}

                    <div className="d-flex gap-3">

                        <div className="overview-icon bg-primary-subtle text-primary">

                            <span className="material-symbols-outlined">
                                school
                            </span>

                        </div>

                        <div>

                            <small className="text-uppercase text-muted fw-bold">
                                Qualification
                            </small>

                            <p className="fw-semibold mb-0">
                                {mentor.qualification || "Not provided"}
                            </p>

                        </div>

                    </div>


                    {/* Profession */}

                    <div className="d-flex gap-3">

                        <div className="overview-icon bg-success-subtle text-success">

                            <span className="material-symbols-outlined">
                                work
                            </span>

                        </div>

                        <div>

                            <small className="text-uppercase text-muted fw-bold">
                                Current Profession
                            </small>

                            <p className="fw-semibold mb-0">
                                {mentor.current_profession || "Not provided"}
                            </p>

                        </div>

                    </div>


                    {/* Experience */}

                    <div className="d-flex gap-3">

                        <div className="overview-icon bg-warning-subtle text-warning">

                            <span className="material-symbols-outlined">
                                timeline
                            </span>

                        </div>

                        <div>

                            <small className="text-uppercase text-muted fw-bold">
                                Experience
                            </small>

                            <p className="fw-semibold mb-0">

                                {mentor.experience_years
                                    ? `${mentor.experience_years} Years`
                                    : "Not provided"
                                }

                            </p>

                        </div>

                    </div>


                    {/* Rating */}

                    <div className="d-flex gap-3 pt-3 border-top">

                        <div className="overview-icon bg-warning-subtle text-warning">

                            <span className="material-symbols-outlined">
                                star
                            </span>

                        </div>

                        <div>

                            <small className="text-uppercase text-muted fw-bold">
                                Rating
                            </small>

                            <p className="fw-semibold mb-0">

                                {mentor.rating}

                                {" "}

                                <span className="text-muted fw-normal">
                                    ({mentor.total_reviews} reviews)
                                </span>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default ProfessionalOverview