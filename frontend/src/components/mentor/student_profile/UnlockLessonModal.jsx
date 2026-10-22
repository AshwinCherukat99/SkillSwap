function UnlockLessonModal({
    lesson,
    student,
    course,
    busy,
    onCancel,
    onConfirm
}){
    if (!lesson) return null
    return (
        <div
      className="unlock-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !busy
        ) {
          onCancel();
        }
      }}
    >
      <div
        className="unlock-modal card border-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
      >
        <div className="card-body p-4 p-md-5">
          <div className="d-flex gap-3 mb-4">
            <div className="unlock-icon">↗</div>

            <div className="flex-grow-1">
              <h2
                id="unlock-title"
                className="h5 fw-bold"
              >
                Authorize lesson unlock
              </h2>

              <p className="text-secondary mb-0">
                Grant access to this lesson for this student.
              </p>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={busy}
              aria-label="Close"
            />
          </div>

          <div className="unlock-detail-box mb-3">
            <div className="small text-secondary">
              Target lesson
            </div>

            <strong>
              L{lesson.order}: {lesson.title}
            </strong>

            <hr />

            <div className="d-flex justify-content-between gap-3 mb-2">
              <span>Student</span>

              <strong className="text-end">
                {student.full_name || student.username}
                {" "}
                (@{student.username})
              </strong>
            </div>

            <div className="d-flex justify-content-between gap-3">
              <span>Course</span>
              <strong className="text-end">
                {course.title}
              </strong>
            </div>

            {lesson.moduleTitle && (
              <div className="d-flex justify-content-between gap-3 mt-2">
                <span>Module</span>
                <strong className="text-end">
                  {lesson.moduleTitle}
                </strong>
              </div>
            )}
          </div>

          <div className="alert alert-info small">
            This unlock affects this enrollment only, not other students.
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light"
              onClick={onCancel}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
              disabled={busy}
            >
              {busy ? "Unlocking..." : "Confirm unlock"}
            </button>
          </div>
        </div>
      </div>
    </div>
    )
}

export default UnlockLessonModal