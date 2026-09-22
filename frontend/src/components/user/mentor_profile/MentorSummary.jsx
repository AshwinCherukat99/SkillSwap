function MentorSummary({summary}){
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4 p-md-5">

                <div className="d-flex align-items-center gap-2 mb-4">

                    <span className="material-symbols-outlined text-primary">
                        description
                    </span>

                    <h2 className="h5 fw-bold mb-0">
                        Professional Summary
                    </h2>

                </div>


                {summary ? (
                    <p className="text-muted lh-lg mb-0">
                        {summary}
                    </p>
                ) : (
                    <p className="text-muted mb-0">
                        No professional summary available.
                    </p>
                )}

            </div>

        </section>
    )
}

export default MentorSummary