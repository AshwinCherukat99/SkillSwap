import React,{useEffect,useState,useMemo} from 'react'

const formatCurrency=(value)=>{
    return new Intl.NumberFormat('en-IN',{
        style:'currency',
        currency:'INR',
        maximumFractionDigits:2,
    }).format(Number(value||0))
}
const RevenueAnalytics=({transactions=[]})=>{
    const [period,setPeriod]=useState('all')
    const analytics=useMemo(()=>{
        const now=new Date()
        let filteredTransactions=transactions
        if (period==='month'){
            filteredTransactions=transactions.filter(
                (transaction)=>{
                    if (!transaction.date){
                        return false
                    }
                    const date=new Date(transaction.date)
                    return (
                        date.getMonth()===now.getMonth() &&
                        date.getYear()===now.getYear()
                    )
                }
            )
        }
        if (period==='year'){
            filteredTransactions=transactions.filter(
                (transaction)=>{
                    if (!transaction.data){
                        return false
                    }
                    const date=new Date(transaction.date)
                    return date.getFullYear()===now.getFullYear()
                }
            )
        }
        const total=filteredTransactions.reduce(
            (sum,transaction)=>{
                return sum+Number(transaction.mentor_amount||0)
            },
            0
        )
        const transactionCount=filteredTransactions.length
        const average=transactionCount>0?total/transactionCount:0
        return {
            total,
            transactionCount,
            average,
        }
    },[transactions,period])
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                    <div>
                        <h5 className="fw-bold mb-1">
                            Revenue Analytics
                        </h5>

                        <p className="text-secondary small mb-0">
                            Overview of your course earnings.
                        </p>
                    </div>

                    <div className="btn-group btn-group-sm">
                        <button
                            type="button"
                            className={`btn ${
                                period === "month"
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setPeriod("month")}
                        >
                            This Month
                        </button>

                        <button
                            type="button"
                            className={`btn ${
                                period === "year"
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setPeriod("year")}
                        >
                            This Year
                        </button>

                        <button
                            type="button"
                            className={`btn ${
                                period === "all"
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setPeriod("all")}
                        >
                            All
                        </button>
                    </div>
                </div>

                <div className="row g-3">

                    <div className="col-12 col-md-4">
                        <div className="bg-light rounded-3 p-3 h-100">
                            <span className="text-secondary small">
                                Earnings
                            </span>

                            <h5 className="fw-bold mt-2 mb-0">
                                {formatCurrency(analytics.total)}
                            </h5>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="bg-light rounded-3 p-3 h-100">
                            <span className="text-secondary small">
                                Transactions
                            </span>

                            <h5 className="fw-bold mt-2 mb-0">
                                {analytics.transactionCount}
                            </h5>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="bg-light rounded-3 p-3 h-100">
                            <span className="text-secondary small">
                                Average Earnings
                            </span>

                            <h5 className="fw-bold mt-2 mb-0">
                                {formatCurrency(analytics.average)}
                            </h5>
                        </div>
                    </div>

                </div>

                <div className="mt-4 p-3 rounded-3 border">
                    <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-info-circle text-primary mt-1"></i>

                        <p className="small text-secondary mb-0">
                            Analytics are calculated from the transactions
                            currently returned by the revenue API.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RevenueAnalytics