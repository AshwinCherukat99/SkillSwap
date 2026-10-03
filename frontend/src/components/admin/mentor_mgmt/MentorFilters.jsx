import React from "react";

const MentorFilters=({
    activeTab,
    setActiveTab,
    search,
    setSearch,
    pendingCount,
})=>{
    const tabs=[
        {
            label:'All Mentors',
            value:'ALL',
        },
        {
            label:'Active',
            value:'ACTIVE',
        },
        {
            label:'Pending',
            value:'PENDING',
        },
        {
            label:'Suspended',
            value:'SUSPENDED',
        },
        {
            label:'Blocked',
            value:'BLOCKED',
        },
    ]
    return (
        <div className="mentor-filters">

            <div className="mentor-tabs">

                {tabs.map((tab) => (

                    <button
                        key={tab.value}
                        type="button"
                        className={
                            activeTab === tab.value
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(tab.value)
                        }
                    >

                        {tab.label}

                        {tab.value === "PENDING" &&
                            pendingCount > 0 && (
                                <span className="pending-count">
                                    {pendingCount}
                                </span>
                            )}

                    </button>

                ))}

            </div>

            <div className="mentor-search">

                <i className="bi bi-search"></i>

                <input
                    type="text"
                    placeholder="Search mentors..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

        </div>
    )
}

export default MentorFilters