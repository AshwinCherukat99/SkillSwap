import React from 'react'

function ProfessionalInformation({formData}){
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div>

                        <div className="d-flex align-items-center gap-2">

                            <span className="material-symbols-outlined text-secondary">
                                workspace_premium
                            </span>

                            <h3 className="h5 mb-0">
                                Professional Information
                            </h3>

                        </div>

                        <p className="text-muted small mt-2 mb-0">
                            Verified professional information authenticated
                            by the SkillSwap verification process.
                        </p>

                    </div>

                    <span className="badge bg-light text-secondary">
                        <span className="material-symbols-outlined align-middle me-1">
                            lock
                        </span>
                        Read-Only
                    </span>

                </div>

                <div className="alert alert-light border d-flex gap-3 align-items-start">

                    <span className="material-symbols-outlined text-primary">
                        verified_user
                    </span>

                    <div className="small text-muted">
                        <strong className="text-dark">
                            Trust & Safety Guarantee:
                        </strong>{" "}
                        Verified professional credentials and employment
                        information cannot be changed from the general
                        profile page.
                    </div>

                </div>

                <div className="row g-4">

                    {/* Email */}
                    <div className="col-12">

                        <label className="form-label fw-semibold text-muted">
                            Primary Account Email
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    mail
                                </span>
                            </span>

                            <input
                                type="email"
                                className="form-control bg-light"
                                value={formData.email || ""}
                                readOnly
                            />

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    lock
                                </span>
                            </span>

                        </div>

                    </div>

                    {/* Experience */}
                    <div className="col-md-6">

                        <label className="form-label fw-semibold text-muted">
                            Years of Experience
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    history_edu
                                </span>
                            </span>

                            <input
                                type="text"
                                className="form-control bg-light"
                                value={
                                    formData.experience_years !== null &&
                                    formData.experience_years !== undefined
                                        ? `${formData.experience_years} Years`
                                        : ""
                                }
                                readOnly
                            />

                        </div>

                    </div>

                    {/* Current profession */}
                    <div className="col-md-6">

                        <label className="form-label fw-semibold text-muted">
                            Current Profession
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    engineering
                                </span>
                            </span>

                            <input
                                type="text"
                                className="form-control bg-light"
                                value={formData.current_profession || ""}
                                readOnly
                            />

                        </div>

                    </div>

                    {/* Organization */}
                    <div className="col-12">

                        <label className="form-label fw-semibold text-muted">
                            Current Organization & Proven Track Record
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    corporate_fare
                                </span>
                            </span>

                            <input
                                type="text"
                                className="form-control bg-light"
                                value={formData.organization || ""}
                                readOnly
                            />

                        </div>

                    </div>

                    {/* Summary */}
                    <div className="col-12">

                        <label className="form-label fw-semibold text-muted">
                            Verified Professional Summary
                        </label>

                        <div className="form-control bg-light professional-summary">
                            {formData.professional_summary || "Not provided"}
                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default ProfessionalInformation