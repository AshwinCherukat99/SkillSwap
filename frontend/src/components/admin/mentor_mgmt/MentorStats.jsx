import React from "react";

const MentorStats=({stats})=>{
    const cards=[
        {
            title:'Total Mentors',
            value:stats.total,
            icon:'bi-people',
            className:'mentor-stat-primary',
        },
        {
            title:'Active Mentors',
            value:stats.active,
            icon:'bi-person-check',
            className:'mentor-stat-success',
        },
        {
            title:'Pending Verification',
            value:stats.pending_verification,
            icon:'bi-hourglass-split',
            className:'mentor-stat-warning',
        },
        {
            title:'Suspended',
            value:stats.suspended,
            icon:'bi-slash-circle',
            className:'mentor-stat-danger',
        },
        {
            title:'Blocked',
            value:stats.Blocked,
            icon:'bi-person-x',
            className:'mentor-stat-secondary',
        },
    ]    
    return (
        <div className="row g-3">

            {cards.map((card) => (

                <div
                    className="col-6 col-md-4 col-lg"
                    key={card.title}
                >

                    <div
                        className={`mentor-stat-card ${card.className}`}
                    >

                        <div className="mentor-stat-icon">
                            <i
                                className={`bi ${card.icon}`}
                            ></i>
                        </div>

                        <div>
                            <p>
                                {card.title}
                            </p>

                            <h3>
                                {card.value ?? 0}
                            </h3>
                        </div>

                    </div>

                </div>

            ))}

        </div>
    )
}

export default MentorStats