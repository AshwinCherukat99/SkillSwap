const filters=[
    { label: "All", value: "All" },
    { label: "Unread", value: "Unread" },
    { label: "Messages", value: "Messages" },
    { label: "Sessions", value: "Sessions" },
    { label: "Reviews", value: "Reviews" },
    { label: "Enrollment", value: "Enrollment" },
    { label: "Payout", value: "Payout" },
]

function NotificationFilters({
    activeFilter,
    setActiveFilter,
    notifications
}){
    const getCount=(filter)=>{
        if (filter==='All'){
            return notifications.length
        }
        if (filter==='Unread'){
            return notifications.filter(
                item=>!item.is_read
            ).length
        }
        return notifications.filter(
            item=>getNotificationCategory(item.notification_type)===filter
        ).length
    }
    return (
        <div className="notification-filters">
            {filters.map(filter => {
                const active = activeFilter === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        className={`notification-filter ${
                            active ? "active" : ""
                        }`}
                        onClick={() => setActiveFilter(filter.value)}
                    >
                        {filter.label}

                        <span className="filter-count">
                            {getCount(filter.value)}
                        </span>
                    </button>
                );
            })}
        </div>
    )
}

export function getNotificationCategory(type){
    if (type==='NEW_MESSAGE'){
        return "Messages"
    }
    if ([
        'SESSION_CANCELLED',
        'SESSION_REMINDER',
        'SESSION_COMPLETED'
    ].includes(type)){
        return 'Sessions'
    }
    if ([
        'REVIEW_RECEIVED',
        'RATING'
    ].includes(type)){
        return "Reviews"
    }
    if ([
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'PAYMENT_PENDING'
    ].includes(type)){
        return "Payout"
    }
    return "Other"
}

export default NotificationFilters