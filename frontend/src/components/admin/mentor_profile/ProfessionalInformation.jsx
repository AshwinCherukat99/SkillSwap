import React from "react";

const InfoItem=({label,value})=>(
    <div className="mb-3">
    <div className="small text-secondary text-uppercase fw-semibold mb-1">
      {label}
    </div>
    <div className="fw-medium text-break">
      {value || 'Not provided'}
    </div>
  </div>
)

const ProfessionalInformation=({mentor})=>{
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-mortarboard-fill text-primary fs-4" />
          <h2 className="h5 fw-bold mb-0">Professional Information</h2>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="p-4 rounded-3 bg-light h-100">
              <InfoItem
                label="Qualification"
                value={mentor.qualification}
              />
              <InfoItem
                label="Current profession"
                value={mentor.current_profession}
              />
              <InfoItem
                label="Organization"
                value={mentor.organization}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="p-4 rounded-3 bg-light h-100">
              <InfoItem
                label="Years of experience"
                value={
                  mentor.experience_years != null &&
                  mentor.experience_years !== ''
                    ? `${mentor.experience_years} years`
                    : null
                }
              />

              <div className="mb-3">
                <div className="small text-secondary text-uppercase fw-semibold mb-2">
                  Teaching niche
                </div>
                <p className="mb-0 text-break">
                  {mentor.teaching_niche || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="p-4 rounded-3 bg-light">
              <div className="small text-secondary text-uppercase fw-semibold mb-2">
                Professional summary
              </div>
              <p className="mb-0 text-break profile-summary">
                {mentor.professional_summary || 'No professional summary provided.'}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row g-3 small text-secondary">
          <div className="col-12 col-md-6">
            <strong>Account created:</strong>{' '}
            {mentor.created_at
              ? new Date(mentor.created_at).toLocaleString()
              : 'Unknown'}
          </div>

          <div className="col-12 col-md-6">
            <strong>Last account update:</strong>{' '}
            {mentor.updated_at
              ? new Date(mentor.updated_at).toLocaleString()
              : 'Unknown'}
          </div>
        </div>
      </div>
    </section>
    )
}

export default ProfessionalInformation