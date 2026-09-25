import React,{useState} from "react";

const RejectCourseModal=({
    course,
    onClose,
    onSubmit,
    loading
})=>{
    const [reason,setReason]=useState('')
    if (!course) return null
    const handleSubmit=()=>{
        if (!reason.trim()){
            return
        }
        onSubmit(reason.trim())
    }
    return (
        <div
            className="modal fade show d-block"
            style={{
                backgroundColor: "rgba(0,0,0,.5)"
            }}
        >

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title fw-bold">
                            Reject Course
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <p>
                            You are rejecting:
                        </p>

                        <div className="fw-semibold mb-3">
                            {course.title}
                        </div>

                        <label className="form-label fw-semibold">
                            Reason for rejection
                        </label>

                        <textarea
                            className="form-control"
                            rows="5"
                            placeholder="Explain what needs to be changed..."
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                        />

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={handleSubmit}
                            disabled={
                                loading ||
                                !reason.trim()
                            }
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    />
                                    Rejecting...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-x-circle me-2" />
                                    Reject Course
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RejectCourseModal