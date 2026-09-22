import {useNavigate} from 'react-router-dom'

function CourseHero({course}){
    const navigate=useNavigate()
    const mentor=course.mentor||{}
    const mentorId=mentor.id||course.mentor_id
    const handleMentorClick=()=>{
        if (mentorId){
            navigate(`/mentors/mentor-profile/${mentorId}`)
        }
    }
    const formatLevel=(level)=>{
        if (!level){
            return ''
        }
        return level?.charAt(0).toUpperCase()+level?.slice(1).toLowerCase()
    }
    return (
        <section className="card border-0 shadow-sm course-hero-card mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="row g-4 align-items-center">

                    {/* Thumbnail */}
                    <div className="col-12 col-lg-7">

                        <div className="course-hero-thumbnail">

                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-100 h-100 object-fit-cover"
                                />
                            ) : (
                                <div className="course-thumbnail-placeholder">
                                    <i className="bi bi-book fs-1"></i>
                                </div>
                            )}

                            <div className="course-thumbnail-overlay">

                                <div className="d-flex justify-content-between align-items-start">

                                    <span className="badge bg-dark bg-opacity-75">
                                        <i className="bi bi-patch-check me-1"></i>
                                        Verified Curriculum
                                    </span>

                                    <span className="badge bg-white text-dark">
                                        {formatLevel(course.level)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Details */}
                    <div className="col-12 col-lg-5">

                        <div className="d-flex flex-wrap gap-2 mb-3">

                            <span className="badge rounded-pill bg-primary-subtle text-primary">
                                {course.category?.name ||
                                    course.category}
                            </span>

                            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                                {formatLevel(course.level)}
                            </span>

                            {course.is_bestseller && (
                                <span className="badge rounded-pill bg-success-subtle text-success">
                                    <i className="bi bi-star-fill me-1"></i>
                                    Bestseller
                                </span>
                            )}

                        </div>

                        <h1 className="fw-bold text-dark mb-3">
                            {course.title}
                        </h1>

                        <p className="text-muted lh-lg mb-3">
                            {course.description}
                        </p>

                        {/* Rating */}
                        <div className="d-flex flex-wrap align-items-center gap-3 py-3 border-top border-bottom">

                            <div className="d-flex align-items-center gap-2">

                                <span className="fw-bold text-dark">
                                    {course.rating || "0.0"}
                                </span>

                                <span className="text-warning">
                                    ★★★★★
                                </span>

                                <span className="text-muted small">
                                    ({course.total_reviews || 0} reviews)
                                </span>

                            </div>

                            <div className="vr d-none d-sm-block"></div>

                            <div className="small text-muted">
                                <i className="bi bi-people me-1"></i>
                                <strong className="text-dark">
                                    {course.enrollment_count || 0}
                                </strong>{" "}
                                learners
                            </div>

                        </div>

                        {/* Mentor */}
                        <div className="mt-3">

                            <div className="text-uppercase small fw-bold text-muted mb-2">
                                Taught by
                            </div>

                            <button
                                type="button"
                                className="course-mentor-box w-100 text-start"
                                onClick={handleMentorClick}
                            >

                                <div className="d-flex align-items-center gap-3">

                                    {mentor.profile_image ? (
                                        <img
                                            src={mentor.profile_image}
                                            alt={mentor.username}
                                            className="course-mentor-image"
                                        />
                                    ) : (
                                        <div className="course-mentor-placeholder">
                                            <i className="bi bi-person"></i>
                                        </div>
                                    )}

                                    <div className="min-w-0">

                                        <div className="fw-bold text-dark">
                                            @{mentor.username}
                                        </div>

                                        <div className="small text-muted">
                                            {mentor.current_profession ||
                                                "Verified Mentor"}
                                        </div>

                                        <div className="small text-muted mt-1">
                                            {mentor.experience_years
                                                ? `${mentor.experience_years} Years Experience`
                                                : ""}
                                            {mentor.rating
                                                ? ` • ★ ${mentor.rating}`
                                                : ""}
                                        </div>

                                    </div>

                                    <i className="bi bi-chevron-right ms-auto text-primary"></i>

                                </div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default CourseHero