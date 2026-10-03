import React from "react";

const BadgePreview=({
    name,
    description,
    icon,
    rarity,
})=>{
    return (
        <div className="card border bg-light">

            <div className="card-body text-center p-4">

                <div className="badge-preview-icon mx-auto mb-3">

                    <i className="material-symbols-outlined">
                        {icon || "workspace_premium"}
                    </i>

                </div>

                <h5 className="fw-bold">
                    {name || "Badge Name"}
                </h5>

                <span className="badge bg-secondary mt-2">

                    {rarity || "Rarity"}

                </span>

                <p className="text-muted small mt-3 mb-0">

                    {description ||
                        "Your badge description will appear here"}

                </p>

            </div>

        </div>
    )
}

export default BadgePreview