import React from "react";

const Trend=({
    label,
    percentage,
    count,
    color,
})=>{
    return (
        <div className="mb-4">

            <div className="d-flex justify-content-between mb-2">

                <span className="small text-muted">
                    {label}
                </span>

                <span className="small fw-bold">
                    {percentage}%
                </span>

            </div>

            <div
                className="progress"
                style={{
                    height: "8px"
                }}
            >

                <div
                    className={`progress-bar ${color}`}
                    style={{
                        width: `${Math.min(
                            percentage,
                            100
                        )}%`
                    }}
                />

            </div>

            <div className="small text-muted mt-1">
                {count} sessions
            </div>

        </div>
    )
}
const CompletionTrends=({completionTrends})=>{
    return (
        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <h6 className="fw-bold mb-4">
                    Completion Trends
                </h6>

                <Trend
                    label="Completed"
                    percentage={
                        completionTrends.completed.percentage
                    }
                    count={
                        completionTrends.completed.count
                    }
                    color="bg-success"
                />

                <Trend
                    label="Cancelled"
                    percentage={
                        completionTrends.cancelled.percentage
                    }
                    count={
                        completionTrends.cancelled.count
                    }
                    color="bg-danger"
                />

                <Trend
                    label="Rejected"
                    percentage={
                        completionTrends.rejected.percentage
                    }
                    count={
                        completionTrends.rejected.count
                    }
                    color="bg-secondary"
                />

                <Trend
                    label="Expired"
                    percentage={
                        completionTrends.expired.percentage
                    }
                    count={
                        completionTrends.expired.count
                    }
                    color="bg-dark"
                />

            </div>

        </div>
    )
}

export default CompletionTrends