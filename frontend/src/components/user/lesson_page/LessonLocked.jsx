import React from "react";

const LessonLocked=({
    message,
    onBack
})=>{
    return (
        <div className="container py-5">

            <div className="card border-0 shadow-sm">

                <div className="card-body text-center py-5">

                    <div className="mb-3">

                        <i className="bi bi-lock-fill display-4 text-muted"></i>

                    </div>

                    <h4 className="fw-bold">
                        Lesson Locked
                    </h4>

                    <p className="text-muted">
                        {message}
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={onBack}
                    >

                        <i className="bi bi-arrow-left me-2"></i>

                        Go Back

                    </button>

                </div>

            </div>

        </div>
    )
}

export default LessonLocked