import React from 'react'

const VerificationHeader=()=>{
    return (
        <div className="mb-4">

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

                <div className="small text-secondary">
                    <span>
                        Admin Portal
                    </span>

                    <span className="mx-2">
                        /
                    </span>

                    <span className="fw-semibold text-dark">
                        Mentor Verification Queue
                    </span>
                </div>

                <div className="badge bg-light text-secondary border px-3 py-2">

                    <span className="status-dot bg-success me-2"></span>

                    Auto-synced with Mentor Registration API

                </div>

            </div>


            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">

                <div>

                    <h1 className="fw-bold mb-2">
                        Document Verification
                    </h1>

                    <p className="text-secondary mb-0">
                        Review mentor credentials submitted for
                        platform verification and resolve pending
                        authorization requests.
                    </p>

                </div>

                <div className="d-flex gap-2">

                    <button
                        type="button"
                        className="btn btn-light border"
                    >
                        <i className="bi bi-book me-2"></i>
                        Audit Guidelines
                    </button>

                    <button
                        type="button"
                        className="btn btn-light border"
                    >
                        <i className="bi bi-download me-2"></i>
                        Export Queue
                    </button>

                </div>

            </div>

        </div>
    )
}

export default VerificationHeader