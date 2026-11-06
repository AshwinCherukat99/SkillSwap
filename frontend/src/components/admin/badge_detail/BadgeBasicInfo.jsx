const BadgeBasicInfo=({badge})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

                <h5 className="fw-bold border-bottom pb-3 mb-4">
                    Basic Information
                </h5>

                <div className="mb-4">
                    <label className="text-muted small fw-semibold text-uppercase">
                        Badge Name
                    </label>
                    <p className="mb-0 mt-2 fw-semibold">
                        {badge.name}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="text-muted small fw-semibold text-uppercase">
                        Slug
                    </label>
                    <p className="mb-0 mt-2">
                        <code>{badge.slug}</code>
                    </p>
                </div>

                <div className="mb-0">
                    <label className="text-muted small fw-semibold text-uppercase">
                        Description
                    </label>
                    <p className="mb-0 mt-2 text-muted">
                        {badge.description}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default BadgeBasicInfo