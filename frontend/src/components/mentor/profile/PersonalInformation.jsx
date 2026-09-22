import React from 'react'

function PersonalInformation({
    formData,
    onChange
}){
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div>
                        <div className="d-flex align-items-center gap-2">

                            <span className="material-symbols-outlined text-primary">
                                badge
                            </span>

                            <h3 className="h5 mb-0">
                                Personal Information
                            </h3>

                        </div>

                        <p className="text-muted small mt-2 mb-0">
                            These personal details appear across your
                            student communication and booking confirmations.
                        </p>
                    </div>

                    <span className="badge bg-primary-subtle text-primary">
                        Editable
                    </span>

                </div>

                <div className="row g-4">

                    {/* Full Name */}
                    <div className="col-12">

                        <label
                            htmlFor="full_name"
                            className="form-label fw-semibold"
                        >
                            Full Name
                            <span className="text-danger"> *</span>
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                            </span>

                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                className="form-control"
                                value={formData.full_name}
                                onChange={onChange}
                                required
                            />

                        </div>

                        <div className="form-text">
                            Used as your public display name across the platform.
                        </div>

                    </div>

                    {/* Username */}
                    <div className="col-12">

                        <label
                            htmlFor="username"
                            className="form-label fw-semibold"
                        >
                            Username
                            <span className="text-danger"> *</span>
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                skillswap.com/@
                            </span>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="form-control"
                                value={formData.username}
                                onChange={onChange}
                                required
                            />

                        </div>

                        <div className="form-text">
                            Custom profile URL for sharing directly
                            with prospective mentees.
                        </div>

                    </div>

                    {/* Phone */}
                    <div className="col-12">

                        <label
                            htmlFor="phone_number"
                            className="form-label fw-semibold"
                        >
                            Phone Number
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <span className="material-symbols-outlined">
                                    call
                                </span>
                            </span>

                            <input
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                className="form-control"
                                value={formData.phone_number}
                                onChange={onChange}
                            />

                        </div>

                        <div className="form-text">
                            Kept private. Only used for SMS booking
                            reminders and critical safety alerts.
                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}  

export default PersonalInformation