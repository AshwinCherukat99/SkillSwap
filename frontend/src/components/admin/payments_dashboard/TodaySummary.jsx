function TodaySummary({today}){
    const formatAmount=(value)=>{
        return Number(value||0).toLocaleString(
            'en-IN',
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }
        )
    }
    return (
        <div className="payment-panel">

            <h3 className="fw-semibold fs-5 mb-4">
                Today's Summary
            </h3>


            <div className="d-flex flex-column gap-3">

                <div className="today-summary-item">

                    <div className="d-flex align-items-center gap-3">

                        <div className="today-icon today-icon-success">

                            <i className="bi bi-currency-rupee"></i>

                        </div>

                        <span>
                            Total Sales
                        </span>

                    </div>


                    <strong>
                        ₹{formatAmount(today?.sales)}
                    </strong>

                </div>


                <div className="today-summary-item">

                    <div className="d-flex align-items-center gap-3">

                        <div className="today-icon today-icon-primary">

                            <i className="bi bi-receipt"></i>

                        </div>

                        <span>
                            Transactions
                        </span>

                    </div>


                    <strong>
                        {today?.transactions || 0}
                    </strong>

                </div>

            </div>

        </div>
    )
}

export default TodaySummary