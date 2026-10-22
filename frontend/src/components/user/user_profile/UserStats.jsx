import React from "react";

const UserStats=({user})=>{
    const xp=Number(user.xp||0)
    const streak=Number(user.current_streak||0)
    const milestone=3000 
    const progress=Math.min((xp/milestone)*100,100)
    const remaining=Math.max(milestone-xp,0) 
    return (
        <div className="row g-4">
      <div className="col-12 col-md-6">
        <section className="card border-0 shadow-sm rounded-4 h-100 hover-lift">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="ss-stat-icon ss-stat-xp">
                <i className="bi bi-lightning-charge-fill fs-4" />
              </div>

              <div>
                <div className="small text-secondary text-uppercase fw-semibold">
                  Total experience
                </div>
                <div className="fs-2 fw-bold">
                  {xp.toLocaleString()} XP
                </div>
              </div>
            </div>

            <p className="text-secondary small">
              Experience points earned through learning and platform activity.
            </p>

            <div className="d-flex justify-content-between small mb-2">
              <span className="fw-semibold">XP milestone</span>
              <span className="text-secondary">
                {Math.round(progress)}%
              </span>
            </div>

            <div
              className="progress ss-progress"
              role="progressbar"
              aria-label="Progress toward XP milestone"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="d-flex justify-content-between small text-secondary mt-2">
              <span>{xp.toLocaleString()} XP</span>
              <span>
                {remaining.toLocaleString()} XP to {milestone.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="col-12 col-md-6">
        <section className="card border-0 shadow-sm rounded-4 h-100 hover-lift">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="ss-stat-icon ss-stat-streak">
                <i className="bi bi-fire fs-4" />
              </div>

              <div>
                <div className="small text-secondary text-uppercase fw-semibold">
                  Current streak
                </div>
                <div className="fs-2 fw-bold">
                  {streak} {streak === 1 ? "day" : "days"}
                </div>
              </div>
            </div>

            <p className="text-secondary small mb-4">
              Consecutive days recorded in this user's current streak.
            </p>

            <div className="rounded-3 bg-light p-3">
              <div className="small text-secondary mb-1">
                Last session date
              </div>
              <div className="fw-semibold">
                {user.last_session_date
                  ? new Date(
                      `${user.last_session_date}T00:00:00`
                    ).toLocaleDateString()
                  : "No date recorded"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    )
} 

export default UserStats