import {formatCurrency,formatDate,getStatusClass,getStatusLabel} from '../../../utils/payoutUtils'

function PayoutTableRow({
    payout,
    actionLoading,
    onView,
    onApprove,
    onReject
}){
    const isRequested=payout.status==='REQUESTED'       
    const isLoading=actionLoading===payout.id
    const mentorName=payout.mentor_name||`Mentor ${payout.mentor_id}`
    return (
        <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className="mentor-avatar">
            {mentorName.trim().charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="fw-semibold">{mentorName}</div>
            <div className="small text-secondary">
              ID: {payout.mentor_id}
            </div>
          </div>
        </div>
      </td>

      <td>
        <code>{payout.payout_id || `PAYOUT-${payout.id}`}</code>
      </td>

      <td className="text-end fw-semibold">
        {formatCurrency(payout.amount)}
      </td>

      <td className="text-end text-secondary">
        {formatCurrency(payout.available_balance)}
      </td>

      <td>{formatDate(payout.requested_at)}</td>

      <td>
        {payout.payout_method_configured ? (
          <span>
            <i className="bi bi-bank me-2 text-secondary" />
            Razorpay
          </span>
        ) : (
          <span className="small text-secondary">
            <i className="bi bi-exclamation-circle me-1" />
            Not configured
          </span>
        )}
      </td>

      <td>
        <span
          className={`payout-status ${getStatusClass(payout.status)}`}
        >
          {getStatusLabel(payout.status)}
        </span>
      </td>

      <td>
        <div className="d-flex justify-content-end gap-1">
          <button
            type="button"
            className="btn btn-sm btn-light border"
            title="View details"
            aria-label={`View payout ${payout.id}`}
            onClick={() => onView(payout)}
          >
            <i className="bi bi-eye" />
          </button>

          {isRequested && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-success"
                disabled={isLoading}
                onClick={() => onApprove(payout)}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Approve"
                )}
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                disabled={isLoading}
                onClick={() => onReject(payout)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
    )
}

export default PayoutTableRow