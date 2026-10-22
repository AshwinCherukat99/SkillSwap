import { formatCurrency,formatDate,getStatusLabel } from "../../../utils/payoutUtils";

function DetailRow({label,value}){
    return (
        <div className="d-flex justify-content-between gap-3 py-2 border-bottom">
      <span className="text-secondary">{label}</span>
      <span className="text-end fw-semibold text-break">
        {value ?? "—"}
      </span>
    </div>
    )
}

function PayoutDetailsModal({payout,onClose}){
    if (!payout) return null
    return (
        <div className="payout-modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div
        className="modal-dialog modal-dialog-centered"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-details-title"
      >
        <div className="payout-modal modal-content border-0 shadow">
          <div className="payout-modal-header">
            <h5 className="modal-title fw-bold" id="payout-details-title">
              Payout details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="payout-modal-body">
            <DetailRow
              label="Payout ID"
              value={payout.payout_id || `PAYOUT-${payout.id}`}
            />
            <DetailRow label="Mentor" value={payout.mentor_name} />
            <DetailRow label="Mentor ID" value={payout.mentor_id} />
            <DetailRow label="Amount" value={formatCurrency(payout.amount)} />
            <DetailRow
              label="Available balance"
              value={formatCurrency(payout.available_balance)}
            />
            <DetailRow
              label="Pending balance"
              value={formatCurrency(payout.pending_balance)}
            />
            <DetailRow
              label="Requested on"
              value={formatDate(payout.requested_at)}
            />
            <DetailRow
              label="Approved on"
              value={formatDate(payout.approved_at)}
            />
            <DetailRow
              label="Completed on"
              value={formatDate(payout.completed_at)}
            />
            <DetailRow
              label="Payout profile verified"
              value={payout.payout_profile_verified ? "Yes" : "No"}
            />
            <DetailRow
              label="Payout method configured"
              value={payout.payout_method_configured ? "Yes" : "No"}
            />
            <DetailRow label="Status" value={getStatusLabel(payout.status)} />

            {payout.payment_reference && (
              <DetailRow
                label="Payment reference"
                value={payout.payment_reference}
              />
            )}

            {payout.failure_reason && (
              <DetailRow
                label="Rejection reason"
                value={payout.failure_reason}
              />
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    )
}

export default PayoutDetailsModal