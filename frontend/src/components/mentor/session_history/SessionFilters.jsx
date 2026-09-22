import React from "react";

import {
    Search,
    SlidersHorizontal,
    RotateCcw,
} from 'lucide-react'

const SessionFilters=({
    activeTab,
    setActiveTab,
    search,
    setSearch,
    courseFilter,
    setCourseFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    courseOptions,
    counts,
    onClear
})=>{
    const tabs=[
        {
            key:'ALL',
            label:'All',
            counts:counts.all,
        },
        {
            key:'COMPLETED',
            label:'Completed',
            counts:counts.completed,
        },
        {
            key:'CANCELLED',
            label:'Cancelled',
            counts:counts.cancelled,
        },
        {
            key:'EXPIRED',
            label:'Expired',
            counts:counts.expired,
        },
    ]
    return (
        <div className="session-filter-panel mb-4">

            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">

                {/* STATUS TABS */}

                <div className="session-tabs">

                    {tabs.map(tab => (

                        <button
                            key={tab.key}
                            type="button"
                            className={
                                activeTab === tab.key
                                    ? 'session-tab active'
                                    : 'session-tab'
                            }
                            onClick={() =>
                                setActiveTab(tab.key)
                            }
                        >
                            {tab.label}

                            <span className="session-tab-count">
                                {tab.count}
                            </span>

                        </button>

                    ))}

                </div>


                {/* SEARCH */}

                <div className="session-search">

                    <Search
                        size={19}
                        className="session-search-icon"
                    />

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by student, course, session ID..."
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </div>


            <div className="d-flex flex-wrap align-items-center gap-2 mt-3">

                {/* DATE */}

                <select
                    className="form-select session-filter-select"
                    value={dateFilter}
                    onChange={e =>
                        setDateFilter(e.target.value)
                    }
                >
                    <option value="THIS_MONTH">
                        Date Range: This Month
                    </option>

                    <option value="TODAY">
                        Today
                    </option>

                    <option value="THIS_WEEK">
                        This Week
                    </option>

                    <option value="LAST_MONTH">
                        Last Month
                    </option>

                    <option value="ALL">
                        All Time
                    </option>
                </select>


                {/* COURSE */}

                <select
                    className="form-select session-filter-select"
                    value={courseFilter}
                    onChange={e =>
                        setCourseFilter(e.target.value)
                    }
                >

                    <option value="ALL">
                        Course: All Courses
                    </option>

                    {courseOptions.map(course => (
                        <option
                            key={course}
                            value={course}
                        >
                            {course}
                        </option>
                    ))}

                </select>


                {/* STATUS */}

                <select
                    className="form-select session-filter-select"
                    value={statusFilter}
                    onChange={e =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="ALL">
                        Status: All Statuses
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>

                    <option value="EXPIRED">
                        Expired
                    </option>

                </select>


                <button
                    type="button"
                    className="btn btn-link text-decoration-none session-clear-btn"
                    onClick={onClear}
                >
                    <RotateCcw
                        size={15}
                        className="me-1"
                    />

                    Clear Filters
                </button>

            </div>

        </div>
    )
}

export default SessionFilters