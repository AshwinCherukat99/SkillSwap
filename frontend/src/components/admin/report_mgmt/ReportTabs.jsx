import React from "react";

function ReportTabs({
    activeTab,
    setActiveTab
}){
    const tabs=[
        {
            key:'ALL',
            label:'All Categories',
        },
        {
            key:'USERS',
            label:'Reported Users',
        },
        {
            key:'MENTORS',
            label:'Reported Mentors',
        },
        {
            key:'MESSAGES',
            label:'Messages',
        },
        {
            key:'POSTS',
            label:'Posts',
        },
        {
            key:'SESSIONS',
            label:'Sessions',
        },
    ]
    return (
        <ul className="nav nav-pills report-tabs">

            {tabs.map((tab) => (

                <li
                    className="nav-item"
                    key={tab.key}
                >

                    <button
                        className={`nav-link ${
                            activeTab === tab.key
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setActiveTab(tab.key)
                        }
                    >
                        {tab.label}
                    </button>

                </li>

            ))}

        </ul>
    )
}

export default ReportTabs