import React from 'react'

import {ChevronDown,ChevronRight,BookOpen,} from 'lucide-react'

const ModuleCard=({module,moduleIndex,expanded,onToggle})=>{
    return (
        <div className="card border-0 shadow-sm overflow-hidden">

            {/* Module Header */}

            <button
                type="button"
                className="module-header btn w-100 text-start p-4"
                onClick={onToggle}
            >

                <div className="d-flex align-items-center gap-3">

                    <div className="module-number">
                        {String(moduleIndex + 1).padStart(
                            2,
                            "0"
                        )}
                    </div>


                    <div className="flex-grow-1">

                        <div className="d-flex flex-wrap align-items-center gap-2">

                            <h3 className="h6 fw-bold mb-0">
                                {module.title}
                            </h3>

                            <span className="badge bg-light text-dark">
                                {module.lessons.length} Lessons
                            </span>

                        </div>

                        {module.description && (
                            <p className="small text-muted mb-0 mt-1">
                                {module.description}
                            </p>
                        )}

                    </div>


                    {expanded ? (
                        <ChevronDown
                            size={22}
                            className="text-primary"
                        />
                    ) : (
                        <ChevronRight
                            size={22}
                            className="text-muted"
                        />
                    )}

                </div>

            </button>


            {/* Lessons */}

            {expanded && (

                <div className="border-top p-4">

                    {module.lessons.length === 0 ? (

                        <p className="text-muted mb-0">
                            No lessons in this module.
                        </p>

                    ) : (

                        <div className="d-flex flex-column gap-3">

                            {module.lessons.map(
                                (lesson, lessonIndex) => (

                                    <div
                                        key={lesson.id}
                                        className="lesson-card"
                                    >

                                        <div className="d-flex align-items-start gap-3">

                                            <div className="lesson-number">
                                                {String(
                                                    lessonIndex + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>


                                            <div className="flex-grow-1">

                                                <h4 className="h6 fw-semibold mb-2">
                                                    {lesson.title}
                                                </h4>

                                                <div className="lesson-content text-muted">
                                                    {lesson.content}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>
    )
}

export default ModuleCard