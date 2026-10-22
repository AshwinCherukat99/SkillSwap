import React from "react";

const UserProfileOverview=({user})=>{
    const imageUrl=user.profile_image||''
    const statusClass={
        ACTIVE: "bg-success-subtle text-success",
    BLOCKED: "bg-danger-subtle text-danger",
    SUSPENDED: "bg-warning-subtle text-warning-emphasis",
    }
    return (
        <section className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${user.username}'s profile`}
                className="rounded-circle border object-fit-cover flex-shrink-0"
                style={{ width: 112, height: 112 }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex
                  align-items-center justify-content-center fs-1 fw-bold flex-shrink-0"
                style={{ width: 112, height: 112 }}
              >
                {(user.full_name || user.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h2 className="h3 fw-bold mb-0">
                  {user.full_name || user.username}
                </h2>

                <span className="text-secondary">
                  @{user.username}
                </span>

              </div>

              <p className="text-secondary mb-3">
                {user.bio || "This user has not added a bio."}
              </p>

              <div className="d-flex flex-column gap-2 small">
                <span>
                  <i className="bi bi-envelope me-2 text-primary" />
                  {user.email}
                </span>

                {user.phone_number && (
                  <span>
                    <i className="bi bi-telephone me-2 text-primary" />
                    {user.phone_number}
                  </span>
                )}

                {user.location && (
                  <span>
                    <i className="bi bi-geo-alt me-2 text-primary" />
                    {user.location}
                  </span>
                )}

                <span>
                  <i className="bi bi-calendar3 me-2 text-primary" />
                  Joined{" "}
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleDateString()
                    : "date unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-lg-end gap-3">
            <span
              className={`badge rounded-pill px-3 py-2 ${
                statusClass[user.status] || "bg-secondary-subtle text-secondary"
              }`}
            >
              <i className="bi bi-circle-fill me-2 small" />
              {user.status || "UNKNOWN"}
            </span>

          </div>
        </div>
      </div>
    </section>
    )
}

export default UserProfileOverview