import React from "react";

function TransactionStatusBadge({ status }) {

    const config = {
        PAID: {
            label: "Successful",
            className: "transaction-status-success",
            icon: "bi-check-circle-fill",
        },

        CREATED: {
            label: "Pending",
            className: "transaction-status-pending",
            icon: "bi-hourglass-split",
        },

        FAILED: {
            label: "Failed",
            className: "transaction-status-failed",
            icon: "bi-x-circle-fill",
        },

        REFUNDED: {
            label: "Refunded",
            className: "transaction-status-refunded",
            icon: "bi-arrow-counterclockwise",
        },
    };

    const current = config[status] || {
        label: status,
        className: "transaction-status-pending",
        icon: "bi-question-circle",
    };

    return (
        <span className={`transaction-status ${current.className}`}>
            <i className={`bi ${current.icon}`}></i>
            {current.label}
        </span>
    );
}

export default TransactionStatusBadge;