function MentorProfileHeader({
    mentor,
    onRequestSession
}){
    const getImageUrl=(image)=>{
        if (!image){
            return '/default-mentor.png'
        }
        if (image.startsWith('http')){
            return image
        }
        return `http://127.0.0.1:8000${image}`
    }
    return (
        <section className="container">

            <div className="card border-0 shadow-sm mentor-header-card">

                <div className="card-body p-4 p-md-5">

                    <div className="row align-items-center g-4">

                        {/* Profile */}

                        <div className="col-md-8">

                            <div className="d-flex align-items-center gap-4">

                                <div className="position-relative">

                                    <img
                                        src={getImageUrl(
                                            mentor.profile_image
                                        )}
                                        alt={mentor.username}
                                        className="mentor-profile-image"
                                    />

                                    <span className="mentor-verified-badge">
                                        <span className="material-symbols-outlined">
                                            verified
                                        </span>
                                    </span>

                                </div>


                                <div>

                                    <div className="d-flex flex-wrap align-items-center gap-2">

                                        <h1 className="h2 fw-bold mb-0">
                                            @{mentor.username}
                                        </h1>

                                        <span className="badge bg-success-subtle text-success">
                                            Verified Mentor
                                        </span>

                                    </div>


                                    {mentor.current_profession && (
                                        <p className="text-muted mt-2 mb-2">
                                            {mentor.current_profession}
                                        </p>
                                    )}


                                    <div className="d-flex flex-wrap align-items-center gap-3">

                                        <span className="badge bg-warning-subtle text-warning-emphasis">

                                            <span className="material-symbols-outlined align-middle small">
                                                star
                                            </span>

                                            {mentor.rating}

                                        </span>


                                        <span className="text-muted small">

                                            {mentor.total_reviews}
                                            {" "}
                                            learner reviews

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Actions */}

                        <div className="col-md-4">

                            <div className="d-flex flex-column gap-2">

                                <button
                                    className="btn btn-primary"
                                    onClick={onRequestSession}
                                >
                                    <span className="material-symbols-outlined align-middle me-1">
                                        calendar_today
                                    </span>

                                    Request Session
                                </button>


                                <button className="btn btn-outline-secondary">

                                    <span className="material-symbols-outlined align-middle me-1">
                                        chat
                                    </span>

                                    Message

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default MentorProfileHeader