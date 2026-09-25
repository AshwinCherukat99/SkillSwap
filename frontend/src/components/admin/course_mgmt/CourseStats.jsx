import React from "react";

const CourseStats=({stats})=>{
    const cards=[
        {
            title:'Total Courses',
            value:stats.total_courses||0,
            icon:'bi-book',
            className:'text-primary'
        },
        {
            title:'Pending Review',
            value:stats.pending||0,
            icon:'bi-clock-history',
            className:'text-warning'
        },
        {
            title:'Published',
            value:stats.published||0,
            icon:'bi-check-circle',
            className:'text-success'
        },
        {
            title:'Drafts',
            value:stats.drafts||0,
            icon:'bi-file-earmark',
            className:'text-secondary'
        },
        {
            title:'Rejected',
            value:stats.archived||0,
            icon:'bi-x-circle',
            className:'text-danger'
        },
    ]
    return (
        <div className="row g-3 mb-4">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="col-12 col-sm-6 col-xl"
                >

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted small mb-1">
                                        {card.title}
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {card.value}
                                    </h3>

                                </div>

                                <div
                                    className={`course-stat-icon ${card.className}`}
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

export default CourseStats