function PaymentOverviewCards({overview}){
    const cards=[
        {
            title:'Total Revenue',
            value:overview.total_revenue,
            icon:'bi bi-cash-stack',
            className:'payment-card-primary',
            prefix:'₹',
        },
        {
            title:'Total Transactions',
            value:overview.total_transactions,
            icon:'bi bi-receipt',
            className:'payment-card-neutral',
            prefix:'',
        },
        {
            title:'Todays Revenue',
            value:overview.today_revenue,
            icon:'bi bi-calendar-day',
            className:'payment-card-gold',
            prefix:'₹',
        },
        {
            title:'Pending Payouts',
            value:overview.pending_payouts,
            icon:'bi bi-hourglass-split',
            className:'payment-card-danger',
            prefix:'₹',
        },
        {
            title:'Refunded Payments',
            value:overview.refund_count,
            icon:'bi bi-arrow-counterclockwise',
            className:'payment-card-neutral',
            prefix:'',
        },
        {
            title:'Platform Profit',
            value:overview.platform_profit,
            icon:'bi bi-bank',
            className:'payment-card-primary',
            prefix:'₹',
        },
        {
            title:'Monthly Growth',
            value:overview.monthly_growth,
            icon:'bi bi-graph-up',
            className:'payment-card-growth',
            prefix:'%',
        },
    ]
    const formatNumber=(value)=>{
        if (value===null||value===undefined){
            return 0
        }
        return Number(value).toLocaleString(
            'en-IN',
            {
                maximumFractionDigits:2,
            }
        )
    }
    return (
        <div className="row g-4">

            {cards.map((card) => (

                <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={card.title}
                >

                    <div
                        className={`payment-overview-card ${card.className}`}
                    >

                        <div className="d-flex justify-content-between align-items-start mb-3">

                            <div className="payment-card-icon">

                                <i className={card.icon}></i>

                            </div>

                            {card.title === 'Monthly Growth' && (

                                <span className="text-success fw-bold small">

                                    <i className="bi bi-arrow-up me-1"></i>

                                    Growth

                                </span>

                            )}

                        </div>

                        <div className="small text-uppercase fw-semibold text-muted mb-1">

                            {card.title}

                        </div>

                        <div className="fs-3 fw-bold">

                            {card.prefix || ''}

                            {formatNumber(card.value)}

                            {card.suffix || ''}

                        </div>

                    </div>

                </div>

            ))}

        </div>
    )
}

export default PaymentOverviewCards