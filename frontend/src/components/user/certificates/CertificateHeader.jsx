import React from 'react'

const CertificateHeader=({
    totalCertificates,
    onVerify
})=>{
    return (
        <section className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-4">

            <div>

                <div className="small text-secondary mb-2">
                    <span className="material-symbols-outlined align-middle me-1">
                        school
                    </span>

                    Learner Portal

                    <span className="mx-2">
                        /
                    </span>

                    <span className="text-dark fw-semibold">
                        Certificates
                    </span>
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap">

                    <h1 className="display-6 fw-bold mb-0">
                        Certificates & Credentials
                    </h1>

                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                        <span className="material-symbols-outlined align-middle me-1">
                            verified
                        </span>

                        Authenticated Ledger
                    </span>

                </div>

                <p className="text-secondary mt-3 mb-0 certificate-description">
                    View, verify, and export your accredited course completion
                    credentials and verified skill credentials on SkillSwap.
                </p>

            </div>

            <div className="d-flex align-items-center gap-3">

                <button
                    className="btn btn-light border shadow-sm"
                    onClick={onVerify}
                >
                    <span className="material-symbols-outlined align-middle me-2">
                        domain_verification
                    </span>

                    Verify Any Credential
                </button>

                <div className="certificate-earned-badge">
                    <span className="material-symbols-outlined align-middle me-1">
                        workspace_premium
                    </span>

                    {totalCertificates} Earned
                </div>

            </div>

        </section>
    )
}

export default CertificateHeader