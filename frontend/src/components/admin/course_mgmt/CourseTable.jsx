import React from "react";

import CourseRow from "./CourseRow";

const CourseTable=({
    courses,
    onView,
    onApprove,
    onReject,
})=>{
    if (courses.length==0){
        return (
            <div className="text-center py-5">

                <i className="bi bi-book fs-1 text-muted" />

                <h5 className="mt-3">
                    No courses found
                </h5>

                <p className="text-muted mb-0">
                    Try changing your search or filters.
                </p>

            </div>
        )
    }
    return (
        <div className="table-responsive">

            <table className="table align-middle mb-0">

                <thead>

                    <tr>

                        <th>Course</th>
                        <th>Mentor</th>
                        <th>Category</th>
                        <th>Curriculum</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {courses.map((course) => (

                        <CourseRow
                            key={course.id}
                            course={course}
                            onView={onView}
                            onApprove={onApprove}
                            onReject={onReject}
                        />

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default CourseTable