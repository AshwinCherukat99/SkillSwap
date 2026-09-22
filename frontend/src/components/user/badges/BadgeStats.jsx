function BadgeStats({stats}){
    return (
        <div className="row g-4 badge-stats">

            <div className="col-md-4">

                <div className="badge-stat-card">

                    <div className="badge-stat-icon">

                        🏆

                    </div>

                    <div>

                        <p>Total Badges</p>

                        <h3>

                            {stats?.total_badges || 0}

                        </h3>

                    </div>

                </div>

            </div>


            <div className="col-md-4">

                <div className="badge-stat-card">

                    <div className="badge-stat-icon">

                        🥇

                    </div>

                    <div>

                        <p>Badges Earned</p>

                        <h3>

                            {stats?.earned_badges || 0}

                        </h3>

                    </div>

                </div>

            </div>


            <div className="col-md-4">

                <div className="badge-stat-card">

                    <div className="badge-stat-icon">

                        ⚡

                    </div>

                    <div>

                        <p>Total XP</p>

                        <h3>

                            {stats?.total_xp || 0}

                        </h3>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default BadgeStats