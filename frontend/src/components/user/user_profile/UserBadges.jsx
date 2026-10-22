import React from "react";

const rarityStyles={
    COMMON:'ss-rarity-common',
    RARE:'ss-rarity-rare',
    EPIC:'ss-rarity-epic',
    LEGENDARY:'ss-rarity-legendary',
}

const UserBadges=({badges=[]})=>(
    <section className="card border-0 shadow-sm rounded-4">
    <div className="card-body p-4 p-lg-5">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="small text-secondary text-uppercase fw-semibold">
            Achievements
          </span>
          <h2 className="h4 fw-bold mb-0">Badges & Milestones</h2>
        </div>

        <span className="badge bg-primary-subtle text-primary">
          {badges.length} earned
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-award fs-1 text-secondary" />
          <p className="fw-semibold mt-2 mb-1">No badges yet</p>
          <p className="text-secondary small mb-0">
            Achievements will appear here when this user earns badges.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {badges.map((badge) => (
            <div
              className="col-12 col-sm-6"
              key={badge.slug}
            >
              <article className="ss-badge-tile h-100">
                <div className="d-flex align-items-start gap-3">
                  <div className="ss-badge-icon flex-shrink-0">
                    <span className="material-symbols-outlined">
                      {badge.icon || "workspace_premium"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-grow-1">
                    <h3 className="h6 fw-bold mb-1 text-break">
                      {badge.name}
                    </h3>

                    <span
                      className={`badge ${
                        rarityStyles[badge.rarity] || "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {badge.rarity}
                    </span>

                    <p className="small text-secondary mt-2 mb-2">
                      {badge.description}
                    </p>

                    <div className="small fw-semibold text-primary">
                      <i className="bi bi-lightning-charge me-1" />
                      {badge.xp_reward} XP reward
                    </div>

                    {badge.earned_at && (
                      <div className="small text-secondary mt-2">
                        Earned{" "}
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
)

export default UserBadges