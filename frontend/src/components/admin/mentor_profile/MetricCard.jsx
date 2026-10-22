import React from "react";

const MetricCard=({label,value,icon,color='primary',note})=>(
    <div className="col-12 col-md-6 col-xl-4">
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4 d-flex justify-content-between align-items-center">
        <div>
          <p className="text-secondary small text-uppercase fw-semibold mb-2">
            {label}
          </p>
          <h3 className="h4 fw-bold mb-1">{value}</h3>
          {note && <span className="small text-secondary">{note}</span>}
        </div>
        <div className={`metric-icon text-${color} bg-${color}-subtle`}>
          <i className={`bi ${icon}`} />
        </div>
      </div>
    </div>
  </div>
)

const MentorMetrics=({mentor})=>(
    <div className="row g-3 mb-4">
    <MetricCard
      label="Average rating"
      value={`${Number(mentor.rating || 0).toFixed(2)} / 5`}
      icon="bi-star-fill"
      color="warning"
    />

    <MetricCard
      label="Total reviews"
      value={mentor.total_reviews ?? 0}
      icon="bi-chat-square-text-fill"
      color="success"
    />

    <MetricCard
      label="Experience"
      value={
        mentor.experience_years != null &&
        mentor.experience_years !== ''
          ? `${mentor.experience_years} years`
          : 'Not provided'
      }
      icon="bi-briefcase-fill"
      color="primary"
    />
  </div>
)

export default MentorMetrics