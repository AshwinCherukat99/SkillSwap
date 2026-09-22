function LeaderBoardPodium({users}){
    if (!users.length){
        return null
    }
    const first=users[0]
    const second=users[1]
    const third=users[2]
    return (
        <section className="mb-5">

            <div className="row justify-content-center align-items-end g-4">

                {/* Second */}

                {second && (

                    <div className="col-md-3">

                        <div className="podium-card second">

                            <div className="rank-badge">
                                #2
                            </div>

                            <img
                                src={
                                    second.profile_image
            ? second.profile_image.startsWith("http")
                ? second.profile_image
                : `http://127.0.0.1:8000${second.profile_image}`
            : "/default-avatar.png"
                                }
                                alt={second.full_name}
                                className="podium-avatar"
                            />

                            <h5 className="fw-bold mt-3">
                                {second.full_name ||
                                    second.username}
                            </h5>

                            <div className="fw-bold">
                                {second.xp.toLocaleString()} XP
                            </div>

                        </div>

                    </div>

                )}


                {/* First */}

                {first && (

                    <div className="col-md-4">

                        <div className="podium-card first">

                            <div className="rank-badge">
                                🏆 #1
                            </div>

                            <img
                                src={
                                    first.profile_image
            ? first.profile_image.startsWith("http")
                ? first.profile_image
                : `http://127.0.0.1:8000${first.profile_image}`
            : "/default-avatar.png"
                                }
                                alt={first.full_name}
                                className="podium-avatar-large"
                            />

                            <h4 className="fw-bold mt-3">
                                {first.full_name ||
                                    first.username}
                            </h4>

                            <div className="fs-3 fw-bold text-primary">
                                {first.xp.toLocaleString()} XP
                            </div>

                            <div className="text-warning">
                                ⭐ {first.rating || "—"}
                            </div>

                        </div>

                    </div>

                )}


                {/* Third */}

                {third && (

                    <div className="col-md-3">

                        <div className="podium-card third">

                            <div className="rank-badge">
                                #3
                            </div>

                            <img
                                src={
                                    third.profile_image
            ? third.profile_image.startsWith("http")
                ? third.profile_image
                : `http://127.0.0.1:8000${third.profile_image}`
            : "/default-avatar.png"
                                }
                                alt={third.full_name}
                                className="podium-avatar"
                            />

                            <h5 className="fw-bold mt-3">
                                {third.full_name ||
                                    third.username}
                            </h5>

                            <div className="fw-bold">
                                {third.xp.toLocaleString()} XP
                            </div>

                        </div>

                    </div>

                )}

            </div>

        </section>
    )
}

export default LeaderBoardPodium