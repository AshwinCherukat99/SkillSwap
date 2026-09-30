import React from "react";

const LessonHeader=({
    lesson,
    onBack
})=>{
    return (
        <div className="lesson-header border-bottom">

            <div className="container-fluid px-4 py-3">

                <button
                    className="btn btn-outline-secondary mb-3"
                    onClick={onBack}
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Back to Course

                </button>


                <div>

                    <span className="badge bg-primary-subtle text-primary mb-2">

                        Lesson

                    </span>

                    <h2 className="fw-bold mb-2">

                        {lesson.title}

                    </h2>

                    <p className="text-muted mb-0">

                        {lesson.module_title}

                    </p>

                </div>

            </div>

        </div>
    )
}

export default LessonHeader