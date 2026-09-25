import React from "react";

const CourseToolbar=({
    search,
    setSearch,
    status,
    setStatus,
})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-lg-6">

                        <div className="input-group">

                            <span className="input-group-text bg-white">
                                <i className="bi bi-search" />
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search courses or mentors..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">

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

                            <option value="PENDING_REVIEW">
                                Pending Review
                            </option>

                            <option value="PUBLISHED">
                                Published
                            </option>

                            <option value="DRAFT">
                                Draft
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                            <option value="ARCHIVED">
                                Archived
                            </option>

                        </select>

                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">

                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                            }}
                        >
                            <i className="bi bi-arrow-counterclockwise me-2" />
                            Reset Filters
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CourseToolbar