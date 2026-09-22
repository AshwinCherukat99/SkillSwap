import React from 'react'
import CourseCard from './CourseCard'

const CourseGrid=({courses,loading,searchTerm})=>{
    if (loading){
        return (
            <div className="row g-4">

                {[1, 2, 3, 4].map((item) => (
                    <div
                        className="col-12 col-md-6"
                        key={item}
                    >
                        <div className="course-loading-card">
                            <div className="placeholder-glow">

                                <div className="placeholder course-loading-image" />

                                <div className="p-4">
                                    <div className="placeholder col-4 mb-3" />
                                    <div className="placeholder col-9 mb-3" />
                                    <div className="placeholder col-6" />
                                </div>

                            </div>
                        </div>
                    </div>
                ))}

            </div>
        )
    }
    if (courses.length===0){
        return (
            <div className="course-empty-state">
                <span className="material-symbols-outlined">
                    search_off
                </span>

                <h5>No courses found</h5>

                <p>
                    {searchTerm
                        ? "Try a different search term."
                        : "You haven't created any courses yet."}
                </p>
            </div>
        )
    }
    return (
        <div className="row g-4">

            {courses.map((course) => (
                <div
                    className="col-12 col-md-6"
                    key={course.id}
                >
                    <CourseCard
                        course={course}
                    />
                </div>
            ))}

        </div>
    )
}

export default CourseGrid