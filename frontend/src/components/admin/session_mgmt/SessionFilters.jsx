import React from "react";

const SessionFilters=({
    search,
    setSearch,
    status,
    setStatus,
    sessionType,
    setSessionType,
})=>{
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-3">

                <div className="row g-3 align-items-center">

                    {/* Search */}

                    <div className="col-12 col-lg">

                        <div className="input-group">

                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by mentor, learner or ID..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    {/* Status */}

                    <div className="col-12 col-md-4 col-lg-2">

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="">
                                Status: All
                            </option>

                            <option value="SCHEDULED">
                                Scheduled
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                            <option value="EXPIRED">
                                Expired
                            </option>

                        </select>

                    </div>

                    {/* Type */}

                    <div className="col-12 col-md-4 col-lg-2">

                        <select
                            className="form-select"
                            value={sessionType}
                            onChange={(e) =>
                                setSessionType(e.target.value)
                            }
                        >

                            <option value="ALL">
                                Type: All
                            </option>

                            <option value="SKILL_EXCHANGE">
                                Skill Exchange
                            </option>

                            <option value="COURSE">
                                Course
                            </option>

                        </select>

                    </div>

                    <div className="col-12 col-md-4 col-lg-auto">

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setSessionType("ALL");
                            }}
                        >
                            <i className="bi bi-arrow-counterclockwise me-2"></i>
                            Reset
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SessionFilters