import React from "react";

const SkillSuggestionList=({
    suggestions,
    loading,
    onApprove,
    onReject
})=>{
    if (loading){
        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

            </div>
        )
    }
    if (!suggestions.length){
        return (
            <div className="text-center py-5">

                <i className="bi bi-inbox fs-1 text-muted"></i>

                <h6 className="mt-3">
                    No skill suggestions
                </h6>

                <p className="text-muted small mb-0">
                    There are no suggestions for this
                    status.
                </p>

            </div>
        )
    }
    return (
        <div className="d-flex flex-column gap-3">

            {suggestions.map((suggestion) => (

                <div
                    key={suggestion.id}
                    className="border rounded-3 p-3"
                >

                    <div className="d-flex justify-content-between align-items-start gap-3">

                        <div className="flex-grow-1">

                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">

                                <h6 className="fw-bold mb-0">
                                    {suggestion.name}
                                </h6>


                                <span className="badge bg-info-subtle text-info">

                                    {suggestion.suggested_for_display}

                                </span>


                                {suggestion.status === 'PENDING' && (

                                    <span className="badge bg-warning-subtle text-warning">

                                        Pending

                                    </span>

                                )}


                                {suggestion.status === 'APPROVED' && (

                                    <span className="badge bg-success-subtle text-success">

                                        Approved

                                    </span>

                                )}


                                {suggestion.status === 'REJECTED' && (

                                    <span className="badge bg-danger-subtle text-danger">

                                        Rejected

                                    </span>

                                )}

                            </div>


                            <div className="small text-muted mb-2">

                                Suggested by{' '}

                                <strong>
                                    {suggestion.suggested_by_name}
                                </strong>

                            </div>


                            {suggestion.description && (

                                <p className="small text-secondary mb-2">

                                    {suggestion.description}

                                </p>

                            )}


                            {suggestion.rejection_reason && (

                                <div className="alert alert-danger py-2 px-3 small mb-0">

                                    <strong>
                                        Rejection reason:
                                    </strong>{' '}

                                    {suggestion.rejection_reason}

                                </div>

                            )}

                        </div>


                        {/* Actions */}

                        {suggestion.status === 'PENDING' && (

                            <div className="d-flex gap-2 flex-shrink-0">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                        onApprove(
                                            suggestion.id
                                        )
                                    }
                                >

                                    <i className="bi bi-check-lg me-1"></i>

                                    Approve

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                        onReject(
                                            suggestion
                                        )
                                    }
                                >

                                    <i className="bi bi-x-lg me-1"></i>

                                    Reject

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            ))}

        </div>
    )
}

export default SkillSuggestionList