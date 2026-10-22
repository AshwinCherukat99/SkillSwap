function formatDate(value){
    if (!value) return ''
    const date=new Date(value)
    return Number.isNaN(date.getTime())?'':date.toLocaleDateString()
}

function LessonRow({lesson,onUnlock}){
    const completed=Boolean(lesson.is_completed)
    const unlocked=Boolean(lesson.is_unlocked)
    let label='Locked'
    let icon='🔒'
    let statusClass='lesson-locked'
    if (completed){
        label='Completed'
        icon='✓'
        statusClass='lesson-completed'
    }else if (unlocked){
        label='Unlocked'
        icon='↗'
        statusClass='lesson-unlocked'
    }
    const timestamp=completed?lesson.completed_at:lesson.unlocked_at
    return (
        <div className={`lesson-row ${statusClass}`}>
      <div className="d-flex align-items-start gap-3">
        <span className="lesson-status-icon" aria-hidden="true">
          {icon}
        </span>

        <div>
          <div className="fw-semibold text-break">
            L{lesson.order}: {lesson.title}
          </div>

          <div className="small text-secondary">
            {completed
              ? `Completed${
                  formatDate(timestamp)
                    ? ` · ${formatDate(timestamp)}`
                    : ""
                }`
              : unlocked
                ? `Unlocked by mentor${
                    formatDate(timestamp)
                      ? ` · ${formatDate(timestamp)}`
                      : ""
                  }`
                : "Locked · Awaiting mentor authorization"}
          </div>
        </div>
      </div>

      <div className="lesson-actions">
        <span
          className={`badge ${
            completed
              ? "text-bg-success"
              : unlocked
                ? "text-bg-primary"
                : "text-bg-secondary"
          }`}
        >
          {label}
        </span>

        {!unlocked && !completed && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onUnlock(lesson)}
          >
            Unlock lesson
          </button>
        )}
      </div>
    </div>
    )
}

export default LessonRow