import React from "react";         

const UserEngagementStats=({user})=>{
    const stats=[
        {
      title: "Total XP",
      value: Number(user.xp || 0).toLocaleString(),
      suffix: "XP",
      icon: "bi-lightning-charge-fill",
      color: "primary",
      description: "Experience points earned on the platform.",
    },
    {
      title: "Current Streak",
      value: Number(user.current_streak || 0),
      suffix: Number(user.current_streak || 0) === 1 ? "day" : "days",
      icon: "bi-fire",
      color: "success",
      description: "Current consecutive-day streak recorded in the account.",
    },
    ]
    return (
        <div className="row g-4">
      {stats.map((stat) => (
        <div className="col-12 col-md-6" key={stat.title}>
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className={`rounded-3 bg-${stat.color}-subtle text-${stat.color}
                    d-flex align-items-center justify-content-center`}
                  style={{ width: 52, height: 52 }}
                >
                  <i className={`bi ${stat.icon} fs-3`} />
                </div>

                <div>
                  <div className="small text-secondary text-uppercase fw-semibold">
                    {stat.title}
                  </div>
                  <div className="fs-2 fw-bold">
                    {stat.value}{" "}
                    <span className="fs-6 fw-normal text-secondary">
                      {stat.suffix}
                    </span>
                  </div>
                </div>
              </div>

              <p className="small text-secondary mb-0">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="small text-secondary text-uppercase fw-semibold mb-2">
              Last session date
            </div>
            <div className="fw-semibold">
              {user.last_session_date
                ? new Date(
                    `${user.last_session_date}T00:00:00`
                  ).toLocaleDateString()
                : "No session date recorded"}
            </div>
          </div>
        </div>
      </div>
    </div>
    )
} 

export default UserEngagementStats