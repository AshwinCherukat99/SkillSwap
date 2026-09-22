import React from 'react'

function CertificateEmptyState(){
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">

                <div className="mb-3">
                    <i
                        className="bi bi-award text-muted"
                        style={{ fontSize: "3rem" }}
                    ></i>
                </div>

                <h5 className="fw-semibold">
                    No certificates found
                </h5>

                <p className="text-muted mb-0">
                    You don't have any certificates matching your current
                    filters.
                </p>

            </div>
        </div>
    )
}

export default CertificateEmptyState