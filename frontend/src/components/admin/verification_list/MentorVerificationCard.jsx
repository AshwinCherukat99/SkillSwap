import React from "react";

import {useNavigate} from 'react-router-dom'

const MentorVerificationCard=({mentor})=>{
    const navigate=useNavigate()
    const verified=mentor.verified_documents||0
    const total=mentor.total_documents||0
    const progress=total>0?Math.round((verified/total)*100):0
    const getStatusClass=()=>{
        switch(mentor.status){
            case "verified":
                return "bg-success-subtle text-success"

            case "rejected":
                return "bg-danger-subtle text-danger"

            case "review":
                return "bg-primary-subtle text-primary"

            default:
                return "bg-warning-subtle text-warning"
        }
    }
    const handleViewDocuments=()=>{
        navigate(`/admin/mentor-verification/${mentor.id}/documents/`)
    }
    return (
        <div className="card border-0 shadow-sm mb-3">

            <div className="card-body p-4">

                {/* Header */}

                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">

                    <div className="d-flex align-items-center gap-3">

                        {mentor.profile_image ? (

                            <img
                                src={mentor.profile_image}
                                alt={mentor.full_name}
                                className="mentor-verification-avatar"
                            />

                        ) : (

                            <div className="mentor-verification-avatar bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold">
                                {(
                                    mentor.full_name ||
                                    mentor.username ||
                                    "M"
                                )
                                    .split(" ")
                                    .map(
                                        word =>
                                            word[0]
                                    )
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>

                        )}

                        <div>

                            <div className="d-flex flex-wrap align-items-center gap-2">

                                <h5 className="fw-bold mb-0">
                                    {mentor.full_name ||
                                        mentor.username}
                                </h5>

                                <span className="text-secondary small">
                                    @{mentor.username}
                                </span>

                                <span className="badge bg-primary-subtle text-primary">
                                    {mentor.mentor_id}
                                </span>

                            </div>

                            <div className="small text-secondary mt-1">

                                <span className="fw-semibold text-dark">
                                    {mentor.profession ||
                                        "Mentor"}
                                </span>

                                <span className="mx-2">
                                    •
                                </span>

                                <span>
                                    {mentor.email}
                                </span>

                                {mentor.teaching_niche && (
                                    <>
                                        <span className="mx-2">
                                            •
                                        </span>

                                        <span className="badge bg-light text-primary">
                                            {mentor.teaching_niche}
                                        </span>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>


                    <div>

                        <span
                            className={`badge rounded-pill px-3 py-2 ${getStatusClass()}`}
                        >
                            {mentor.status_label ||
                                "Pending Verification"}
                        </span>

                    </div>

                </div>


                {/* Verification information */}

                <div className="row g-3 mt-3">

                    {/* Progress */}

                    <div className="col-12 col-lg-4">

                        <div className="bg-light rounded-3 p-3 h-100">

                            <div className="d-flex justify-content-between small mb-2">

                                <span className="text-secondary">
                                    Verification Audit
                                </span>

                                <strong>
                                    {verified} of {total} Verified
                                </strong>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />

                            </div>

                            <div className="small text-secondary mt-3">

                                <div className="d-flex justify-content-between">

                                    <span>
                                        Submitted:
                                    </span>

                                    <span>
                                        {mentor.submitted_at
                                            ? new Date(
                                                mentor.submitted_at
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )
                                            : "-"}
                                    </span>

                                </div>

                                <div className="d-flex justify-content-between mt-1">

                                    <span>
                                        Last Audited:
                                    </span>

                                    <span>
                                        {mentor.last_audited
                                            ? new Date(
                                                mentor.last_audited
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )
                                            : "-"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Documents */}

                    <div className="col-12 col-lg-8">

                        <div className="bg-light rounded-3 p-3 h-100">

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <span className="small text-uppercase text-secondary fw-semibold">
                                    Required Credential Documents
                                </span>

                                <span className="small text-success fw-semibold">

                                    <i className="bi bi-check-circle me-1"></i>

                                    {mentor.uploaded_documents || 0}
                                    {" / "}
                                    {total}
                                    {" Uploaded"}

                                </span>

                            </div>


                            <div className="row g-2">

                                {(mentor.documents || []).map(
                                    (document) => (

                                        <div
                                            className="col-12 col-sm-6"
                                            key={document.id}
                                        >

                                            <div className="bg-white rounded-3 p-2 d-flex align-items-center gap-2">

                                                <i
                                                    className={`bi ${
                                                        document.status ===
                                                        "VERIFIED"
                                                            ? "bi-check-circle text-success"
                                                            : document.status ===
                                                              "REJECTED"
                                                            ? "bi-x-circle text-danger"
                                                            : "bi-hourglass-split text-primary"
                                                    }`}
                                                ></i>

                                                <div className="min-w-0">

                                                    <div className="small fw-semibold text-truncate">
                                                        {document.name}
                                                    </div>

                                                    <div className="small text-secondary text-truncate">

                                                        {document.status_label ||
                                                            document.status}

                                                        {document.document_type &&
                                                            ` • ${document.document_type}`}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3 pt-3 border-top">

                    <div className="small text-secondary">

                        <i className="bi bi-info-circle me-1"></i>

                        {mentor.action_message ||
                            "Review submitted mentor documents before verification."}

                    </div>


                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-light border"
                            onClick={() =>
                                navigate(
                                    `/admin/mentor-management/${mentor.id}`
                                )
                            }
                        >
                            View Profile
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={
                                handleViewDocuments
                            }
                        >

                            View Documents

                            <i className="bi bi-arrow-right ms-2"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default MentorVerificationCard