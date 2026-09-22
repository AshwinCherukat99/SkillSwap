function NotificationFilters({activeFilter,setActiveFilter}){
    const filters=[
        'All',
        'Unread',
        'Messages',
        'Sessions',
        'Reviews',
        'Achievements',
    ] 
    return (
        <div className="notification-filters">

            {filters.map(
                (filter) => (

                    <button
                        key={filter}
                        type="button"
                        className={
                            activeFilter === filter
                                ? "filter-button active"
                                : "filter-button"
                        }
                        onClick={() =>
                            setActiveFilter(
                                filter
                            )
                        }
                    >
                        {filter}
                    </button>

                )
            )}

        </div>
    )
}

export default NotificationFilters