import React from "react";

function TransactionFilters({
    filters,
    setFilters,
    onApply,
    onClear,
}) {

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    return (
        <div className="transaction-filter-card mb-4">

            <div className="row g-3 align-items-end">

                {/* Search */}

                <div className="col-12 col-lg">

                    <label className="form-label">
                        Search
                    </label>

                    <div className="input-group">

                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Search ID, user, mentor, course..."
                        />

                    </div>

                </div>

                {/* Type */}

                <div className="col-12 col-md-4 col-lg-2">

                    <label className="form-label">
                        Type
                    </label>

                    <select
                        className="form-select"
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                    >
                        <option value="ALL">
                            All Types
                        </option>

                        <option value="COURSE">
                            Course Enrollment
                        </option>
                    </select>

                </div>

                {/* Status */}

                <div className="col-12 col-md-4 col-lg-2">

                    <label className="form-label">
                        Status
                    </label>

                    <select
                        className="form-select"
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                    >
                        <option value="ALL">
                            All Statuses
                        </option>

                        <option value="PAID">
                            Successful
                        </option>

                        <option value="CREATED">
                            Pending
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>

                        <option value="REFUNDED">
                            Refunded
                        </option>
                    </select>

                </div>

                {/* Date */}

                <div className="col-12 col-md-4 col-lg-2">

                    <label className="form-label">
                        Date
                    </label>

                    <select
                        className="form-select"
                        name="date"
                        value={filters.date}
                        onChange={handleChange}
                    >
                        <option value="all">
                            All Time
                        </option>

                        <option value="today">
                            Today
                        </option>

                        <option value="week">
                            This Week
                        </option>

                        <option value="month">
                            This Month
                        </option>
                    </select>

                </div>

                {/* Buttons */}

                <div className="col-12 col-lg-auto">

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onApply}
                        >
                            <i className="bi bi-funnel me-1"></i>
                            Apply
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onClear}
                        >
                            Clear
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default TransactionFilters;