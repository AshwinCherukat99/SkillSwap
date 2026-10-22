import React,{useState} from "react";

const ProfileOverview=({
    user,
    onAddFriend,
    onMessage,
    onReport,
    friendshipStatus='NONE',
})=>{
    const [menuOpen,setMenuOpen]=useState(false)
    const displayName=user.full_name||user.username
    const image=user.profile_image
    const friendLabel={
        NONE:'Add Friend',
        PENDING_SENT:'Request Sent',
        PENDING_RECEIVED:'Respond to Request',
        ACCEPTED:'Friends',
    }[friendshipStatus]||'Add Friend'
    return (
        <section className="card border-0 shadow-sm rounded-4 ss-profile-card overflow-hidden">
      <div className="ss-profile-glow" />

      <div className="card-body p-4 p-lg-5 position-relative">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-4">
          <div className="d-flex flex-column flex-sm-row gap-4 flex-grow-1">
            {image ? (
              <img
                src={image}
                alt={displayName}
                className="ss-profile-avatar flex-shrink-0"
              />
            ) : (
              <div className="ss-profile-avatar ss-avatar-placeholder flex-shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-grow-1 min-w-0">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="h2 fw-bold mb-0">{displayName}</h1>
                <span className="badge text-bg-primary-subtle text-primary">
                  User
                </span>
              </div>

              <p className="text-secondary mb-3">@{user.username}</p>

              <p className="ss-bio mb-4">
                {user.bio || "This user hasn't added a biography yet."}
              </p>

              <div className="row g-3 small text-secondary">
                {user.location && (
                  <div className="col-12 col-md-6">
                    <i className="bi bi-geo-alt text-primary me-2" />
                    {user.location}
                  </div>
                )}

                <div className="col-12 col-md-6">
                  <i className="bi bi-calendar3 text-primary me-2" />
                  Joined{" "}
                  {user.date_joined
                    ? new Date(user.date_joined).toLocaleDateString()
                    : "date unavailable"}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column gap-3 align-items-stretch align-items-xl-end">
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn ${
                  friendshipStatus === "ACCEPTED"
                    ? "btn-success"
                    : "btn-primary"
                }`}
                onClick={() => onAddFriend?.(user)}
                disabled={friendshipStatus === "PENDING_SENT"}
              >
                <i className="bi bi-person-plus me-2" />
                {friendLabel}
              </button>

              <button
                type="button"
                className="btn btn-light border"
                onClick={() => onMessage?.(user)}
              >
                <i className="bi bi-chat-dots me-2" />
                Message
              </button>

              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-light border"
                  aria-label="More profile options"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <i className="bi bi-three-dots-vertical" />
                </button>

                {menuOpen && (
                  <div className="dropdown-menu dropdown-menu-end show ss-profile-menu">
                    <button
                      className="dropdown-item"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          window.location.href
                        );
                        setMenuOpen(false);
                      }}
                    >
                      <i className="bi bi-share me-2" />
                      Copy profile link
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onReport?.(user);
                      }}
                    >
                      <i className="bi bi-flag me-2" />
                      Report user
                    </button>

                  </div>
                )}
              </div>
            </div>

            <span className="small text-secondary">
              <i className="bi bi-people me-2 text-success" />
              Connect and learn together
            </span>
          </div>
        </div>
      </div>
    </section>
    )
}  

export default ProfileOverview