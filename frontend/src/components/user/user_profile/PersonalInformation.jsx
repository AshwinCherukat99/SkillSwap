import React from "react";

const InformationItem=({icon,label,value})=>{
    <div className="col-12 col-sm-6">
    <div className="ss-info-tile h-100">
      <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
        <i className={`bi ${icon} text-primary`} />
        <span className="text-uppercase fw-semibold">{label}</span>
      </div>

      <div className="fw-semibold text-break">
        {value || "Not provided"}
      </div>
    </div>
  </div>
}

const PersonalInformation=({user})=>{ 
    return (
        <section className="card border-0 shadow-sm rounded-4">
    <div className="card-body p-4 p-lg-5">
      <span className="small text-secondary text-uppercase fw-semibold">
        Public profile
      </span>
      <h2 className="h4 fw-bold mt-1 mb-2">About & Information</h2>
      <p className="text-secondary small mb-4">
        Information this member shares on their public profile.
      </p>

      <div className="row g-3">
        <InformationItem
          icon="bi-person-badge"
          label="Full name"
          value={user.full_name}
        />

        <InformationItem
          icon="bi-at"
          label="Username"
          value={`@${user.username}`}
        />

        <InformationItem
          icon="bi-geo-alt"
          label="Location"
          value={user.location}
        />

        <InformationItem
          icon="bi-calendar-check"
          label="Member since"
          value={
            user.date_joined
              ? new Date(user.date_joined).toLocaleDateString()
              : null
          }
        />
      </div>

      <div className="ss-info-tile mt-3">
        <div className="small text-secondary text-uppercase fw-semibold mb-2">
          <i className="bi bi-quote me-2 text-primary" />
          Biography
        </div>
        <p className="mb-0 text-break ss-bio">
          {user.bio || "No biography has been added yet."}
        </p>
      </div>
    </div>
  </section>
    )
}

export default PersonalInformation