import React from "react";

function NotificationStats({stats={}}){
    const cards=[
        {
            title:'Sent Today',
            value:stats.sent_today??0,
            icon:'bi-send',
            className:'notification-stat-primary',
        },
        {
            title:'Scheduled',
            value:stats.scheduled??0,
            icon:'bi-calendar-event',
            className:'notification-stat-warning',
        },
        {
            title:'Push Notifications',
            value:stats.push_notifications??0,
            icon:'bi-phone',
            className:'notification-stat-success',
        },
        {
            title:'Email Campaigns',
            value:stats.email_campaigns??0,
            icon:'bi-envelope',
            className:'notification-stat-purple',
        },
        {
            title:'Announcements',
            value:stats.announcements??0,
            icon:'bi-megaphone',
            className:'notification-stat-danger',
        },
    ]
    return (
        <div className="row g-4">

            {cards.map((card) => (
                <div
                    className="col-12 col-md-6 col-lg"
                    key={card.title}
                >
                    <div className="card notification-stat-card h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                                <div
                                    className={`notification-stat-icon ${card.className}`}
                                >
                                    <i
                                        className={`bi ${card.icon}`}
                                    />
                                </div>

                            </div>

                            <div className="mt-4">

                                <div className="notification-stat-title">
                                    {card.title}
                                </div>

                                <div className="notification-stat-value">
                                    {card.value}
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            ))}

        </div>
    )
}

export default NotificationStats