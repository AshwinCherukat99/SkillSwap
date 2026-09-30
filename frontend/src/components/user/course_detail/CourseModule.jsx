import {useNavigate} from 'react-router-dom'

function CourseModule({
    module,
    moduleNumber,
    isEnrolled,
    expanded,
    onToggle,
    isPreview,
    courseId
}){
    const navigate=useNavigate()
    const lessons=module.lessons||[]
    const visibleLessons=lessons
    const formatDuration = (minutes) => {
        if (!minutes) return "";

        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return mins
            ? `${hours}h ${mins}m`
            : `${hours}h`;
    };
    const handleLessonClick=(lesson)=>{
        navigate(
            `/courses/${courseId}/lessons/${lesson.id}`
        )
    }
    return (
        <div className="course-module border rounded-3 overflow-hidden">

            {/* Module Header */}
            <button
                type="button"
                className="course-module-header w-100 border-0 bg-white text-start p-3 p-md-4"
                onClick={onToggle}
            >

                <div className="d-flex align-items-center gap-3">

                    <div className="course-module-number">
                        {String(moduleNumber).padStart(2, "0")}
                    </div>

                    <div className="flex-grow-1 min-w-0">

                        <div className="d-flex flex-wrap align-items-center gap-2">

                            <h6 className="fw-bold mb-0">
                                {module.title}
                            </h6>

                            {!isEnrolled &&
                                moduleNumber === 1 && (
                                    <span className="badge bg-success-subtle text-success">
                                        Preview
                                    </span>
                                )}

                        </div>

                        <div className="small text-muted mt-1">

                            {lessons.length}{" "}
                            {lessons.length === 1
                                ? "Lesson"
                                : "Lessons"}

                            {module.description && (
                                <>
                                    {" • "}
                                    {module.description}
                                </>
                            )}

                        </div>

                    </div>

                    <i
                        className={`bi ${
                            expanded
                                ? "bi-chevron-up"
                                : "bi-chevron-down"
                        } text-muted`}
                    ></i>

                </div>

            </button>

            {/* Lessons */}
            {expanded && (
                <div className="p-3 border-top bg-light-subtle">

                    {visibleLessons.length === 0 ? (
                        <div className="text-center py-4">

                            <i className="bi bi-lock fs-4 text-muted"></i>

                            <p className="small text-muted mb-0 mt-2">
                                Enroll to access lessons in this module.
                            </p>

                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">

                            {visibleLessons.map(
                                (lesson, index) => {
                                    const isLessonPreview=!isEnrolled&&isPreview&&index===0
                                    const isLessonUnlocked=isEnrolled||isLessonPreview
                                    return(<button
                                        key={lesson.id}
                                        type="button"
                                        className={`course-lesson-button ${
                                            isLessonUnlocked
                                                ? "lesson-available"
                                                : "lesson-locked"
                                        }`}
                                        disabled={!isLessonUnlocked}
                                        onClick={() => {
                                            if (isLessonUnlocked) {
                                                handleLessonClick(
                                                    lesson
                                                )
                                            }
                                        }}
                                    >

                                        <div className="d-flex align-items-center gap-3">

                                            <div className="course-lesson-icon">

                                                {isLessonUnlocked ? (
                                                    <i className="bi bi-play-circle"></i>
                                                ) : (
                                                    <i className="bi bi-lock"></i>
                                                )}

                                            </div>

                                            <div className="flex-grow-1">

                                                <div className="small fw-semibold text-dark">

                                                    {lesson.order ||
                                                        index + 1}
                                                    .{" "}
                                                    {lesson.title}

                                                </div>

                                                <div className="small text-muted mt-1">

                                                    {lesson.lesson_type && (
                                                        <>
                                                            {
                                                                lesson.lesson_type
                                                            }

                                                            {" • "}
                                                        </>
                                                    )}

                                                    {formatDuration(
                                                        lesson.duration
                                                    )}

                                                </div>

                                            </div>

                                            {isLessonPreview ? (
                                                <span className="badge bg-success-subtle text-success">
                                                    Free Preview
                                                </span>
                                            ) : isEnrolled?(

                                                    <span className="small text-success">

                                                        <i className="bi bi-unlock-fill"></i>

                                                    </span>

                                                ):
                                            (
                                                <span className="small text-muted">
                                                    <i className="bi bi-lock-fill"></i>
                                                </span>
                                            )}
                                            

                                        </div>

                                    </button>
                                )
}
                            )}

                        </div>
                    )}

                </div>
            )}

        </div>
    )
}

export default CourseModule