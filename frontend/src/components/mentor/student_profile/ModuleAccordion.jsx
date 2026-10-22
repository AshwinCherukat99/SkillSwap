import { useState } from "react";

import LessonRow from "./LessonRow";

function ModuleAccordion({
    module,
    onUnlock
}){
    const [open,setOpen]=useState(true)
    const lessons=module.lessons||[]
    const completed=lessons.filter(
        (lesson)=>lesson.is_completed
    ).length
    return (
        <section className="module-panel mb-3">
      <button
        type="button"
        className="module-header text-start"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <div className="d-flex align-items-center gap-3">
          <span className="module-number">
            {module.order}
          </span>

          <div>
            <h4 className="h6 fw-bold mb-1">
              {module.title}
            </h4>

            <div className="small text-secondary">
              {module.description || "No module description"}
              {" · "}
              {completed} of {lessons.length} lessons completed
            </div>
          </div>
        </div>

        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="lesson-list">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                onUnlock={onUnlock}
              />
            ))
          ) : (
            <p className="text-secondary small p-3">
              No lessons in this module.
            </p>
          )}
        </div>
      )}
    </section>
    )
}

export default ModuleAccordion