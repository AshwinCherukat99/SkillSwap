import React from 'react'

const CertificateStats=({certificates})=>{
    const totalCertificates=certificates.length
    const averageScore=totalCertificates>0?
    (certificates.reduce((sum,cert)=>sum+Number(cert.score||0),0)/totalCertificates).toFixed(1):0
    const latestCertificate=certificates.length>0?certificates[0]:null
    return (
        <div className="row g-4 mb-4">

            {/* Credentials */}
            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card certificate-stat-card h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between mb-4">

                            <span className="stat-label">
                                Credentials Earned
                            </span>

                            <span className="stat-icon primary">
                                <span className="material-symbols-outlined">
                                    verified_user
                                </span>
                            </span>

                        </div>

                        <h2 className="fw-bold mb-1">
                            {totalCertificates}
                        </h2>

                        <span className="text-success small fw-semibold">
                            100% Verified
                        </span>

                        <p className="text-secondary small mt-2 mb-0">
                            Verified course credentials
                        </p>

                    </div>

                </div>

            </div>


            {/* Courses Completed */}
            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card certificate-stat-card h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between mb-4">

                            <span className="stat-label">
                                Courses Completed
                            </span>

                            <span className="stat-icon success">
                                <span className="material-symbols-outlined">
                                    task_alt
                                </span>
                            </span>

                        </div>

                        <h2 className="fw-bold mb-1">
                            {totalCertificates}
                        </h2>

                        <p className="text-secondary small mb-0">
                            Courses with certificates
                        </p>

                    </div>

                </div>

            </div>


            {/* Average Assessment */}
            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card certificate-stat-card h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between mb-4">

                            <span className="stat-label">
                                Average Assessment
                            </span>

                            <span className="stat-icon purple">
                                <span className="material-symbols-outlined">
                                    analytics
                                </span>
                            </span>

                        </div>

                        <h2 className="fw-bold mb-1">
                            {averageScore}%
                        </h2>

                        <p className="text-secondary small mb-0">
                            Average score across certificates
                        </p>

                    </div>

                </div>

            </div>


            {/* Latest Achievement */}
            <div className="col-12 col-sm-6 col-xl-3">

                <div className="card certificate-stat-card h-100">

                    <div className="card-body">

                        <div className="d-flex justify-content-between mb-4">

                            <span className="stat-label">
                                Latest Achievement
                            </span>

                            <span className="stat-icon">
                                <span className="material-symbols-outlined">
                                    schedule
                                </span>
                            </span>

                        </div>

                        {latestCertificate ? (

                            <>
                                <small className="text-primary fw-semibold">
                                    {new Date(
                                        latestCertificate.issued_at
                                    ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </small>

                                <p className="fw-semibold text-truncate mt-1 mb-0">
                                    {latestCertificate.course_title}
                                </p>
                            </>

                        ) : (

                            <p className="text-secondary mb-0">
                                No certificates yet
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default CertificateStats
