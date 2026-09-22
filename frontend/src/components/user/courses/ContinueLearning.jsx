import ContinueCourseCard from './ContinueCourseCard'

function ContinueLearning({courses,onContinue}){
    return (
        <section className="course-section">

            <div className="section-heading">

                <div>
                    <h2>
                        Continue Learning
                    </h2>

                    <p>
                        Pick up where you left off.
                    </p>
                </div>

            </div>

            {courses.length === 0 ? (

                <div className="empty-course-message">
                    <i className="bi bi-book"></i>

                    <h5>
                        No courses in progress
                    </h5>

                    <p>
                        Enroll in a course to start learning.
                    </p>
                </div>

            ) : (

                <div className="row g-4">

                    {courses.map((course) => (

                        <div
                            className="col-12 col-md-6 col-lg-4"
                            key={course.id}
                        >

                            <ContinueCourseCard
                                course={course}
                                onContinue={onContinue}
                            />

                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}

export default ContinueLearning