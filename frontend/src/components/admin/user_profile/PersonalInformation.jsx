import React from "react";           

const InfoItem=({icon,label,value})=>(
    <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light h-100">
    <div
      className="rounded-3 bg-white text-primary d-flex
        align-items-center justify-content-center flex-shrink-0"
      style={{ width: 44, height: 44 }}
    >
      <i className={`bi ${icon} fs-5`} />
    </div>

    <div className="min-w-0">
      <div className="small text-secondary text-uppercase fw-semibold mb-1">
        {label}
      </div>
      <div className="fw-semibold text-break">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "Not provided"}
      </div>
    </div>
  </div>
)

const PersonalInformation=({user})=>(
    <section className="card border-0 shadow-sm rounded-4">
    <div className="card-body p-4 p-lg-5">
      <h3 className="h4 fw-bold mb-1">Personal Information</h3>
      <p className="text-secondary mb-4">
        Contact details and account information supplied by the user.
      </p>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-person-badge"
            label="Full name"
            value={user.full_name}
          />
        </div>

        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-at"
            label="Username"
            value={`@${user.username}`}
          />
        </div>

        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-envelope"
            label="Email address"
            value={user.email}
          />
        </div>

        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-telephone"
            label="Phone number"
            value={user.phone_number}
          />
        </div>

        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-geo-alt"
            label="Location"
            value={user.location}
          />
        </div>

        <div className="col-12 col-md-6">
          <InfoItem
            icon="bi-calendar-check"
            label="Account created"
            value={
              user.date_joined
                ? new Date(user.date_joined).toLocaleString()
                : null
            }
          />
        </div>

        <div className="col-12">
          <div className="p-4 rounded-3 bg-light">
            <div className="small text-secondary text-uppercase fw-semibold mb-2">
              Bio
            </div>
            <p className="mb-0 text-break">
              {user.bio || "This user has not added a bio."}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default PersonalInformation