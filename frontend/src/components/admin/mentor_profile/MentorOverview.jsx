import React from "react"; 

const MentorOverview=({mentor})=>{
    const profile=mentor.profile||{}
    const statusClass={
        ACTIVE:'success',
        SUSPENDED:'warning',
        BLOCKED:'danger',
    }
    const statusColor=statusClass[mentor.status]||'secondary'
    const displayName=mentor.full_name||mentor.username||'unnamed mentor'
    const imageUrl=mentor.profile_image
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                className="mentor-avatar"
              />
            ) : (
              <div className="mentor-avatar mentor-avatar-placeholder">
                <i className="bi bi-person-fill" />
              </div>
            )}

            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h2 className="h4 fw-bold mb-0">{displayName}</h2>

                <span className="text-secondary">
                  @{mentor.username}
                </span>

                {mentor.is_verified && (
                  <span className="badge text-bg-primary">
                    <i className="bi bi-patch-check-fill me-1" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-secondary mb-3">
                {profile.current_profession || 'Profession not provided'}
              </p>

              <div className="d-flex flex-column gap-2 small text-secondary">
                <span>
                  <i className="bi bi-envelope me-2" />
                  {mentor.email}
                </span>

                <span>
                  <i className="bi bi-telephone me-2" />
                  {mentor.phone_number || 'Phone not provided'}
                </span>

                <span>
                  <i className="bi bi-calendar3 me-2" />
                  Mentor since{' '}
                  {mentor.created_at
                    ? new Date(mentor.created_at).toLocaleDateString()
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-start align-items-lg-end gap-3">
            <span className={`badge text-bg-${statusColor} px-3 py-2`}>
              {mentor.status}
            </span>

          </div>
        </div>
      </div>
    </section>
    )
}

export default MentorOverview