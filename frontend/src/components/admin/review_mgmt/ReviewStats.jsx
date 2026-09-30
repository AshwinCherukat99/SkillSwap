import React from "react";

const ReviewStats=({stats})=>{
    const cards=[
        {
            title:'Total Reviews',
            value:stats.total_reviews,
            icon:'bi-chat-square-text',
        },
        {
            title:'Visible reviews',
            value:stats.visible_reviews,
            icon:'bi-eye',
        },
        {
            title:'Visible reviews',
            value:stats.visible_reviews,
            icon:'bi-eye',
        },
        {
            title:'Hidden reviews',
            value:stats.hidden_reviews,
            icon:'bi-eye-slash',
        },
        {
            title:'Reported reviews',
            value:stats.reported_reviews,
            icon:'bi-flag',
        },
    ]
    return (
        <div className="row g-3 mb-4">

            {cards.map((card) => (
                <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={card.title}
                >
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <div className="small text-secondary mb-1">
                                        {card.title}
                                    </div>

                                    <h3 className="fw-bold mb-0">
                                        {card.value}
                                    </h3>
                                </div>

                                <div className="text-primary fs-3">
                                    <i
                                        className={`bi ${card.icon}`}
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

export default ReviewStats