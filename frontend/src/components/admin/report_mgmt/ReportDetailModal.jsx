import React,{useState} from "react";

function ReportDetailModal({
    report,
    onClose,
    onUpdate,
    onSuspend,
}){
    const [status,setStatus]=useState(report?.status||'PENDING')   
    const [priority,setPriority]=useState(report?.priority||'MEDIUM')
    const [notes,setNotes]=useState(report?.admin_notes||'')
    const [resolution,setResolution]=useState(report?.resolution||'')
    if (!report){
        return null
    }
    const handleSave=()=>{
        onUpdate(
            report.id,
            {
                status,
                priority,
                admin_notes:notes,
                resolution,
            }
        )
    }
    return (
        <div
            className="modal fade show d-block"
            style={{
                background: 'rgba(0,0,0,.5)'
            }}
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div className="modal-content border-0 shadow-lg">

                    <div className="modal-header">

                        <div>

                            <h5 className="modal-title fw-bold">
                                REP-{report.id}
                            </h5>

                            <small className="text-muted">
                                Report details
                            </small>

                        </div>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <div className="row g-4">

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Reporter
                                </label>

                                <div className="form-control bg-light">
                                    {report.reporter_name}
                                </div>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Reported User
                                </label>

                                <div className="form-control bg-light">
                                    {report.reported_user_name || 'Mentor'}
                                </div>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Report Type
                                </label>

                                <div className="form-control bg-light">
                                    {report.report_type}
                                </div>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Target
                                </label>

                                <div className="form-control bg-light">
                                    {report.target_type}
                                    {report.target_id
                                        ? ` #${report.target_id}`
                                        : ''}
                                </div>

                            </div>

                            <div className="col-12">

                                <label className="form-label small fw-semibold">
                                    Description
                                </label>

                                <div className="border rounded p-3 bg-light">
                                    {report.description}
                                </div>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Status
                                </label>

                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                >

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="IN_REVIEW">
                                        In Review
                                    </option>

                                    <option value="RESOLVED">
                                        Resolved
                                    </option>

                                    <option value="DISMISSED">
                                        Dismissed
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label small fw-semibold">
                                    Priority
                                </label>

                                <select
                                    className="form-select"
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value)
                                    }
                                >

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="CRITICAL">
                                        Critical
                                    </option>

                                </select>

                            </div>

                            <div className="col-12">

                                <label className="form-label small fw-semibold">
                                    Admin Notes
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                />

                            </div>

                            <div className="col-12">

                                <label className="form-label small fw-semibold">
                                    Resolution
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={resolution}
                                    onChange={(e) =>
                                        setResolution(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    <div className="modal-footer">

                        {report.reported_user_id && (

                            <button
                                className="btn btn-outline-danger me-auto"
                                onClick={() =>
                                    onSuspend(
                                        report.reported_user_id
                                    )
                                }
                            >
                                <i className="bi bi-slash-circle me-2" />
                                Suspend User
                            </button>

                        )}

                        <button
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Save Moderation
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ReportDetailModal