import React from "react";

const UserStats=({stats})=>{
    const cards=[
        {
            title:'Total Users',
            value:stats.total_users,
            icon:'bi-people-fill',
            className:'text-primary',
            bg:'bg-primary-subtle',
        },
        {
            title:'Active Users',
            value:stats.active_users,
            icon:'bi-check-circle-fill',
            className:'text-success',
            bg:'bg-primary-success',
        },
        {
            title:'Blocked Users',
            value:stats.blocked_users,
            icon:'bi-slash-circle-fill',
            className:'text-danger',
            bg:'bg-danger-subtle',
        },
        {
            title:'Suspended Users',
            value:stats.suspended_users,
            icon:'bi-pause-circle-fill',
            className:'text-warning',
            bg:'bg-warning-subtle',
        },
    ]
    return (
        <div className="row g-4 mb-4">

            {cards.map((card) => (

                <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={card.title}
                >

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <div className="text-muted small mb-1">
                                        {card.title}
                                    </div>

                                    <h3 className="fw-bold mb-0">
                                        {card.value.toLocaleString()}
                                    </h3>

                                </div>

                                <div
                                    className={`rounded-3 p-2 ${card.bg}`}
                                >
                                    <i
                                        className={`bi ${card.icon} ${card.className} fs-5`}
                                    ></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    )
}

export default UserStats