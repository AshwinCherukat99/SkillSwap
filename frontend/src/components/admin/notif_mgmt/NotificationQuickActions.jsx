import React from "react";

function NotificationQuickActions({
    onAction
}){
    const actions=[
        {
            title:'Global Notification',
            icon:'bi-globe2',
            action:'GLOBAL',
        },
        {
            title:'Schedule Send',
            icon:'bi-clock',
            action:'SCHEDULE',
        },
        {
            title:'Push Notification',
            icon:'bi-phone',
            action:'PUSH',
        },
        {
            title:'Email Campaign',
            icon:'bi-envelope',
            action:'EMAIL',
        },
        {
            title:'New Announcement',
            icon:'bi-megaphone',
            action:'ANNOUNCEMENT',
        },
    ]
    return (
        <section className="notification-section">

            <div className="notification-section-heading">
                <h3>Quick Actions</h3>
            </div>

            <div className="row g-3">

                {actions.map((item) => (
                    <div
                        className="col-12 col-sm-6 col-lg"
                        key={item.action}
                    >

                        <button
                            type="button"
                            className="notification-quick-action w-100"
                            onClick={()=>onAction(item.action)}
                        >

                            <div className="notification-action-icon">
                                <i
                                    className={`bi ${item.icon}`}
                                />
                            </div>

                            <span>
                                {item.title}
                            </span>

                        </button>

                    </div>
                ))}

            </div>

        </section>
    )
}

export default NotificationQuickActions