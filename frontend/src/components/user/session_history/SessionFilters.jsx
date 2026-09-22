import React from 'react'

import {Search} from 'lucide-react'

const SessionFilters=({search,setSearch,statusFilter,setStatusFilter})=>{
    return (
        <div className="session-filters mb-5">

            {/* Search */}

            <div className="session-search">

                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search sessions, mentors, or skills..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

            </div>


            {/* Filters */}

            <div className="session-filter-group">

                <button
                    className={
                        statusFilter === 'ALL'
                            ? 'session-filter active'
                            : 'session-filter'
                    }
                    onClick={() =>
                        setStatusFilter('ALL')
                    }
                >
                    All Sessions
                </button>


                <button
                    className={
                        statusFilter === 'COMPLETED'
                            ? 'session-filter active'
                            : 'session-filter'
                    }
                    onClick={() =>
                        setStatusFilter(
                            'COMPLETED'
                        )
                    }
                >
                    Completed
                </button>


                <button
                    className={
                        statusFilter === 'CANCELLED'
                            ? 'session-filter active'
                            : 'session-filter'
                    }
                    onClick={() =>
                        setStatusFilter(
                            'CANCELLED'
                        )
                    }
                >
                    Cancelled
                </button>


                <button
                    className={
                        statusFilter === 'EXPIRED'
                            ? 'session-filter active'
                            : 'session-filter'
                    }
                    onClick={() =>
                        setStatusFilter(
                            'EXPIRED'
                        )
                    }
                >
                    Missed
                </button>


                <button
                    className={
                        statusFilter === 'REJECTED'
                            ? 'session-filter active'
                            : 'session-filter'
                    }
                    onClick={() =>
                        setStatusFilter(
                            'REJECTED'
                        )
                    }
                >
                    Rejected
                </button>

            </div>

        </div>
    )
}

export default SessionFilters