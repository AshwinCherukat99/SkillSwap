import React from "react";

const VerificationFilters=({
    search,
    setSearch,
    documentStatus,
    setDocumentStatus,
    sort,
    setSort,
    onReset
})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-3">

                <div className="row g-3 align-items-center">

                    {/* Search */}

                    <div className="col-12 col-lg-5">

                        <div className="input-group">

                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search"></i>
                            </span>

                            <input
                                type="text"
                                className="form-control bg-light border-start-0"
                                placeholder="Search by mentor name, username, email or ID..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="btn btn-light border"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            )}

                        </div>

                    </div>


                    {/* Document status */}

                    <div className="col-12 col-md-6 col-lg-3">

                        <select
                            className="form-select"
                            value={documentStatus}
                            onChange={(e) =>
                                setDocumentStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="all">
                                Doc Status: All Documents
                            </option>

                            <option value="all-submitted">
                                All Submitted
                            </option>

                            <option value="pending-review">
                                Pending Primary Screen
                            </option>

                            <option value="partially-verified">
                                Partially Verified
                            </option>

                            <option value="deficient">
                                Deficient / Resubmit
                            </option>

                        </select>

                    </div>


                    {/* Sort */}

                    <div className="col-12 col-md-6 col-lg-3">

                        <select
                            className="form-select"
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                        >

                            <option value="newest">
                                Sort: Newest Submission
                            </option>

                            <option value="oldest">
                                Sort: Oldest Pending
                            </option>

                            <option value="priority">
                                Sort: Expedited Priority
                            </option>

                            <option value="name-asc">
                                Sort: Name (A to Z)
                            </option>

                            <option value="name-desc">
                                Sort: Name (Z to A)
                            </option>

                        </select>

                    </div>


                    {/* Reset */}

                    <div className="col-12 col-lg-1">

                        <button
                            type="button"
                            className="btn btn-light border w-100"
                            onClick={onReset}
                            title="Reset filters"
                        >
                            <i className="bi bi-arrow-counterclockwise"></i>
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default VerificationFilters