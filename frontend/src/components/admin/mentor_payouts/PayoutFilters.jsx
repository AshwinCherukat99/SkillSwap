function PayoutFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    amount,
    onAmountChange,
    date,
    onDateChange,
    onReset
}){
    return (
        <section className="card payout-card border-0 mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-xl-4">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Search mentor or payout ID..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search mentor payouts"
              />
            </div>
          </div>

          <div className="col-12 col-sm-4 col-xl-2">
            <select
              className="form-select"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">Status: All</option>
              <option value="REQUESTED">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="col-12 col-sm-4 col-xl-2">
            <select
              className="form-select"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              aria-label="Filter by amount"
            >
              <option value="">Amount: All</option>
              <option value="under_10000">Under ₹10,000</option>
              <option value="10000_50000">₹10,000–₹50,000</option>
              <option value="over_50000">Over ₹50,000</option>
            </select>
          </div>

          <div className="col-12 col-sm-4 col-xl-2">
            <select
              className="form-select"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              aria-label="Filter by request date"
            >
              <option value="">Date: Any</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="col-12 col-xl-2">
            <button
              type="button"
              className="btn btn-light border w-100"
              onClick={onReset}
            >
              <i className="bi bi-arrow-counterclockwise me-2" />
              Reset filters
            </button>
          </div>
        </div>
      </div>
    </section>
    )
}

export default PayoutFilters