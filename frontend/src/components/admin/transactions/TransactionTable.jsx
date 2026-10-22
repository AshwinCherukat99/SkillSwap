import React from "react";
import TransactionStatusBadge from "./TransactionStatusBadge";

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value) {

    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

function TransactionTable({
    transactions,
    loading,
    onViewDetails,
}) {

    if (loading) {

        return (
            <div className="transaction-table-card">

                <div className="transaction-loading">

                    <div className="spinner-border text-primary">
                    </div>

                    <p className="mb-0 mt-3 text-muted">
                        Loading transactions...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="transaction-table-card">

            <div className="transaction-table-header">

                <div>
                    <h5 className="mb-1">
                        All Transactions
                    </h5>

                    <p className="text-muted mb-0 small">
                        Showing all user course enrollment transactions
                    </p>
                </div>

            </div>

            <div className="table-responsive">

                <table className="table transaction-table align-middle mb-0">

                    <thead>

                        <tr>
                            <th>Transaction ID</th>
                            <th>User</th>
                            <th>Course</th>
                            <th className="text-end">
                                Amount
                            </th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-center">
                                Action
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {transactions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-5"
                                >
                                    <i className="bi bi-receipt fs-2 text-muted d-block mb-2"></i>

                                    <span className="text-muted">
                                        No transactions found
                                    </span>
                                </td>

                            </tr>

                        ) : (

                            transactions.map((transaction) => (

                                <tr key={transaction.id}>

                                    {/* Transaction ID */}

                                    <td>

                                        <div className="transaction-id">
                                            {transaction.transaction_id ||
                                                transaction.order_id ||
                                                `#${transaction.id}`}
                                        </div>

                                        {transaction.payment_id && (
                                            <div className="small text-muted">
                                                Payment: {transaction.payment_id}
                                            </div>
                                        )}

                                    </td>

                                    {/* User */}

                                    <td>

                                        <div className="d-flex align-items-center gap-2">

                                            {transaction.user?.profile_image ? (

                                                <img
                                                    src={
                                                        transaction.user.profile_image
                                                    }
                                                    alt=""
                                                    className="transaction-user-avatar"
                                                />

                                            ) : (

                                                <div className="transaction-user-avatar transaction-avatar-placeholder">
                                                    {transaction.user?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}
                                                </div>

                                            )}

                                            <div>

                                                <div className="fw-semibold">
                                                    {transaction.user?.name ||
                                                        transaction.user?.username}
                                                </div>

                                                <div className="small text-muted">
                                                    @{transaction.user?.username}
                                                </div>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Course */}

                                    <td>

                                        <div className="course-name">
                                            {transaction.course?.title}
                                        </div>

                                        <span className="course-type-badge">
                                            Course Enrollment
                                        </span>

                                    </td>

                                    {/* Amount */}

                                    <td className="text-end">

                                        <span className="fw-bold">
                                            {formatCurrency(
                                                transaction.amount
                                            )}
                                        </span>

                                    </td>

                                    {/* Method */}

                                    <td>

                                        <div className="payment-method">

                                            <i className="bi bi-credit-card"></i>

                                            <span>
                                                {transaction.method}
                                            </span>

                                        </div>

                                    </td>

                                    {/* Date */}

                                    <td className="text-nowrap">

                                        {formatDate(
                                            transaction.paid_at ||
                                            transaction.created_at
                                        )}

                                    </td>

                                    {/* Status */}

                                    <td>

                                        <TransactionStatusBadge
                                            status={
                                                transaction.status
                                            }
                                        />

                                    </td>

                                    {/* Action */}

                                    <td className="text-center">

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary transaction-view-btn"
                                            title="View Details"
                                            onClick={() =>
                                                onViewDetails(
                                                    transaction
                                                )
                                            }
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default TransactionTable;