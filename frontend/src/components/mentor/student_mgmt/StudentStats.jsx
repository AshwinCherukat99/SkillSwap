import React from 'react'

const StudentStats=({stats})=>{
    const statCards=[
        {
            label: "Total Students",
            value: stats.total_students ?? "--",
            icon: "bi-people",
        },
        {
            label: "Active Now",
            value: stats.active_now ?? "--",
            icon: "bi-person-check",
        },
        {
            label: "Sessions (Wk)",
            value: stats.sessions_this_week ?? "--",
            icon: "bi-camera-video",
        },
        {
            label: "Completed",
            value: stats.completed ?? "--",
            icon: "bi-check-circle",
        },
        {
            label: "Avg Rating",
            value: stats.average_rating ?? "--",
            icon: "bi-star",
        },
        {
            label: "Success Rate",
            value: stats.success_rate
                ? `${stats.success_rate}%`
                : "--",
            icon: "bi-graph-up",
        },
    ]
    return (
        <div className="row g-3 mb-4">

            {statCards.map((stat) => (
                <div
                    className="col-6 col-lg-4 col-xl-2"
                    key={stat.label}
                >
                    <div className="mentor-student-stat h-100">

                        <div className="mentor-stat-icon">
                            <i className={`bi ${stat.icon}`}></i>
                        </div>

                        <div className="mentor-stat-value">
                            {stat.value}
                        </div>

                        <div className="mentor-stat-label">
                            {stat.label}
                        </div>

                    </div>
                </div>
            ))}

        </div>
    )
} 

export default StudentStats