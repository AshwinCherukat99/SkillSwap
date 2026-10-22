import PayoutTableRow from "./PayoutTableRow";

function PayoutTable({
    payouts,
    loading,
    actionLoading,
    onView,
    onApprove,
    onReject
}){
    return (
        <section className="card payout-card border-0">
      <div className="card-header bg-white border-0 pt-4 px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="fw-bold mb-1">Payout Requests</h5>
            <p className="text-secondary small mb-0">
              Review and manage mentor payout requests.
            </p>
          </div>

          <span className="badge text-bg-light border">
            {payouts.length} requests on this page
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle payout-table mb-0">
          <thead>
            <tr>
              <th>Mentor</th>
              <th>Payout ID</th>
              <th className="text-end">Requested</th>
              <th className="text-end">Available balance</th>
              <th>Requested on</th>
              <th>Method</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <span className="spinner-border spinner-border-sm text-primary me-2" />
                  Loading payout requests...
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-secondary">
                  <i className="bi bi-inbox fs-2 d-block mb-2" />
                  No payout requests found.
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <PayoutTableRow
                  key={payout.id}
                  payout={payout}
                  actionLoading={actionLoading}
                  onView={onView}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
    )
}

export default PayoutTable