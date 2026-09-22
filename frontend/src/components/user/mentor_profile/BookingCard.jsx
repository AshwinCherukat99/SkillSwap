function BookingCard({mentor}){
    return (
        <section className="card border-primary shadow-sm">

            <div className="card-body p-4">

                <span className="badge bg-primary-subtle text-primary mb-3">

                    <span className="material-symbols-outlined align-middle small">
                        schedule
                    </span>

                    {" "}
                    1-on-1 Mentorship

                </span>


                <h3 className="h5 fw-bold">
                    Learn from @{mentor.username}
                </h3>


                <p className="small text-muted">
                    Book a dedicated mentoring session and get
                    personalized guidance.
                </p>


                <button className="btn btn-primary w-100">

                    <span className="material-symbols-outlined align-middle me-1">
                        event_available
                    </span>

                    Request Session

                </button>


                <div className="border-top mt-4 pt-3">

                    <div className="small text-muted mb-2">

                        <span className="material-symbols-outlined align-middle text-success">
                            check_circle
                        </span>

                        {" "}
                        Personalized mentoring

                    </div>


                    <div className="small text-muted mb-2">

                        <span className="material-symbols-outlined align-middle text-success">
                            videocam
                        </span>

                        {" "}
                        Video sessions

                    </div>


                    <div className="small text-muted">

                        <span className="material-symbols-outlined align-middle text-success">
                            history_toggle_off
                        </span>

                        {" "}
                        Flexible scheduling

                    </div>

                </div>

            </div>

        </section>
    )
}

export default BookingCard