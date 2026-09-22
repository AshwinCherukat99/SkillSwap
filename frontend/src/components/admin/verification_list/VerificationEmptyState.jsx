import React from "react";

const VerificationEmptyState=({onReset})=>{
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-5">

                <div className="verification-empty-icon mx-auto mb-3">

                    <i className="bi bi-patch-check"></i>

                </div>

                <h4 className="fw-bold">
                    No mentors found
                </h4>

                <p className="text-secondary mb-4">
                    There are no mentors matching the
                    selected verification filters.
                </p>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onReset}
                >
                    Reset Filters
                </button>

            </div>

        </div>
    )
}

export default VerificationEmptyState