import React from 'react'

const CourseStats=({stats})=>{
    const {total_courses,published,drafts,enrollments,average_rating,completion_rate}=stats
    const publishedPercentage=total_courses>0?Math.round((published/total_courses)*100):0 
    return (
        <div className="row g-4 mb-5">

            {/* Total Courses */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Total Courses
                    </p>

                    <h3 className="course-stat-value primary">
                        {total_courses}
                    </h3>

                </div>
            </div>

            {/* Published */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Published
                    </p>

                    <h3 className="course-stat-value">
                        {published}
                    </h3>

                    <div className="progress course-stat-progress">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${publishedPercentage}%`,
                            }}
                        />
                    </div>

                </div>
            </div>

            {/* Drafts */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Drafts
                    </p>

                    <h3 className="course-stat-value muted">
                        {drafts}
                    </h3>

                    <p className="course-stat-small">
                        Ready for review
                    </p>

                </div>
            </div>

            {/* Enrollments */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Enrollments
                    </p>

                    <h3 className="course-stat-value">
                        {enrollments}
                    </h3>

                </div>
            </div>

            {/* Rating */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Avg Rating
                    </p>

                    <div className="d-flex align-items-center gap-1">

                        <h3 className="course-stat-value mb-0">
                            {average_rating ?? "--"}
                        </h3>

                        {average_rating !== null && (
                            <span className="material-symbols-outlined course-star">
                                star
                            </span>
                        )}

                    </div>

                </div>
            </div>

            {/* Completion */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="course-stat-card h-100">

                    <p className="course-stat-label">
                        Completion
                    </p>

                    <h3 className="course-stat-value">
                        {completion_rate !== null
                            ? `${completion_rate}%`
                            : "--"}
                    </h3>

                    {completion_rate !== null && (
                        <span className="course-stat-small">
                            Course average
                        </span>
                    )}

                </div>
            </div>

        </div>
    )
}

export default CourseStats