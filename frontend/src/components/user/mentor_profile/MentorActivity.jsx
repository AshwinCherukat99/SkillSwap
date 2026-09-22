function MentorActivity({mentor}){
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4">

                <h3 className="small text-uppercase text-muted fw-bold mb-3">
                    Mentor Activity
                </h3>


                <div className="row g-3 text-center">

                    <div className="col-6">

                        <div className="bg-light rounded-3 p-3">

                            <div className="fs-4 fw-bold">
                                {mentor.total_reviews}
                            </div>

                            <small className="text-muted">
                                Reviews
                            </small>

                        </div>

                    </div>


                    <div className="col-6">

                        <div className="bg-light rounded-3 p-3">

                            <div className="fs-4 fw-bold text-success">
                                {mentor.rating}
                            </div>

                            <small className="text-muted">
                                Rating
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default MentorActivity