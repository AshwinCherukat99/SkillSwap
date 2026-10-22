function FinancialHealth({
    financialHealth
}){
    const successRate=Number(
        financialHealth?.transaction_success_rate||0
    )
    const refundRate=Number(
        financialHealth?.refund_rate||0
    )
    return (
        <div className="payment-panel">

            <h3 className="fw-semibold fs-5 mb-4">
                Financial Health
            </h3>


            <div className="d-flex flex-column gap-4">

                {/* Transaction Success */}

                <div>

                    <div className="d-flex justify-content-between align-items-end mb-2">

                        <span className="small fw-bold text-muted text-uppercase">
                            Transaction Success
                        </span>

                        <span className="small fw-bold text-success">
                            {successRate.toFixed(1)}%
                        </span>

                    </div>


                    <div className="progress payment-health-progress">

                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                                width: `${Math.min(
                                    successRate,
                                    100
                                )}%`
                            }}
                        ></div>

                    </div>

                </div>


                {/* Refund Rate */}

                <div>

                    <div className="d-flex justify-content-between align-items-end mb-2">

                        <span className="small fw-bold text-muted text-uppercase">
                            Refund Rate
                        </span>

                        <span className="small fw-bold text-danger">
                            {refundRate.toFixed(1)}%
                        </span>

                    </div>


                    <div className="progress payment-health-progress">

                        <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{
                                width: `${Math.min(
                                    refundRate,
                                    100
                                )}%`
                            }}
                        ></div>

                    </div>

                </div>

            </div>


            <div className="mt-4 p-3 financial-status">

                <div className="small text-primary fw-bold text-uppercase mb-1">
                    Status Report
                </div>

                <p className="small text-muted fst-italic mb-0">
                    System is performing optimally.
                    Financial metrics are being monitored.
                </p>

            </div>

        </div>
    )
}

export default FinancialHealth