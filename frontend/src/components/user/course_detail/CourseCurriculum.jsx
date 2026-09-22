import {useState} from 'react'
import CourseModule from './CourseModule'

function CourseCurriculum({course,isEnrolled}){
    const [expandedModules,setExpandedModules]=useState([])
    const modules=course.modules||[]
    const toggleModule=(moduleId)=>{
        setExpandedModules((current)=>{
            if (current.includes(moduleId)){
                return current.filter(
                    (id)=>id!==moduleId
                )
            }
            return [...current,moduleId]
        })
    }
    const expandAll=()=>{
        if (expandedModules.length===modules.length){
            setExpandedModules([])
        }else{
            setExpandedModules(
                modules.map((module)=>module.id)
            )
        }
    }
    const visibleModules=isEnrolled?modules:modules.slice(0,1)
    const totalLessons=modules.reduce(
        (total,module)=>total+(module.lessons.length||0),
        0
    )
    return (
        <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 border-bottom pb-3 mb-4">

                    <div>

                        <h2 className="h4 fw-bold mb-1">
                            <span className="course-section-marker"></span>
                            Course Curriculum
                        </h2>

                        <p className="small text-muted mb-0">
                            {modules.length} Modules •{" "}
                            {totalLessons} Lessons
                        </p>

                    </div>

                    {isEnrolled && modules.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={expandAll}
                        >
                            <i
                                className={`bi ${
                                    expandedModules.length ===
                                    modules.length
                                        ? "bi-arrows-collapse"
                                        : "bi-arrows-expand"
                                } me-1`}
                            ></i>

                            {expandedModules.length ===
                            modules.length
                                ? "Collapse All"
                                : "Expand All"}
                        </button>
                    )}

                </div>

                {!isEnrolled && (
                    <div className="alert alert-primary d-flex align-items-start gap-2">

                        <i className="bi bi-info-circle fs-5"></i>

                        <div>
                            <strong>
                                Course preview
                            </strong>

                            <div className="small mt-1">
                                Enroll in this course to unlock
                                the complete curriculum and all
                                lessons.
                            </div>
                        </div>

                    </div>
                )}

                {visibleModules.length === 0 ? (
                    <div className="text-center py-5">

                        <i className="bi bi-journal-text fs-1 text-muted"></i>

                        <p className="text-muted mt-3 mb-0">
                            Course curriculum is not available yet.
                        </p>

                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">

                        {visibleModules.map(
                            (module, index) => (
                                <CourseModule
                                    key={module.id}
                                    module={module}
                                    moduleNumber={index + 1}
                                    isEnrolled={isEnrolled}
                                    expanded={expandedModules.includes(
                                        module.id
                                    )}
                                    onToggle={() =>
                                        toggleModule(
                                            module.id
                                        )
                                    }
                                    isPreview={!isEnrolled && index===0}
                                />
                            )
                        )}

                    </div>
                )}

                {!isEnrolled && modules.length > 1 && (
                    <div className="text-center mt-4 p-4 bg-light rounded-3">

                        <i className="bi bi-lock-fill text-primary fs-4"></i>

                        <h6 className="fw-bold mt-2">
                            More lessons are waiting for you
                        </h6>

                        <p className="small text-muted mb-0">
                            Enroll now to access all{" "}
                            {modules.length} modules.
                        </p>

                    </div>
                )}

            </div>

        </section>
    )
}

export default CourseCurriculum