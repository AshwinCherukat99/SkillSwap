import React from "react";

function NotificationQuickActions({
    onGlobal,onSchedule,onPush,onEmail,onAnnouncement
}){
    const actions=[
        {
            title:'Global Notification',
            icon:'bi-globe2',
            onClick:onGlobal,
        },
        {
            title:'Schedule Send',
            icon:'bi-clock',
            onClick:onSchedule,
        },
        {
            title:'Push Notification',
            icon:'bi-phone',
            onClick:onPush,
        },
        {
            title:'Email Campaign',
            icon:'bi-envelope',
            onClick:onEmail,
        },
        {
            title:'New Announcement',
            icon:'bi-megaphone',
            onClick:onAnnouncement,
        },
    ]
    return (
        <section className="notification-section">

            <div className="notification-section-heading">
                <h3>Quick Actions</h3>
            </div>

            <div className="row g-3">

                {actions.map((action) => (
                    <div
                        className="col-12 col-sm-6 col-lg"
                        key={action.title}
                    >

                        <button
                            type="button"
                            className="notification-quick-action w-100"
                            onClick={action.onClick}
                        >

                            <div className="notification-action-icon">
                                <i
                                    className={`bi ${action.icon}`}
                                />
                            </div>

                            <span>
                                {action.title}
                            </span>

                        </button>

                    </div>
                ))}

            </div>

        </section>
    )
}

export default NotificationQuickActions