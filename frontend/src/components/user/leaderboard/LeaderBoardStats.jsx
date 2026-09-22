function LeaderBoardStats({myRank}){
    const progress=Math.min(
        (myRank.xp%500)/500*100,
        100
    )
    const nextLevelXP=(myRank.level*500)
    return (
        <div className="row g-4 mb-5">

            <div className="col-md-6">

                <div className="card border-0 shadow-sm h-100">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between">

                            <div>

                                <p className="text-muted mb-1">
                                    Your Rank
                                </p>

                                <h2 className="fw-bold mb-1">
                                    #{myRank.rank}
                                </h2>

                                <p className="mb-0">
                                    Level {myRank.level}
                                    {" • "}
                                    {myRank.xp.toLocaleString()} XP
                                </p>

                            </div>

                            <div className="text-end">

                                <div className="fs-3">
                                    🔥
                                </div>

                                <strong>
                                    {myRank.current_streak}-Day Streak
                                </strong>

                            </div>

                        </div>


                        <div className="progress mt-4">

                            <div
                                className="progress-bar"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                        <small className="text-muted">
                            {nextLevelXP.toLocaleString()} XP
                            needed for the next level
                        </small>

                    </div>

                </div>

            </div>


            <div className="col-md-3">

                <div className="card border-0 shadow-sm text-center h-100">

                    <div className="card-body">

                        <p className="text-muted">
                            Rating
                        </p>

                        <h2 className="fw-bold">
                            {myRank.rating || "—"}
                        </h2>

                        <small className="text-muted">
                            {myRank.rating_count} reviews
                        </small>

                    </div>

                </div>

            </div>


            <div className="col-md-3">

                <div className="card border-0 shadow-sm text-center h-100">

                    <div className="card-body">

                        <p className="text-muted">
                            Streak
                        </p>

                        <h2 className="fw-bold">
                            {myRank.current_streak}
                        </h2>

                        <small className="text-muted">
                            consecutive days
                        </small>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default LeaderBoardStats