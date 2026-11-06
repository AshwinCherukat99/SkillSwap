const BadgePreview=({badge})=>{
    const rarityColors={
        COMMON:'secondary',
        RARE:'primary',
        EPIC:'info',
        LEGENDARY:'warning',
    }
    return (
        <div className="card border-0 shadow-sm badge-preview-card mb-4">
            <div className="card-body text-center py-5">

                <div className="badge-preview-icon mb-4">
                    <span className="material-symbols-outlined">
                        {badge.icon || 'workspace_premium'}
                    </span>
                </div>

                <h2 className="fw-bold mb-3">
                    {badge.name}
                </h2>

                <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                    <span className={`badge text-bg-${rarityColors[badge.rarity] || 'secondary'} px-3 py-2`}>
                        {badge.rarity}
                    </span>

                    <span className={`badge ${badge.is_active ? 'text-bg-success' : 'text-bg-secondary'} px-3 py-2`}>
                        {badge.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <p className="text-muted mb-0">
                    <strong>{badge.awarded_users_count ?? 0}</strong> users have earned this badge
                </p>

            </div>
        </div>
    )
}

export default BadgePreview