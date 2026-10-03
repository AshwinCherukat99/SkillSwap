function RevenueAnalytics({overview,financialHealth}){
    const successRate=Number(financialHealth?.transaction_success_rate||0).toFixed(1)
    return (
        <div className="row g-4">

            {/* Revenue By Category */}

            <div className="col-12 col-md-4">

                <div className="payment-panel h-100">

                    <h4 className="fw-semibold fs-6 mb-4">
                        Revenue by Category
                    </h4>


                    <div className="d-flex justify-content-center mb-4">

                        <div className="donut-chart">

                            <div className="donut-value">

                                <strong>
                                    ₹
                                    {Number(
                                        overview?.total_revenue || 0
                                    ).toLocaleString('en-IN')}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <ul className="list-unstyled mb-0">

                        <li className="d-flex justify-content-between small mb-2">

                            <span>
                                <span className="legend-dot legend-primary"></span>
                                Technology
                            </span>

                            <strong>75%</strong>

                        </li>


                        <li className="d-flex justify-content-between small mb-2">

                            <span>
                                <span className="legend-dot legend-gold"></span>
                                Business
                            </span>

                            <strong>15%</strong>

                        </li>


                        <li className="d-flex justify-content-between small">

                            <span>
                                <span className="legend-dot legend-neutral"></span>
                                Creative
                            </span>

                            <strong>10%</strong>

                        </li>

                    </ul>

                </div>

            </div>


            {/* Payout vs Profit */}

            <div className="col-12 col-md-4">

                <div className="payment-panel h-100">

                    <h4 className="fw-semibold fs-6 mb-4">
                        Payout vs Profit
                    </h4>


                    <div className="bar-chart">

                        <div className="bar-group">

                            <div className="bar payout h-75"></div>

                            <div className="bar profit h-50"></div>

                        </div>


                        <div className="bar-group">

                            <div className="bar payout h-90"></div>

                            <div className="bar profit h-40"></div>

                        </div>


                        <div className="bar-group">

                            <div className="bar payout h-100"></div>

                            <div className="bar profit h-60"></div>

                        </div>


                        <div className="bar-group">

                            <div className="bar payout h-60"></div>

                            <div className="bar profit h-30"></div>

                        </div>

                    </div>


                    <div className="d-flex justify-content-center gap-4 mt-4">

                        <span className="small">
                            <span className="legend-dot legend-primary-light"></span>
                            Payouts
                        </span>

                        <span className="small">
                            <span className="legend-dot legend-primary"></span>
                            Profit
                        </span>

                    </div>

                </div>

            </div>


            {/* Success Rate */}

            <div className="col-12 col-md-4">

                <div className="payment-panel h-100">

                    <h4 className="fw-semibold fs-6 mb-4">
                        Success Rate
                    </h4>


                    <div className="d-flex justify-content-center mb-4">

                        <div
                            className="success-radial"
                            style={{
                                '--success-rate':
                                    `${successRate}%`
                            }}
                        >

                            <div className="success-radial-content">

                                <strong>
                                    {successRate}%
                                </strong>

                                <span>
                                    GLOBAL RATE
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="d-flex flex-column gap-2">

                        <div className="success-method">

                            <strong>
                                Stripe
                            </strong>

                            <span>
                                {successRate}%
                            </span>

                        </div>


                        <div className="success-method">

                            <strong>
                                PayPal
                            </strong>

                            <span>
                                {successRate}%
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RevenueAnalytics