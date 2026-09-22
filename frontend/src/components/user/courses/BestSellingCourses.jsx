import BestSellingCourseCard from './BestSellingCourseCard'

function BestSellingCourses({courses,onViewCourses}){
    return (
        <section className="course-section course-section-border">

            <div className="section-heading">

                <h2>
                    Best-Selling Courses
                </h2>

                <p>
                    Popular courses loved by learners across SkillSwap.
                </p>

            </div>

            {courses.length === 0 ? (

                <div className="empty-course-message">

                    <i className="bi bi-fire"></i>

                    <h5>
                        No courses available
                    </h5>

                </div>

            ) : (

                <div className="row g-4">

                    {courses.map((course) => (

                        <div
                            className="col-12 col-sm-6 col-lg-3"
                            key={course.id}
                        >

                            <BestSellingCourseCard
                                course={course}
                                onViewCourse={onViewCourses}
                            />

                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}

export default BestSellingCourses