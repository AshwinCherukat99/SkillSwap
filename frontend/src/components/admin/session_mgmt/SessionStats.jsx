import React from "react";

const StatCard=({
    title,
    value,
    subtitle,
    icon,
    iconClass
})=>{
    return (
        <div className="col-12 col-sm-6 col-xl-3">

            <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-start">

                        <div>

                            <div className="text-muted small fw-semibold mb-1">
                                {title}
                            </div>

                            <div className="fs-2 fw-bold">
                                {value}
                            </div>

                            {subtitle && (
                                <div className="small text-muted mt-2">
                                    {subtitle}
                                </div>
                            )}

                        </div>

                        <div
                            className={`rounded-3 p-3 ${iconClass}`}
                        >
                            <i className={`bi ${icon}`}></i>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}
const SessionStats=({stats})=>{
    return (
        <div className="row g-4 mb-4">

            <StatCard
                title="Total Sessions"
                value={stats.total_sessions}
                subtitle="All recorded sessions"
                icon="bi-calendar-event"
                iconClass="bg-primary-subtle text-primary"
            />

            <StatCard
                title="Upcoming"
                value={stats.upcoming}
                subtitle="Scheduled sessions"
                icon="bi-calendar-check"
                iconClass="bg-warning-subtle text-warning"
            />

            <StatCard
                title="Ongoing"
                value={stats.ongoing}
                subtitle="Currently active"
                icon="bi-broadcast"
                iconClass="bg-info-subtle text-info"
            />

            <StatCard
                title="Completed"
                value={stats.completed}
                subtitle="Successfully completed"
                icon="bi-check-circle"
                iconClass="bg-success-subtle text-success"
            />

            <StatCard
                title="Cancelled"
                value={stats.cancelled}
                subtitle="Cancelled sessions"
                icon="bi-x-circle"
                iconClass="bg-danger-subtle text-danger"
            />

            <StatCard
                title="Rejected"
                value={stats.rejected}
                subtitle="Rejected requests"
                icon="bi-slash-circle"
                iconClass="bg-secondary-subtle text-secondary"
            />

            <StatCard
                title="Expired"
                value={stats.expired}
                subtitle="Expired sessions"
                icon="bi-clock-history"
                iconClass="bg-dark-subtle text-dark"
            />

            <StatCard
                title="Avg Duration"
                value={`${stats.average_duration} Min`}
                subtitle="Average session length"
                icon="bi-hourglass-split"
                iconClass="bg-light text-dark"
            />

        </div>
    )
}

export default SessionStats