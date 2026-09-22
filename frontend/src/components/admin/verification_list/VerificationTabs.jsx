import React from "react";

const VerificationTabs=({activeTab,onTabChange,counts})=>{
    const tabs=[
        {
            key:'all',
            label:'All',
        },
        {
            key:'pending',
            label:'Pending',
        },
        {
            key:'review',
            label:'Review',
        },
        {
            key:'verified',
            label:'Verified',
        },
        {
            key:'rejected',
            label:'Rejected',
        },
    ]
    return (
        <div className="d-flex flex-wrap gap-2">

            {tabs.map((tab) => {

                const active =
                    activeTab === tab.key

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() =>
                            onTabChange(tab.key)
                        }
                        className={
                            `btn btn-sm ${
                                active
                                    ? "btn-primary"
                                    : "btn-light border"
                            }`
                        }
                    >

                        {tab.label}

                        <span
                            className={
                                `badge ms-2 ${
                                    active
                                        ? "bg-light text-primary"
                                        : "bg-secondary-subtle text-secondary"
                                }`
                            }
                        >
                            {counts?.[tab.key] ?? 0}
                        </span>

                    </button>
                )
            })}

        </div>
    )
}

export default VerificationTabs