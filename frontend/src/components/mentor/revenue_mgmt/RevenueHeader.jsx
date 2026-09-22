import React from 'react'

const RevenueHeader=()=>{
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
                <h2 className="fw-bold mb-1">
                    Revenue
                </h2>

                <p className="text-secondary mb-0">
                    Track your course earnings, wallet balance, and payout requests.
                </p>
            </div>
        </div>
    )
}

export default RevenueHeader