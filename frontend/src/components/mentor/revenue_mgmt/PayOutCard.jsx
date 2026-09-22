import React from 'react' 

const formatCurrency=(value)=>{
    return new Intl.NumberFormat(
        'en-IN',
        {
            style:'currency',
            currency:'INR',
            maximumFractionDigits:2,
        }
    ).format(Number(value||0))
}
const PayoutCard=({wallet={},onRequestPayout})=>{
    const availableBalance=Number(
        wallet.available_balance||0
    )
    const pendingBalance=Number(
        wallet.pending_balance||0
    )
    const canRequestPayout=availableBalance>0
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div>
                        <h5 className="fw-bold mb-1">
                            Payouts
                        </h5>

                        <p className="text-secondary small mb-0">
                            Manage your earnings withdrawals.
                        </p>
                    </div>

                    <div className="rounded-3 p-2 bg-success-subtle text-success">
                        <i className="bi bi-bank fs-5"></i>
                    </div>

                </div>

                {/* Available Balance */}
                <div className="border rounded-3 p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-secondary">
                            Available Balance
                        </span>

                        <span className="fw-bold fs-5">
                            {formatCurrency(availableBalance)}
                        </span>
                    </div>
                </div>

                {/* Pending Balance */}
                <div className="border rounded-3 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-secondary">
                            Pending Payout
                        </span>

                        <span className="fw-bold">
                            {formatCurrency(pendingBalance)}
                        </span>
                    </div>

                    {pendingBalance > 0 && (
                        <div className="mt-2">
                            <span className="badge bg-warning-subtle text-warning-emphasis">
                                Awaiting Admin Approval
                            </span>
                        </div>
                    )}
                </div>

                {/* Request Button */}
                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={onRequestPayout}
                    disabled={!canRequestPayout}
                >
                    <i className="bi bi-send me-2"></i>
                    Request Payout
                </button>

                {!canRequestPayout && (
                    <p className="text-secondary small text-center mt-2 mb-0">
                        You need an available balance to request a payout.
                    </p>
                )}

                {/* Manual Processing Notice */}
                <div className="alert alert-info mt-4 mb-0 small">
                    <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-info-circle mt-1"></i>

                        <div>
                            <strong>
                                Manual payout processing
                            </strong>

                            <div className="mt-1">
                                Payout requests are reviewed and processed
                                manually by the SkillSwap admin.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PayoutCard