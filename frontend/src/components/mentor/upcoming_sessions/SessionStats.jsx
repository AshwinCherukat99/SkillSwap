import React from 'react'

const SessionStats=({stats})=>{
    return (
        <div className="row g-3 mb-4">

            <div className="col-12 col-sm-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="small text-muted text-uppercase fw-semibold">
                            Total Sessions
                        </div>

                        <div className="fs-2 fw-bold mt-1">
                            {stats?.total_sessions ?? 0}
                        </div>

                        <div className="small text-muted">
                            All time scheduled
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="small text-muted text-uppercase fw-semibold">
                            Completed Sessions
                        </div>

                        <div className="fs-2 fw-bold text-success mt-1">
                            {stats?.completed_sessions ?? 0}
                        </div>

                        <div className="small text-muted">
                            Successfully delivered
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body">

                        <div className="small text-muted text-uppercase fw-semibold">
                            Total Hours
                        </div>

                        <div className="fs-2 fw-bold mt-1">
                            {stats?.total_hours ?? 0}
                            <span className="fs-6 text-muted ms-1">
                                hrs
                            </span>
                        </div>

                        <div className="small text-muted">
                            Mentoring & exchange
                        </div>

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="card border-0 shadow-sm h-100 border-primary">

                    <div className="card-body">

                        <div className="d-flex align-items-center gap-2">

                            <div className="small text-muted text-uppercase fw-semibold">
                                This Week
                            </div>

                            <span className="badge bg-success-subtle text-success">
                                {stats?.today ?? 0} Today
                            </span>

                        </div>

                        <div className="fs-2 fw-bold mt-1">
                            {stats?.this_week ?? 0}
                            <span className="fs-6 text-muted ms-1">
                                Sessions
                            </span>
                        </div>

                        <div className="small text-primary">
                            Scheduled this week
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SessionStats