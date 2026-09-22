import React from 'react'

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
};

const formatDate=(value)=>{
    if (!value){
        return '-'
    }
    const date=new Date(value)
    if (Number.isNaN(date.getTime())){
        return '-'
    }
    return date.toLocaleDateString('en-IN',{
        day:'2-digit',
        month:'short',
        year:'numeric',
    })
}

const RecentTransactions=({transactions=[]})=>{
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body p-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                    <div>
                        <h5 className="fw-bold mb-1">
                            Recent Transactions
                        </h5>

                        <p className="text-secondary small mb-0">
                            Recent course payment transactions.
                        </p>
                    </div>

                    <span className="badge bg-light text-secondary">
                        {transactions.length} transactions
                    </span>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-receipt fs-1 text-secondary"></i>

                        <p className="text-secondary mt-3 mb-0">
                            No transactions available yet.
                        </p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">

                            <thead>
                                <tr>
                                    <th>Transaction</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                    <th>Platform Fee</th>
                                    <th className="text-end">
                                        Your Earnings
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                    >
                                        <td>
                                            <div className="fw-semibold">
                                                {transaction.transaction_id ||
                                                    `#${transaction.id}`}
                                            </div>

                                            <span className="badge bg-success-subtle text-success mt-1">
                                                {transaction.status}
                                            </span>
                                        </td>

                                        <td>
                                            {transaction.student_name ||
                                                "-"}
                                        </td>

                                        <td>
                                            <span className="small">
                                                {transaction.course_title ||
                                                    "-"}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                transaction.date
                                            )}
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                transaction.platform_fee
                                            )}
                                        </td>

                                        <td className="text-end fw-bold text-success">
                                            {formatCurrency(
                                                transaction.mentor_amount
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RecentTransactions