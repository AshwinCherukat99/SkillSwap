import React from 'react'

const formatCurrency=(value)=>{
    const amount=Number(value||0)
    return new Intl.NumberFormat(
        'en-IN',{
            style:'currency',
            currency:'INR',
            maximumFractionDigits:2,
        }
    ).format(amount)
}

const RevenueStats=({wallet={},summary={}})=>{
        const stats=[
            {
                title:'Total Earnings',
                value:formatCurrency(summary.total_earnings),
                icon:'bi-wallet2',
                description:'Total mentor earnings',
            },
            {
                title:'This Month',
                value:formatCurrency(summary.this_month),
                icon:'bi-calendar3',
                description:'Earnings this month',
            },
            {
                title:'Pending Payout',
                value:formatCurrency(summary.pending_payout),
                icon:'bi-clock-history',
                description:'Awaiting admin processing',
            },
            {
                title:'Students Enrolled',
                value:summary.students_enrolled||0,
                icon:'bi-people',
                description:'Unique students',
            },
        ]
        return (
            <div className="row g-4 mt-1">
            {stats.map((stat) => (
                <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={stat.title}
                >
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <p className="text-secondary small mb-1">
                                        {stat.title}
                                    </p>

                                    <h4 className="fw-bold mb-0">
                                        {stat.value}
                                    </h4>
                                </div>

                                <div className="revenue-stat-icon rounded-3 p-2 bg-primary-subtle text-primary">
                                    <i
                                        className={`bi ${stat.icon} fs-5`}
                                    ></i>
                                </div>
                            </div>

                            <small className="text-secondary">
                                {stat.description}
                            </small>

                        </div>
                    </div>
                </div>
            ))}
        </div>
        ) 
    }

export default RevenueStats