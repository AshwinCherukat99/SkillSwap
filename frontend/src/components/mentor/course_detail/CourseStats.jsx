import React from 'react'

import {IndianRupee,Clock3,BookOpen,Globe2} from 'lucide-react'

const CourseStats=({course})=>{
    const totalLessons=course.modules.reduce(
        (total,module)=>
            total+module.lessons.length,
        0
    )
    return (
        <div className="row g-3 mb-5">

            <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between">

                            <span className="small text-muted">
                                Course Fee
                            </span>

                            <IndianRupee
                                size={20}
                                className="text-primary"
                            />

                        </div>

                        <div className="fs-4 fw-bold mt-2">
                            ₹{course.price}
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between">

                            <span className="small text-muted">
                                Duration
                            </span>

                            <Clock3
                                size={20}
                                className="text-primary"
                            />

                        </div>

                        <div className="fs-4 fw-bold mt-2">
                            {course.estimated_duration} min
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between">

                            <span className="small text-muted">
                                Curriculum
                            </span>

                            <BookOpen
                                size={20}
                                className="text-primary"
                            />

                        </div>

                        <div className="fs-4 fw-bold mt-2">
                            {course.modules.length}
                        </div>

                        <div className="small text-muted">
                            Modules • {totalLessons} Lessons
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between">

                            <span className="small text-muted">
                                Status
                            </span>

                            <Globe2
                                size={20}
                                className="text-primary"
                            />

                        </div>

                        <div className="fs-4 fw-bold mt-2">
                            {course.status}
                        </div>

                        <div className="small text-muted">
                            {course.is_active
                                ? "Active course"
                                : "Inactive course"}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CourseStats