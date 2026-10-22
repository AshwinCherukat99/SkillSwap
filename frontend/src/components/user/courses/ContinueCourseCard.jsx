function ContinueCourseCard({course,onContinue}){
    const progress=Math.min(
        100,
        Math.max(0,Number(course.progress||0))
    )
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
        <span>Progress: {progress}%</span>
    </div>

    <div
        className="progress course-progress"
        role="progressbar"
        aria-label={`${course.title} progress`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
    >
        <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
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