import React from "react";

import CourseModuleEditor from "./CourseModuleEditor";        

function CourseCurriculumEditor({
    modules,
    onModuleChange,
    onLessonChange,
    onAddModule,
    onAddLesson,
    onRemoveLesson,
    onRemoveModule,
}){
    return (
        <div className="card border-0 shadow-sm edit-course-card mb-4">

            <div className="card-body p-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                    <div>
                        <h5 className="fw-bold mb-1">
                            Course Curriculum
                        </h5>

                        <p className="text-muted small mb-0">
                            Organize your course into modules and lessons.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onAddModule}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Module
                    </button>

                </div>

                {modules.length === 0 ? (
                    <div className="text-center py-5 border rounded-3">

                        <i className="bi bi-journal-plus fs-1 text-muted"></i>

                        <h6 className="fw-semibold mt-3">
                            No modules yet
                        </h6>

                        <p className="text-muted small">
                            Add your first module to build the curriculum.
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onAddModule}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Module
                        </button>

                    </div>
                ) : (
                    modules.map((module, moduleIndex) => (
                        <CourseModuleEditor
                            key={
                                module.id ||
                                `module-${moduleIndex}`
                            }
                            module={module}
                            moduleIndex={moduleIndex}
                            onModuleChange={onModuleChange}
                            onLessonChange={onLessonChange}
                            onAddLesson={onAddLesson}
                            onRemoveLesson={onRemoveLesson}
                            onRemoveModule={onRemoveModule}
                        />
                    ))
                )}

            </div>
        </div>
    )
}

export default CourseCurriculumEditor