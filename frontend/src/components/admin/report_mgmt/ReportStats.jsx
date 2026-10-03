import React from "react";

function ReportStats({stats}){
    const cards=[
        {
            title:'Total Reports',
            value:stats.total_reports,
            icon:'bi-flag',
            className:'text-primary'
        },
        {
            title:'Reported Users',
            value:stats.reported_users,
            icon:'bi-person-x',
            className:'text-danger'
        },
        {
            title:'Reported Mentors',
            value:stats.reported_mentors,
            icon:'bi-mortarboard',
            className:'text-success'
        },
        {
            title:'Flagged Messages',
            value:stats.flagged_messages,
            icon:'bi-chat-left-text',
            className:'text-primary'
        },
        {
            title:'Fraud Alerts',
            value:stats.fraud_alerts,
            icon:'bi-shield-exclamation',
            className:'text-danger'
        },
        {
            title:'Active Bans',
            value:stats.active_bans,
            icon:'bi-slash-circle',
            className:'text-dark'
        },
    ]
    return (
        <div className="row g-4">

            {cards.map((card) => (

                <div
                    className="col-md-6 col-xl-4"
                    key={card.title}
                >

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <div className="text-uppercase small text-muted fw-semibold">
                                        {card.title}
                                    </div>

                                    <h3 className="fw-bold mt-2 mb-0">
                                        {card.value ?? 0}
                                    </h3>

                                </div>

                                <div
                                    className={`report-stat-icon ${card.className}`}
                                >
                                    <i
                                        className={`bi ${card.icon}`}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    )
}

export default ReportStats