import RecommendedCourseCard from './RecommendedCourseCard'

function RecommendedCourses({courses,onViewCourse}){
    return (
        <section className="course-section course-section-border">

            <div className="section-heading">

                <h2>
                    Recommended For You
                </h2>

                <p>
                    Courses selected based on your learning interests
                    and previous activity.
                </p>

            </div>

            {courses.length === 0 ? (

                <div className="empty-course-message">
                    <i className="bi bi-stars"></i>

                    <h5>
                        No recommendations available
                    </h5>

                    <p>
                        Check back after exploring some courses.
                    </p>
                </div>

            ) : (

                <div className="row g-4">

                    {courses.map((course) => (

                        <div
                            className="col-12 col-sm-6 col-lg-3"
                            key={course.id}
                        >

                            <RecommendedCourseCard
                                course={course}
                                onViewCourse={onViewCourse}
                            />

                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}

export default RecommendedCourses