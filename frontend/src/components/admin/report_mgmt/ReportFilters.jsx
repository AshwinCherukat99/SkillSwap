import React from "react";

function ReportFilters({
    search,
    setSearch,
    onSearch,
    reportType,
    setReportType,
    priority,
    setPriority,
    status,
    setStatus
}){
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body p-4">

                <div className="row g-3 align-items-end">

                    <div className="col-lg-4">

                        <label className="form-label small fw-semibold">
                            Search
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <i className="bi bi-search" />
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="User, report ID, or content..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSearch()
                                    }
                                }}
                            />

                        </div>

                    </div>

                    <div className="col-md-4 col-lg-2">

                        <label className="form-label small fw-semibold">
                            Report Type
                        </label>

                        <select
                            className="form-select"
                            value={reportType}
                            onChange={(e) =>
                                setReportType(e.target.value)
                            }
                        >

                            <option value="">
                                All Types
                            </option>

                            <option value="HARASSMENT">
                                Harassment
                            </option>

                            <option value="SPAM">
                                Spam
                            </option>

                            <option value="INAPPROPRIATE_CONTENT">
                                Inappropriate Content
                            </option>

                            <option value="ABUSE">
                                Abuse
                            </option>

                            <option value="FRAUD">
                                Fraud
                            </option>

                            <option value="IMPERSONATION">
                                Impersonation
                            </option>

                        </select>

                    </div>

                    <div className="col-md-4 col-lg-2">

                        <label className="form-label small fw-semibold">
                            Priority
                        </label>

                        <select
                            className="form-select"
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                        >

                            <option value="">
                                Any Priority
                            </option>

                            <option value="CRITICAL">
                                Critical
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="LOW">
                                Low
                            </option>

                        </select>

                    </div>

                    <div className="col-md-4 col-lg-2">

                        <label className="form-label small fw-semibold">
                            Status
                        </label>

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="IN_REVIEW">
                                In Review
                            </option>

                            <option value="RESOLVED">
                                Resolved
                            </option>

                            <option value="DISMISSED">
                                Dismissed
                            </option>

                        </select>

                    </div>

                    <div className="col-lg-2">

                        <button
                            className="btn btn-primary w-100"
                            onClick={onSearch}
                        >
                            <i className="bi bi-search me-2" />
                            Search
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ReportFilters