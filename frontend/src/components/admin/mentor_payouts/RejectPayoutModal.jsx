import { formatCurrency } from "../../../utils/payoutUtils";

function RejectPayoutModal({
    payout,
    reason,
    onReasonChange,
    onSubmit,
    onClose,
    submitting,
}){
    if (!payout) return null
    return (
        <div
      className="payout-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-payout-title"
      >
        <div className="modal-content border-0 shadow">
          <form onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="reject-payout-title">
                Reject payout request
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <p>
                Reject <strong>{payout.payout_id || `PAYOUT-${payout.id}`}</strong>{" "}
                for <strong>{formatCurrency(payout.amount)}</strong>?
              </p>

              <p className="small text-secondary">
                The requested amount will be returned to the mentor's
                available balance.
              </p>

              <label htmlFor="rejectReason" className="form-label">
                Reason for rejection
              </label>

              <textarea
                id="rejectReason"
                className="form-control"
                rows={4}
                maxLength={2000}
                required
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Explain why this payout request is being rejected..."
              />

              <div className="form-text">
                Please provide a clear reason for the mentor.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-danger"
                disabled={submitting || !reason.trim()}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm rejection"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    )
}

export default RejectPayoutModal