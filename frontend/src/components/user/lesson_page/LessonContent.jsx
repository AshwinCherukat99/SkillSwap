import React from "react";

const LessonContent=({lesson})=>{
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body p-4 p-lg-5">

                <div
                    className="lesson-content"
                />
                {lesson.content}
            </div>

        </div>
    )
}

export default LessonContent