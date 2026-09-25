import React from "react";   

const FriendRequestCard=({
    request,
    onAccept,
    onReject,
    processing,
})=>{
    const user=request.sender
    const getInitial=()=>{
        if (user?.full_name){
            return user.full_name.charAt(0).toUpperCase()
        }
        if (user?.username){
            return user.username.charAt(0).toUpperCase()
        }
        return 'U'
    }
    return (
        <div className="card border-0 shadow-sm mb-3">

            <div className="card-body">

                <div className="d-flex align-items-center">

                    {/* Avatar */}
                    <div
                        className="rounded-circle bg-primary-subtle text-primary
                        d-flex align-items-center justify-content-center
                        flex-shrink-0"
                        style={{
                            width: '50px',
                            height: '50px',
                            fontWeight: '600',
                            fontSize: '18px'
                        }}
                    >
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt={user.username}
                                className="rounded-circle w-100 h-100"
                                style={{
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            getInitial()
                        )}
                    </div>

                    {/* User information */}
                    <div className="ms-3 flex-grow-1">

                        <h6 className="fw-bold mb-1">
                            {user?.full_name || user?.username}
                        </h6>

                        <p className="text-muted small mb-1">
                            @{user?.username}
                        </p>

                        {user?.bio && (
                            <p className="text-muted small mb-0">
                                {user.bio}
                            </p>
                        )}

                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2 ms-3">

                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={processing}
                            onClick={() => onAccept(request.id)}
                        >
                            {processing ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                />
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Accept
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={processing}
                            onClick={() => onReject(request.id)}
                        >
                            Reject
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default FriendRequestCard