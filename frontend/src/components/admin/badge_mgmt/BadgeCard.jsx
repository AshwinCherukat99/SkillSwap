import React from "react";

const rarityClass={
    COMMON:'badge-rarity-common',
    RARE:'badge-rarity-rare',
    EPIC:'badge-rarity-epic',
    LEGENDARY:'badge-rarity-legendary',
}
const BadgeCard=({badge,onView,onEdit})=>{
    return (
        <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                    <div className="badge-icon-wrapper">

                        <i
                            className="material-symbols-outlined"
                        >
                            {badge.icon || "workspace_premium"}
                        </i>

                    </div>

                    <span
                        className={`badge ${
                            rarityClass[badge.rarity]
                        }`}
                    >
                        {badge.rarity_display}
                    </span>

                </div>

                <h5 className="fw-bold mt-4">
                    {badge.name}
                </h5>

                <p className="text-muted small">
                    {badge.description}
                </p>

                <div className="d-flex justify-content-between small mb-3">

                    <span className="text-muted">
                        XP Reward
                    </span>

                    <strong>
                        {badge.xp_reward} XP
                    </strong>

                </div>

                <div className="d-flex justify-content-between small mb-4">

                    <span className="text-muted">
                        Awarded
                    </span>

                    <strong>
                        {badge.awarded_count}
                    </strong>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={() => onView(badge)}
                    >
                        View
                    </button>

                    <button
                        className="btn btn-primary flex-grow-1"
                        onClick={() => onEdit(badge)}
                    >
                        Edit
                    </button>

                </div>

            </div>

        </div>
    )
}

export default BadgeCard