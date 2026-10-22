function BadgeCard({badge}){
    return (
        <div
            className={
                `
                badge-card
                ${badge.earned
                    ? "badge-earned"
                    : "badge-locked"
                }
                `
            }
        >

            <div className="badge-card-top">

                <div className="badge-icon">

                    <span className="material-symbols-outlined">
                        {badge.icon}
                    </span>

                </div>


                <span
                    className={`
                        badge-rarity
                        ${badge.rarity?.toLowerCase()}
                    `}
                >

                    {badge.rarity}

                </span>

            </div>


            <h4>

                {badge.name}

            </h4>


            <p className="badge-description">

                {badge.description}

            </p>


            <div className="badge-card-footer">

                <span>

                    ⚡ {badge.xp_reward} XP

                </span>


                {badge.earned ? (

                    <span className="earned-status">

                        ✓ Earned

                    </span>

                ) : (

                    <span className="locked-status">

                        🔒 Locked

                    </span>

                )}

            </div>


            {badge.earned_at && (

                <small className="badge-date">

                    Earned on{" "}

                    {new Date(
                        badge.earned_at
                    ).toLocaleDateString()}

                </small>

            )}

        </div>
    )
}

export default BadgeCard