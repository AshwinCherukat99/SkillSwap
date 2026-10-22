function RecentTransactions({transactions,onViewAll}){
    const formatAmount=(amount)=>{
        return Number(amount||0).toLocaleString(
            'en-IN',
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        )
    }
    const formatDate=(date)=>{
        if (!date){
            return
        }
        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day:'2-digit',
                month:'short',
                year:'numeric',
            }
        )
    }
    const getStatusClass=(status)=>{
        switch(status){
            case 'PAID':
                return 'transaction-status-success'

            case 'PENDING':
                return 'transaction-status-pending'

            case 'REFUNDED':
                return 'transaction-status-refunded'

            case 'FAILED':
                return 'transaction-status-failed'

            default:
                return 'transaction-status-pending'
        }
    }
    const getStatusLabel=(status)=>{
        switch(status){
            case 'PAID':
                return 'Successful'

            case 'PENDING':
                return 'Pending'

            case 'REFUNDED':
                return 'Refunded'

            case 'FAILED':
                return 'Failed'

            default:
                return status || 'Unknown'
        }
    }
    return (
        <div className="payment-panel p-0 overflow-hidden">

            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">

                <h3 className="fw-semibold fs-5 mb-0">
                    Recent Transactions
                </h3>


                <button
                    type="button"
                    className="btn btn-link text-primary text-decoration-none fw-bold"
                    onClick={onViewAll}
                >

                    View All Transactions

                    <i className="bi bi-arrow-right ms-1"></i>

                </button>

            </div>


            <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                    <thead>

                        <tr>

                            <th>
                                Transaction ID
                            </th>

                            <th>
                                User
                            </th>

                            <th>
                                Mentor
                            </th>

                            <th>
                                Session (Skill)
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Method
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {transactions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-5 text-muted"
                                >
                                    No transactions found.
                                </td>

                            </tr>

                        ) : (

                            transactions.map((transaction) => (

                                <tr key={transaction.id}>

                                    <td>

                                        <span className="transaction-id">

                                            {transaction.transaction_id || '-'}
                                            
                                        </span>

                                    </td>


                                    <td>

                                        <div className="d-flex align-items-center gap-2">

                                            <div className="transaction-avatar">
                                                {transaction.student_name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                                }
                                            </div>

                                            <span>
                                                {transaction.student_name}
                                            </span>

                                        </div>

                                    </td>


                                    <td>
                                        {transaction.mentor_name}
                                    </td>


                                    <td>

                                        <span className="course-tag">

                                            {transaction.course_title}

                                        </span>

                                    </td>


                                    <td className="fw-bold">

                                        ₹
                                        {formatAmount(
                                            transaction.amount
                                        )}

                                    </td>


                                    <td className="text-muted">

                                        <i className="bi bi-credit-card me-1"></i>

                                        Razorpay

                                    </td>


                                    <td className="text-muted">

                                        {formatDate(
                                            transaction.paid_at ||
                                            transaction.created_at
                                        )}

                                    </td>


                                    <td>

                                        <span
                                            className={
                                                `transaction-status ${
                                                    getStatusClass(
                                                        transaction.status
                                                    )
                                                }`
                                            }
                                        >

                                            {getStatusLabel(
                                                transaction.status
                                            )}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default RecentTransactions