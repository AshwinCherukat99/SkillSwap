import {useNavigate} from 'react-router-dom'

function MentorCourses({mentor,courses}){
    const navigate=useNavigate()
    const formatDuration=(minutes)=>{
        if (!minutes){
            return 'duration not speciifed'
        }
        const hours=Math.floor(minutes/60)
        const remainingMinutes=minutes%60
        if (hours>0&&remainingMinutes>0){
            return `${hours}h ${remainingMinutes}m`
        }
        if (hours>0){
            return `${hours}h`
        }
        return `${remainingMinutes}m`
    }
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4 p-md-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <div className="d-flex align-items-center gap-2">

                            <span className="material-symbols-outlined text-primary">
                                school
                            </span>

                            <h2 className="h5 fw-bold mb-0">
                                Courses by @{mentor.username}
                            </h2>

                        </div>

                        <p className="text-muted small mb-0 mt-1">
                            Popular courses from this mentor
                        </p>

                    </div>

                </div>


                {courses.length === 0 ? (

                    <div className="text-center py-4">

                        <span className="material-symbols-outlined text-muted fs-1">
                            menu_book
                        </span>

                        <p className="text-muted mb-0 mt-2">
                            This mentor has no published courses yet.
                        </p>

                    </div>

                ) : (

                    <div className="row g-3">

                        {courses.map((course, index) => (

                            <div
                                className="col-md-6"
                                key={course.id}
                            >

                                <div className="border rounded-3 h-100 p-3">

                                    {course.thumbnail && (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-100 rounded-3 mb-3 mentor-course-thumbnail"
                                        />
                                    )}


                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">

                                        <span className="badge bg-primary-subtle text-primary">

                                            {course.category}

                                        </span>

                                        <span className="fw-bold">

                                            ₹{course.price}

                                        </span>

                                    </div>


                                    <h3 className="h6 fw-bold">

                                        {course.title}

                                    </h3>


                                    <p className="small text-muted course-description">

                                        {course.description}

                                    </p>


                                    <div className="border-top pt-3 mt-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <span className="small text-muted">

                                                <span className="material-symbols-outlined align-middle small">
                                                    groups
                                                </span>

                                                {" "}
                                                {course.enrollment_count}
                                                {" "}
                                                learners

                                            </span>


                                            <button
                                                className="btn btn-sm btn-link text-primary text-decoration-none fw-semibold"
                                                onClick={() =>
                                                    navigate(
                                                        `/courses/${course.slug}`
                                                    )
                                                }
                                            >
                                                Details
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>
    )
}

export default MentorCourses