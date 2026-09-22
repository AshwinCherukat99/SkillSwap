const ReviewsHeader=({mentor})=>{
    const profileImage=mentor?.profile_image?mentor.profile_image.startsWith('http')?mentor.profile_image:`http://127.0.0.1:8000${mentor.profile_image}`:null
    const getInitials=()=>{
        const name=mentor?.full_name||'Mentor'
        return name.split(" ").map((word)=>word[0]).join("").slice(0,2).toUpperCase()
    }
    return (
        <header className="reviews-topbar">

            <div className="d-flex align-items-center gap-4">

                <h1 className="reviews-page-title mb-0">
                    Reviews & Ratings
                </h1>

                <div className="d-none d-md-flex gap-4">
                    <span className="reviews-top-link">
                        Direct Messages
                    </span>

                    <span className="reviews-top-link">
                        Announcements
                    </span>
                </div>

            </div>


            <div className="d-flex align-items-center gap-3">

                <button
                    type="button"
                    className="btn btn-link position-relative p-2 text-secondary"
                    title="Notifications"
                >
                    <i className="bi bi-bell fs-5"></i>

                    <span className="notification-dot"></span>
                </button>


                <div className="mentor-profile-pill">

                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={mentor?.full_name || "Mentor"}
                            className="mentor-header-avatar"
                        />
                    ) : (
                        <div className="mentor-header-avatar mentor-avatar-fallback">
                            {getInitials()}
                        </div>
                    )}

                    <span className="d-none d-sm-inline">
                        {mentor?.full_name || "Mentor"}
                    </span>

                    <i className="bi bi-chevron-down small"></i>

                </div>

            </div>

        </header>
    )
}

export default ReviewsHeader