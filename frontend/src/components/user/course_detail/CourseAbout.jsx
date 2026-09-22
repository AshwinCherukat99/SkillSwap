import {useState} from 'react'

function CourseAbout({course}){
    const [expanded,setExpanded]=useState(false)
    const takeaways=course.takeaways||course.learning_outcomes||[]
    return (
        <article className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">

                    <h2 className="h4 fw-bold mb-0">
                        <span className="course-section-marker"></span>
                        About This Course
                    </h2>

                    <span className="small text-muted d-none d-md-block">
                        Course Overview
                    </span>

                </div>

                <div className="text-muted lh-lg">

                    <p>
                        {course.description}
                    </p>

                    {expanded && course.detailed_description && (
                        <p>
                            {course.detailed_description}
                        </p>
                    )}

                </div>

                {/* Takeaways */}
                {takeaways.length > 0 && (
                    <div className="course-takeaways mt-4">

                        <h6 className="fw-bold mb-3">
                            <i className="bi bi-check-circle text-primary me-2"></i>
                            What you'll learn
                        </h6>

                        <div className="row g-3">

                            {takeaways.map((item, index) => (
                                <div
                                    className="col-12 col-md-6"
                                    key={index}
                                >
                                    <div className="d-flex gap-2">

                                        <i className="bi bi-check2-circle text-success mt-1"></i>

                                        <span className="small text-muted">
                                            {item}
                                        </span>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

                {/* Expand */}
                {course.detailed_description && (
                    <div className="text-center mt-4">

                        <button
                            type="button"
                            className="btn btn-link text-primary text-decoration-none fw-semibold btn-sm"
                            onClick={() =>
                                setExpanded(!expanded)
                            }
                        >
                            {expanded
                                ? "Show less"
                                : "Read complete course description"}

                            <i
                                className={`bi ${
                                    expanded
                                        ? "bi-chevron-up"
                                        : "bi-chevron-down"
                                } ms-1`}
                            ></i>
                        </button>

                    </div>
                )}

            </div>

        </article>
    )
}

export default CourseAbout