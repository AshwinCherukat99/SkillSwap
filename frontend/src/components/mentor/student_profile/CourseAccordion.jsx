import { use, useState } from "react";

import ModuleAccordion from "./ModuleAccordion";

function CourseAccordion({
    course,
    modules,
    onUnlock
}){
    const [open,setOpen]=useState(true)
    const lessons=modules.flatMap(
        (module)=>module.lessons||[]
    )
    const completed=lessons.filter(
        (lesson)=>lesson.is_completed
    ).length
    const unlocked=lessons.filter(
        (lesson)=>lesson.is_unlocked
    ).length
    return (
        <div className="card border-0 mentor-profile-card overflow-hidden">
      <button
        type="button"
        className="course-accordion-header text-start"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <span className="badge text-bg-primary mb-2">
              {course.level || "Course"}
            </span>

            <h3 className="h5 fw-bold mb-1">
              {course.title}
            </h3>

            <p className="text-secondary mb-0">
              {course.description ||
                "No course description provided."}
            </p>
          </div>

          <div className="course-summary-stats">
            <strong>
              {completed}/{lessons.length} completed
            </strong>

            <span>{unlocked} unlocked</span>

            <span className="text-primary fw-semibold">
              {open ? "Hide modules −" : "View modules +"}
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="p-3 p-lg-4">
          <div className="d-flex flex-wrap gap-3 small text-secondary mb-3">
            <span>🟢 Completed</span>
            <span>🟣 Unlocked</span>
            <span>🔒 Locked</span>
          </div>

          {modules.length > 0 ? (
            modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                module={module}
                onUnlock={(lesson) =>
                  onUnlock({
                    ...lesson,
                    moduleTitle: module.title,
                  })
                }
              />
            ))
          ) : (
            <div className="alert alert-light border">
              No modules have been added to this course yet.
            </div>
          )}

          <div className="small text-secondary mt-3">
            Unlocks apply only to this student's enrollment.
          </div>
        </div>
      )}
    </div>
    )
}

export default CourseAccordion