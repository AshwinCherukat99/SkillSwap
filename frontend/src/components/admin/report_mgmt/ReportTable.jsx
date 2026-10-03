import React from "react";

function ReportTable({
    reports,
    loading,
    onView
}){
    if (loading){
        return (
            <div className="text-center py-5">

                <div className="spinner-border text-primary" />

            </div>
        )
    }
    if (!reports.length){
        return (
            <div className="text-center py-5 text-muted">

                <i className="bi bi-shield-check display-5" />

                <p className="mt-3 mb-0">
                    No reports found.
                </p>

            </div>
        )
    }
    return (
        <div className="table-responsive">

            <table className="table align-middle mb-0">

                <thead className="table-light">

                    <tr>

                        <th>Report</th>

                        <th>Reporter</th>

                        <th>Reported User</th>

                        <th>Type</th>

                        <th>Priority</th>

                        <th>Status</th>

                        <th>Date</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {reports.map((report) => (

                        <tr key={report.id}>

                            <td>

                                <span className="fw-bold">
                                    REP-{report.id}
                                </span>

                            </td>

                            <td>
                                {report.reporter_name || '—'}
                            </td>

                            <td>
                                {report.reported_user_name || 'Mentor'}
                            </td>

                            <td>
                                {report.report_type}
                            </td>

                            <td>

                                <span
                                    className={`badge ${
                                        report.priority === 'CRITICAL'
                                            ? 'bg-danger'
                                            : report.priority === 'HIGH'
                                            ? 'bg-warning text-dark'
                                            : 'bg-secondary'
                                    }`}
                                >
                                    {report.priority}
                                </span>

                            </td>

                            <td>

                                <span
                                    className={`badge ${
                                        report.status === 'PENDING'
                                            ? 'bg-warning text-dark'
                                            : report.status === 'IN_REVIEW'
                                            ? 'bg-primary'
                                            : report.status === 'RESOLVED'
                                            ? 'bg-success'
                                            : 'bg-secondary'
                                    }`}
                                >
                                    {report.status}
                                </span>

                            </td>

                            <td>
                                {new Date(
                                    report.created_at
                                ).toLocaleDateString()}
                            </td>

                            <td className="text-end">

                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() =>
                                        onView(report)
                                    }
                                >
                                    <i className="bi bi-eye me-1" />
                                    View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default ReportTable