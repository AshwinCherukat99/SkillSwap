import React,{useState} from 'react'

import {CheckCircle,Info,XCircle} from 'lucide-react'

const VerificationActions=({
    mentor,
    verification,
    loading,
    onApprove,
    onReject,
    onRequestInfo,
})=>{
    const [showRequestInfo,setShowRequestInfo]=useState(false)
    const [showReject,setShowReject]=useState(false)
    const [message,setMessage]=useState('')
    const [rejectionReason,setRejectionReason]=useState('')
    const handleRequestInfo=()=>{
        if (!message.trim()){
            return 
        }
        onRequestInfo(message.trim())
        setMessage('')
        setShowRequestInfo(false)
    }
    const handleReject=()=>{
        if (!rejectionReason.trim()){
            return
        }
        onReject(rejectionReason.trim())
        setRejectionReason('')
        setShowReject(false)
    }
    const isApproved=verification?.status==='APPROVED'
    const isRejected=verification?.status==='REJECTED'
    return (
        <>
            <section className="card border-0 shadow-sm verification-card">

                <div className="card-body p-4">

                    <h3 className="small fw-bold text-uppercase text-muted mb-3">
                        Final Decision
                    </h3>


                    <div className="d-flex flex-column gap-2">

                        <button
                            className="btn btn-success py-2"
                            disabled={
                                loading ||
                                isApproved ||
                                isRejected
                            }
                            onClick={() => {

                                const confirmed =
                                    window.confirm(
                                        `Approve ${mentor?.username} as a mentor?`
                                    )

                                if (confirmed) {
                                    onApprove()
                                }

                            }}
                        >

                            <CheckCircle
                                size={18}
                                className="me-2"
                            />

                            {loading
                                ? 'Processing...'
                                : 'Approve Mentor'}

                        </button>


                        <div className="row g-2">

                            <div className="col-6">

                                <button
                                    className="btn btn-warning w-100"
                                    disabled={
                                        loading ||
                                        isApproved ||
                                        isRejected
                                    }
                                    onClick={() =>
                                        setShowRequestInfo(true)
                                    }
                                >

                                    <Info
                                        size={17}
                                        className="me-1"
                                    />

                                    Request Info

                                </button>

                            </div>


                            <div className="col-6">

                                <button
                                    className="btn btn-outline-danger w-100"
                                    disabled={
                                        loading ||
                                        isApproved ||
                                        isRejected
                                    }
                                    onClick={() =>
                                        setShowReject(true)
                                    }
                                >

                                    <XCircle
                                        size={17}
                                        className="me-1"
                                    />

                                    Reject

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* Request information */}
            {showRequestInfo && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        background: 'rgba(0,0,0,0.5)',
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Request Additional Information
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowRequestInfo(false)
                                    }
                                />

                            </div>

                            <div className="modal-body">

                                <label className="form-label">
                                    Message
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Explain what additional information the mentor needs to provide..."
                                />

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowRequestInfo(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-warning"
                                    disabled={!message.trim()}
                                    onClick={
                                        handleRequestInfo
                                    }
                                >
                                    Send Request
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}


            {/* Reject */}
            {showReject && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        background: 'rgba(0,0,0,0.5)',
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title text-danger">
                                    Reject Mentor
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowReject(false)
                                    }
                                />

                            </div>

                            <div className="modal-body">

                                <label className="form-label">
                                    Rejection Reason
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Explain why this mentor verification is being rejected..."
                                />

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowReject(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    disabled={
                                        !rejectionReason.trim()
                                    }
                                    onClick={handleReject}
                                >
                                    Reject Mentor
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </>
    )
}

export default VerificationActions