import PayoutStatCard from "./PayoutStatCard";

function PayoutStats({stats={}}){
    return (
        <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-xl-3">
        <PayoutStatCard
          title="Total Pending Payouts"
          value={stats.total_pending_amount}
          icon="bi-hourglass-split"
          tone="primary"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <PayoutStatCard
          title="Pending Requests"
          value={stats.pending_requests}
          icon="bi-receipt"
          tone="warning"
          isCurrency={false}
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <PayoutStatCard
          title="Approved This Month"
          value={stats.approved_this_month}
          icon="bi-check-circle"
          tone="success"
        />
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <PayoutStatCard
          title="Rejected This Month"
          value={stats.rejected_this_month}
          icon="bi-x-circle"
          tone="danger"
        />
      </div>
    </div>
    )
}

export default PayoutStats