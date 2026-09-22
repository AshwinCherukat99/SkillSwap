import React from "react";

const VerificationStats=({stats})=>{
    const cards=[
        {
            title:'Pending Verification',
            value:stats.pending,
            suffix:'mentors',
            icon:'bi-hourglass-split',
            iconClass:'text-primary',
        },
        {
            title:'Under Review',
            value:stats.review,
            suffix:'active tasks',
            icon:'bi-search',
            iconClass:'text-primary',
        },
        {
            title:'Verified Mentors',
            value:stats.verified,
            suffix:`${stats.verified_percentage}%`,
            icon:'bi-patch-check',
            iconClass:'text-success',
        },
        {
            title:'Deficient/Rejected',
            value:stats.rejected,
            suffix:`${stats.rejected_percentage}%`,
            icon:'bi-exclamation-triangle',
            iconClass:'text-danger',
        },
    ]
    return (
        <div className="row g-3 mb-4">

            {cards.map((card) => (

                <div
                    className="col-12 col-sm-6 col-lg-3"
                    key={card.title}
                >

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <div className="small text-uppercase text-secondary fw-semibold">
                                        {card.title}
                                    </div>

                                    <div className="d-flex align-items-baseline gap-2 mt-2">

                                        <span className="display-6 fw-bold">
                                            {card.value}
                                        </span>

                                        <span className="small text-secondary">
                                            {card.suffix}
                                        </span>

                                    </div>

                                </div>

                                <div className="verification-stat-icon">
                                    <i
                                        className={`bi ${card.icon} ${card.iconClass}`}
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

export default VerificationStats