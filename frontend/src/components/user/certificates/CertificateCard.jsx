import React from 'react'
import {useNavigate} from 'react-router-dom'

function CertificateCard({certificate}){
    const navigate=useNavigate()
    const handleViewCertificate=()=>{
        navigate(`/certificates/${certificate.certificate_id}`)
    }
    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    return (
        <div className="col-12 col-md-6 col-xl-4">
            <div className="card h-100 border-0 shadow-sm certificate-card">

                {/* Certificate Preview */}
                <div className="certificate-preview position-relative">

                    <div className="certificate-preview-content text-center">

                        <div className="mb-2">
                            <i className="bi bi-award fs-1 text-primary"></i>
                        </div>

                        <small className="text-uppercase text-muted fw-semibold">
                            Certificate of Completion
                        </small>

                        <h5 className="fw-bold mt-2 mb-1">
                            {certificate.course_title}
                        </h5>

                        <small className="text-muted">
                            SkillSwap
                        </small>

                    </div>

                    {/* Valid Badge */}
                    {certificate.is_valid && (
                        <span className="badge bg-success position-absolute top-0 end-0 m-3">
                            <i className="bi bi-check-circle me-1"></i>
                            Valid
                        </span>
                    )}

                    {!certificate.is_valid && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-3">
                            Invalid
                        </span>
                    )}
                </div>

                {/* Card Body */}
                <div className="card-body p-4">

                    {/* Course */}
                    <h5 className="fw-semibold mb-2">
                        {certificate.course_title}
                    </h5>

                    {/* Category */}
                    {certificate.course_category && (
                        <span className="badge bg-light text-dark border mb-3">
                            {certificate.course_category}
                        </span>
                    )}

                    {/* Certificate Information */}
                    <div className="certificate-card-info">

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">
                                Certificate No.
                            </span>

                            <span className="small fw-semibold text-end">
                                {certificate.certificate_number}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">
                                Score
                            </span>

                            <span className="small fw-semibold">
                                {certificate.score}%
                            </span>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span className="text-muted small">
                                Issued
                            </span>

                            <span className="small fw-semibold">
                                {formatDate(certificate.issued_at)}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-0 px-4 pb-4">

                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleViewCertificate}
                    >
                        <i className="bi bi-file-earmark-certificate me-2"></i>
                        View Certificate
                    </button>

                </div>

            </div>
        </div>
    )
}

export default CertificateCard