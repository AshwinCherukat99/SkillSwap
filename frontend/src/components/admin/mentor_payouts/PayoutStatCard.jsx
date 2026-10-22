import { formatCurrency } from "../../../utils/payoutUtils";

function PayoutStatCard({
    title,
    value,
    icon,
    tone='primary',
    isCurrency=true,
}){
    return (
        <div className="card payout-stat-card border-0 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`payout-stat-icon ${tone}`}>
            <i className={`bi ${icon}`} />
          </div>
        </div>

        <p className="small text-secondary mb-1">{title}</p>

        <h3 className="payout-stat-value fw-bold mb-0">
          {isCurrency ? formatCurrency(value) : value ?? 0}
        </h3>
      </div>
    </div>
    )
}

export default PayoutStatCard