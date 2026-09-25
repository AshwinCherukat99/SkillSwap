import React from "react";

function CourseLessonEditor({
    lesson,
    lessonIndex,
    moduleIndex,
    onChange,
    onRemove,
}){
    return (
        <div className="lesson-editor-card">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div className="d-flex align-items-center gap-2">
                    <div className="lesson-number">
                        {lessonIndex + 1}
                    </div>

                    <span className="fw-semibold">
                        Lesson {lessonIndex + 1}
                    </span>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                        onRemove(moduleIndex, lessonIndex)
                    }
                >
                    <i className="bi bi-trash me-1"></i>
                    Remove
                </button>

            </div>

            <div className="mb-3">

                <label className="form-label small fw-semibold">
                    Lesson Title
                </label>

                <input
                    type="text"
                    className="form-control"
                    value={lesson.title}
                    onChange={(e) =>
                        onChange(
                            moduleIndex,
                            lessonIndex,
                            "title",
                            e.target.value
                        )
                    }
                    placeholder="Enter lesson title"
                />

            </div>

            <div>

                <label className="form-label small fw-semibold">
                    Lesson Content
                </label>

                <textarea
                    className="form-control"
                    rows="6"
                    value={lesson.content}
                    onChange={(e) =>
                        onChange(
                            moduleIndex,
                            lessonIndex,
                            "content",
                            e.target.value
                        )
                    }
                    placeholder="Enter lesson content..."
                />

            </div>

        </div>
    )
}

export default CourseLessonEditor