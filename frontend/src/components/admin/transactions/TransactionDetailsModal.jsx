import React from "react";
import TransactionStatusBadge from "./TransactionStatusBadge";

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDateTime(value) {

    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function TransactionDetailsModal({
    transaction,
    onClose,
}) {

    if (!transaction) {
        return null;
    }

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.45)",
            }}
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div className="modal-content">

                    <div className="modal-header">

                        <div>

                            <h5 className="modal-title">
                                Transaction Details
                            </h5>

                            <div className="small text-muted mt-1">
                                #{transaction.id}
                            </div>

                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    <div className="modal-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>
                                <div className="small text-muted">
                                    Transaction ID
                                </div>

                                <div className="fw-semibold">
                                    {transaction.transaction_id ||
                                        transaction.order_id ||
                                        "—"}
                                </div>
                            </div>

                            <TransactionStatusBadge
                                status={transaction.status}
                            />

                        </div>

                        <div className="row g-4">

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>
                                        <i className="bi bi-person me-2"></i>
                                        Student
                                    </h6>

                                    <div className="details-value">
                                        {transaction.user?.name}
                                    </div>

                                    <div className="small text-muted">
                                        @{transaction.user?.username}
                                    </div>

                                    <div className="small text-muted">
                                        {transaction.user?.email}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>
                                        <i className="bi bi-person-workspace me-2"></i>
                                        Mentor
                                    </h6>

                                    <div className="details-value">
                                        {transaction.mentor?.name}
                                    </div>

                                    <div className="small text-muted">
                                        @{transaction.mentor?.username}
                                    </div>

                                </div>

                            </div>

                            <div className="col-12">

                                <div className="details-section">

                                    <h6>
                                        <i className="bi bi-book me-2"></i>
                                        Course
                                    </h6>

                                    <div className="details-value">
                                        {transaction.course?.title}
                                    </div>

                                    <span className="course-type-badge mt-2 d-inline-block">
                                        Course Enrollment
                                    </span>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div className="details-section">

                                    <h6>Amount</h6>

                                    <div className="details-value">
                                        {formatCurrency(
                                            transaction.amount
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div className="details-section">

                                    <h6>Platform Fee</h6>

                                    <div className="details-value">
                                        {formatCurrency(
                                            transaction.platform_fee
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div className="details-section">

                                    <h6>Mentor Amount</h6>

                                    <div className="details-value">
                                        {formatCurrency(
                                            transaction.mentor_amount
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>Razorpay Order ID</h6>

                                    <code>
                                        {transaction.order_id || "—"}
                                    </code>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>Razorpay Payment ID</h6>

                                    <code>
                                        {transaction.payment_id || "—"}
                                    </code>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>Created At</h6>

                                    <div>
                                        {formatDateTime(
                                            transaction.created_at
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="details-section">

                                    <h6>Paid At</h6>

                                    <div>
                                        {formatDateTime(
                                            transaction.paid_at
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default TransactionDetailsModal;