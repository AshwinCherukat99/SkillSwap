import React from 'react'
import {BookOpen,Clock3} from 'lucide-react'

const CourseOverview=({course})=>{
    return (
        <section className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="row g-4 align-items-start">

                    {/* Thumbnail */}

                    <div className="col-lg-4">

                        <div className="course-thumbnail-wrapper">

                            {course.thumbnail_url ? (

                                <img
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    className="course-thumbnail"
                                />

                            ) : (

                                <div className="course-thumbnail-placeholder">
                                    <BookOpen size={48} />
                                </div>

                            )}

                        </div>

                    </div>


                    {/* Description */}

                    <div className="col-lg-8">

                        <div className="mb-3">

                            <span className="badge bg-primary-subtle text-primary">
                                {course.category_name}
                            </span>

                        </div>

                        <h2 className="h4 fw-bold mb-3">
                            {course.title}
                        </h2>

                        <p className="text-muted course-description">
                            {course.description}
                        </p>


                        <div className="d-flex flex-wrap gap-3 mt-4">

                            <div className="course-info-pill">

                                <strong>
                                    Level
                                </strong>

                                <span>
                                    {course.level}
                                </span>

                            </div>

                            <div className="course-info-pill">

                                <strong>
                                    Duration
                                </strong>

                                <span>
                                    {course.estimated_duration} minutes
                                </span>

                            </div>

                            <div className="course-info-pill">

                                <strong>
                                    Instructor
                                </strong>

                                <span>
                                    {course.mentor_name}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default CourseOverview