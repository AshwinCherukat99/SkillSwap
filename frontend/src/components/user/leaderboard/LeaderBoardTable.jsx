function LeaderBoardTable({users,currentUserId,navigate}){
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body p-0">

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th className="px-4 py-3">
                                    Rank
                                </th>

                                <th className="py-3">
                                    User
                                </th>

                                <th className="py-3">
                                    Level
                                </th>

                                <th className="py-3">
                                    XP
                                </th>

                                <th className="py-3">
                                    Rating
                                </th>

                                <th className="py-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map(user => {

                                const isCurrentUser =
                                    user.id === currentUserId

                                return (

                                    <tr
                                        key={user.id}
                                        className={
                                            isCurrentUser
                                                ? "table-primary"
                                                : ""
                                        }
                                    >

                                        <td className="px-4">

                                            <span className="fw-bold">
                                                #{user.rank}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="d-flex align-items-center gap-3">

                                                <img
                                                    src={
                                                        user.profile_image
            ? user.profile_image.startsWith("http")
                ? user.profile_image
                : `http://127.0.0.1:8000${user.profile_image}`
            : "/default-avatar.png"
                                                    }
                                                    alt={
                                                        user.full_name ||
                                                        user.username
                                                    }
                                                    className="leaderboard-avatar"
                                                />

                                                <div>

                                                    <div className="fw-bold">

                                                        {
                                                            user.full_name ||
                                                            user.username
                                                        }

                                                    </div>

                                                    <small className="text-muted">
                                                        @{user.username}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            <span className="fw-semibold">
                                                Level {user.level}
                                            </span>
                                        </td>


                                        <td>
                                            <strong>
                                                {user.xp.toLocaleString()}
                                            </strong>
                                        </td>


                                        <td>

                                            <span className="text-warning fw-bold">
                                                ⭐ {user.rating || "—"}
                                            </span>

                                            {user.rating_count > 0 && (
                                                <small className="text-muted ms-1">
                                                    ({user.rating_count})
                                                </small>
                                            )}

                                        </td>


                                        <td className="text-center">

                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/users/${user.id}/profile`
                                                    )
                                                }
                                            >
                                                View Profile
                                            </button>

                                        </td>

                                    </tr>

                                )
                            })}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}

export default LeaderBoardTable