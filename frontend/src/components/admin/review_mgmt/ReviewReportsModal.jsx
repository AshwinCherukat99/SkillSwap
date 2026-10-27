import React,{useEffect,useState} from "react";

import adminApi from '../../../services/adminApi'

const ReviewReportsModal=({review,onClose})=>{
    const [reports,setReports]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const fetchReports=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                `/admin/reviews/${review.id}/reports/`
            )
            setReports(response.data.reports||[])
        }catch(err){
            console.error('failed to load review reports-',err)
            setError(err.response?.data?.error||'failed to load reports')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchReports()
    },[review.id])
    const updateReport=async (
        reportId,
        newStatus
    )=>{
        try{
            const response=await adminApi.patch(
                `/admin/reviews/${review.id}/reports/reportId/`,
                {
                    status:newStatus,
                }
            )
            setReports((current)=>
            current.map((report)=>
            report.id===reportId?response.data:report))
        }catch(err){
            console.error('failed to update report:',err)
        }
    }
    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
                backgroundColor:
                    "rgba(0,0,0,0.5)",
            }}
        >

            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

                <div className="modal-content">

                    <div className="modal-header">

                        <div>

                            <h5 className="modal-title">
                                Review Reports
                            </h5>

                            <div className="small text-secondary">
                                Review #{review.id}
                            </div>

                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    <div className="modal-body">

                        {loading && (
                            <div className="text-center py-4">
                                <div className="spinner-border"></div>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            reports.length === 0 && (
                                <div className="text-center py-5">

                                    <i className="bi bi-shield-check fs-1 text-success"></i>

                                    <h6 className="mt-3">
                                        No reports
                                    </h6>

                                    <p className="text-secondary mb-0">
                                        This review has not been
                                        reported.
                                    </p>

                                </div>
                            )}

                        {!loading &&
                            reports.map((report) => (

                                <div
                                    className="card border mb-3"
                                    key={report.id}
                                >

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between">

                                            <div>

                                                <h6 className="fw-bold mb-1">
                                                    {report.report_type}
                                                </h6>

                                                <div className="small text-secondary">
                                                    Reported by{" "}
                                                    {report.reporter_name}
                                                </div>

                                            </div>

                                            <div className="text-end">

                                                <span className="badge bg-secondary">
                                                    {report.priority}
                                                </span>

                                                <div className="small text-secondary mt-1">
                                                    {report.status}
                                                </div>

                                            </div>

                                        </div>

                                        <p className="mt-3 mb-3">
                                            {report.description}
                                        </p>

                                        <div className="d-flex flex-wrap gap-2">

                                            {report.status === "PENDING" && (

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        updateReport(
                                                            report.id,
                                                            "IN_REVIEW"
                                                        )
                                                    }
                                                >
                                                    Mark In Review
                                                </button>

                                            )}

                                            {(
                                                report.status ===
                                                    "PENDING" ||
                                                report.status ===
                                                    "IN_REVIEW"
                                            ) && (

                                                <>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            updateReport(
                                                                report.id,
                                                                "RESOLVED"
                                                            )
                                                        }
                                                    >
                                                        Resolve
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() =>
                                                            updateReport(
                                                                report.id,
                                                                "DISMISSED"
                                                            )
                                                        }
                                                    >
                                                        Dismiss
                                                    </button>
                                                </>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ReviewReportsModal