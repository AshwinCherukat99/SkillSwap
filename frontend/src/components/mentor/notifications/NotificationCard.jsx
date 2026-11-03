import { getNotificationCategory } from "./NotificationFilters";

const notificationStyles={
    NEW_MESSAGE: {
        icon: "chat",
        color: "primary"
    },
    SESSION_CANCELLED: {
        icon: "event_busy",
        color: "secondary"
    },
    SESSION_REMINDER: {
        icon: "schedule",
        color: "primary"
    },
    SESSION_COMPLETED: {
        icon: "verified",
        color: "success"
    },
    REVIEW_RECEIVED: {
        icon: "star",
        color: "warning"
    },
    RATING: {
        icon: "star",
        color: "warning"
    },
    PAYMENT_SUCCESS: {
        icon: "account_balance_wallet",
        color: "success"
    },
    PAYMENT_FAILED: {
        icon: "payments",
        color: "danger"
    },
    PAYMENT_PENDING: {
        icon: "payments",
        color: "warning"
    },
    WELCOME: {
        icon: "waving_hand",
        color: "primary"
    }
}

function formatDate(date){
    const value=new Date(date)
    const now=new Date()
    const seconds=Math.floor((now-value)/1000)
    if (seconds<60){
        return 'just now'
    }
    if (seconds<3600){
        return `${Math.floor(seconds/60)} minutes ago`
    }
    if (seconds<86400){
        return `${Math.floor(seconds/3600)} hours ago`
    }
    if (seconds<172800) return "Yesterday"
    return value.toLocaleDateString(undefined,{
        day:"numeric",
        month:"short",
        year:"numeric"
    })
}

function NotificationCard({
    notification,
    onClick,
    busy
}){
    const style=notificationStyles[
        notification.notification_type
    ]||{
        icon:"notifications",
        color:"secondary"
    }
    const categeory=getNotificationCategory(
        notification.notification_type
    )
    return (
        <article
            className={`notification-card ${
                notification.is_read ? "read" : "unread"
            }`}
            onClick={() => !busy && onClick(notification.id)}
            role="button"
            tabIndex={0}
            aria-label={`${notification.title}, ${
                notification.is_read ? "read" : "unread"
            }`}
            onKeyDown={(event) => {
                if (
                    (event.key === "Enter" || event.key === " ") &&
                    !busy
                ) {
                    event.preventDefault();
                    onClick(notification.id);
                }
            }}
        >
            <div className="notification-icon-wrapper">
                <span
                    className={`material-symbols-outlined notification-icon text-${style.color}`}
                >
                    {style.icon}
                </span>
            </div>

            <div className="notification-content">
                <div className="notification-title-row">
                    <h6 className="notification-title">
                        {notification.title}
                    </h6>

                    <span className={`notification-category ${style.color}`}>
                        {category}
                    </span>
                </div>

                <p className="notification-message">
                    {notification.message}
                </p>

                <div className="notification-meta">
                    <span className="material-symbols-outlined">
                        schedule
                    </span>

                    <span>
                        {formatDate(notification.created_at)}
                    </span>
                </div>
            </div>

            {!notification.is_read && (
                <span className="notification-unread-dot" />
            )}
        </article>
    )
}

export default NotificationCard