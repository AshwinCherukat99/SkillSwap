import React from "react";

import CourseLessonEditor from "./CourseLessonEditor";

function CourseModuleEditor({
    module,
    moduleIndex,
    onModuleChange,
    onLessonChange,
    onAddLesson,
    onRemoveLesson,
    onRemoveModule,
}){
    return (
        <div className="course-module-editor mb-4">

            <div className="module-editor-header">

                <div className="d-flex align-items-center gap-3">

                    <div className="module-number">
                        {String(moduleIndex + 1).padStart(2, "0")}
                    </div>

                    <div>
                        <h6 className="fw-bold mb-0">
                            Module {moduleIndex + 1}
                        </h6>

                        <small className="text-muted">
                            {module.lessons.length}{" "}
                            {module.lessons.length === 1
                                ? "Lesson"
                                : "Lessons"}
                        </small>
                    </div>

                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onRemoveModule(moduleIndex)}
                >
                    <i className="bi bi-trash me-1"></i>
                    Remove Module
                </button>

            </div>

            <div className="p-4">

                {/* Module title */}
                <div className="mb-3">

                    <label className="form-label fw-semibold">
                        Module Title
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={module.title}
                        onChange={(e) =>
                            onModuleChange(
                                moduleIndex,
                                "title",
                                e.target.value
                            )
                        }
                        placeholder="Enter module title"
                    />

                </div>

                {/* Module description */}
                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Module Description
                    </label>

                    <textarea
                        className="form-control"
                        rows="3"
                        value={module.description || ""}
                        onChange={(e) =>
                            onModuleChange(
                                moduleIndex,
                                "description",
                                e.target.value
                            )
                        }
                        placeholder="Describe what this module covers..."
                    />

                </div>

                {/* Lessons */}
                <div>

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h6 className="fw-bold mb-0">
                            Lessons
                        </h6>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                                onAddLesson(moduleIndex)
                            }
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            Add Lesson
                        </button>

                    </div>

                    {module.lessons.length === 0 ? (
                        <div className="empty-lessons text-center py-4">
                            <i className="bi bi-journal-text fs-3 text-muted"></i>

                            <p className="text-muted small mb-0 mt-2">
                                No lessons added to this module.
                            </p>
                        </div>
                    ) : (
                        module.lessons.map((lesson, lessonIndex) => (
                            <CourseLessonEditor
                                key={
                                    lesson.id ||
                                    `${moduleIndex}-${lessonIndex}`
                                }
                                lesson={lesson}
                                lessonIndex={lessonIndex}
                                moduleIndex={moduleIndex}
                                onChange={onLessonChange}
                                onRemove={onRemoveLesson}
                            />
                        ))
                    )}

                </div>

            </div>
        </div>
    )
}

export default CourseModuleEditor