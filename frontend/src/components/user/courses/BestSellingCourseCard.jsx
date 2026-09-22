function BestSellingCourseCard({course,onViewCourse}){
    return (
        <div className="course-card discovery-course-card">

            <div className="bestseller-badge">
                🔥 Best Seller
            </div>

            <div className="discovery-course-image">

                {course.thumbnail_url ? (

                    <img
                        src={course.thumbnail_url}
                        alt={course.title}
                    />

                ) : (

                    <div className="course-image-placeholder">
                        <i className="bi bi-book"></i>
                    </div>

                )}

            </div>

            <div className="discovery-course-body">

                <h3>
                    {course.title}
                </h3>

                <p className="course-mentor">
                    {course.mentor_name}
                </p>

                <div className="course-meta">

                    <span className="course-rating">
                        <i className="bi bi-star-fill"></i>

                        {course.mentor_rating || "—"}
                    </span>

                    <span>•</span>

                    <span>
                        {course.student_count || 0} students
                    </span>

                </div>

                <div className="course-price-row">

                    <span className="course-price">
                        ₹{Number(course.price).toLocaleString("en-IN")}
                    </span>

                    <button
                        type="button"
                        className="btn btn-sm course-view-btn"
                        onClick={() => onViewCourse(course.id)}
                    >
                        View Course
                    </button>

                </div>

            </div>

        </div>
    )
}

export default BestSellingCourseCard