function CourseProgressSummary({
    course,
    enrollment,
}){
    const progress=Math.min(
        100,
        Math.max(0,Number(enrollment.progress)||0)
    )
    const metrics=[
        [
            'Enrolled Course',
            course.title,
            course.level||'level not specified'
        ],
        [
            'Modules',
            course.module_count??0,
            'In this course'
        ],
        [
            'Lessons Completed',
            `${course.completed_lessons??0}/${course.total_lessons??0}`,
            'Completed Lessons'
        ]
    ]
    return (
        <section className="row g-3">
      {metrics.map(([label, value, detail]) => (
        <div
          className="col-12 col-md-6 col-xl-3"
          key={label}
        >
          <div className="card border-0 mentor-metric-card h-100">
            <div className="card-body">
              <div className="small text-secondary mb-2">
                {label}
              </div>

              <div className="metric-value text-break">
                {value}
              </div>

              <div className="small text-secondary mt-2">
                {detail}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-12 col-md-6 col-xl-3">
        <div className="card border-0 mentor-metric-card h-100">
          <div className="card-body">
            <div className="small text-secondary mb-2">
              Course progress
            </div>

            <div className="metric-value mb-3">
              {progress}%
            </div>

            <div
              className="progress"
              role="progressbar"
              aria-label="Course progress"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="small text-secondary mt-2">
              Based on completed lessons
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}

export default CourseProgressSummary