function ContinueCourseCard({course,onContinue}){
    return (
        <div className="course-card continue-course-card">

            <div className="course-card-image">

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

            <div className="course-card-body">

                <h3>
                    {course.title}
                </h3>

                <p className="course-mentor">
                    {course.mentor_name}
                </p>

                <div className="progress-info">

                    <div className="d-flex justify-content-between">

                        <span>
                            Progress: {course.progress}%
                        </span>

                    </div>

                    <div className="progress course-progress">

                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                                width: `${course.progress}%`
                            }}
                            aria-valuenow={course.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />

                    </div>

                </div>

                <button
                    type="button"
                    className="btn btn-primary w-100 continue-btn"
                    onClick={() => onContinue(course.id)}
                >
                    Continue Learning
                </button>

            </div>

        </div>
    )
}

export default ContinueCourseCard