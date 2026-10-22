import React from "react";

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function TransactionStats({ stats }) {

    const cards = [
        {
            title: "Total Transactions",
            value: Number(stats?.total_transactions || 0).toLocaleString("en-IN"),
            icon: "bi-receipt",
            className: "transaction-stat-primary",
        },
        {
            title: "Total Value",
            value: formatCurrency(stats?.total_value),
            icon: "bi-wallet2",
            className: "transaction-stat-primary",
        },
        {
            title: "Successful",
            value: Number(stats?.successful || 0).toLocaleString("en-IN"),
            icon: "bi-check-circle",
            className: "transaction-stat-success",
            subtitle: `${stats?.success_rate || 0}% success rate`,
        },
        {
            title: "Failed",
            value: Number(stats?.failed || 0).toLocaleString("en-IN"),
            icon: "bi-exclamation-circle",
            className: "transaction-stat-danger",
            subtitle: "Requires attention",
        },
    ];

    return (
        <div className="row g-4 mb-4">

            {cards.map((card) => (
                <div
                    className="col-12 col-md-6 col-xl-3"
                    key={card.title}
                >
                    <div className="transaction-stat-card">

                        <div className="transaction-stat-icon">
                            <i className={`bi ${card.icon}`}></i>
                        </div>

                        <div className="transaction-stat-content">

                            <div className="transaction-stat-title">
                                {card.title}
                            </div>

                            <div className="transaction-stat-value">
                                {card.value}
                            </div>

                            {card.subtitle && (
                                <div
                                    className={`transaction-stat-subtitle ${card.className}`}
                                >
                                    {card.subtitle}
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}

export default TransactionStats;