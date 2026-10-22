function PaymentQuickActions({
    onGenerateReport,
    onApprovePayouts,
    onReviewRefunds
}){
    return (
        <div className="payment-panel">

            <h3 className="fw-semibold fs-5 mb-4">
                Quick Actions
            </h3>


            <div className="d-flex flex-column gap-3">

                <button
                    type="button"
                    className="btn btn-primary py-3 fw-bold"
                    onClick={onGenerateReport}
                >

                    <i className="bi bi-file-earmark-text me-2"></i>

                    Generate Report

                </button>


                <button
                    type="button"
                    className="btn btn-light py-3 fw-bold"
                    onClick={onApprovePayouts}
                >

                    <i className="bi bi-check-circle me-2"></i>

                    Approve Payouts

                </button>


                <button
                    type="button"
                    className="btn btn-outline-secondary py-3 fw-bold"
                    onClick={onReviewRefunds}
                >

                    <i className="bi bi-arrow-return-left me-2"></i>

                    Review Refunds

                </button>

            </div>

        </div>
    )
}

export default PaymentQuickActions