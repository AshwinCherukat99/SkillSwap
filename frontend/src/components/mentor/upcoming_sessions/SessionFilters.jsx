import React from 'react'

const SessionFilters=({
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    sort,
    setSort
})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                <div className="row g-3">

                    {/* SEARCH */}

                    <div className="col-12 col-lg-6">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search student or course..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* DATE */}

                    <div className="col-12 col-sm-6 col-lg-3">

                        <select
                            className="form-select"
                            value={dateFilter}
                            onChange={(e) =>
                                setDateFilter(e.target.value)
                            }
                        >

                            <option value="ALL">
                                All Upcoming Dates
                            </option>

                            <option value="THIS_MONTH">
                                This Month
                            </option>

                            <option value="THIS_WEEK">
                                This Week
                            </option>

                        </select>

                    </div>


                    {/* SORT */}

                    <div className="col-12 col-sm-6 col-lg-3">

                        <select
                            className="form-select"
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                        >

                            <option value="EARLIEST">
                                Sort: Earliest First
                            </option>

                            <option value="LATEST">
                                Sort: Latest First
                            </option>

                            <option value="TOPIC">
                                Sort: By Course
                            </option>

                        </select>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SessionFilters