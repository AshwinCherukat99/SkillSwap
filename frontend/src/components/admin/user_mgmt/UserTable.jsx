import React from "react";

import UserActionMenu from "./UserActionMenu";

const UserTable=({
    users,
    loading,
    onView,
    onEdit,
    onBlock,
    onSuspend,
    onActivate,
})=>{
    const getStatusBadge=(status)=>{
        const config={
            ACTIVE:{
                label:'Active',
                className:'bg-success-subtle text-success',
            },
            BLOCKED:{
                label:'Blocked',
                className:'bg-danger-subtle text-danger',
            },
            SUSPENDED:{
                label:'Suspended',
                className:'bg-warning-subtle text-warning',
            },
        }
        const item=config[status]||config.ACTIVE
        return (
            <span
                className={`badge rounded-pill px-3 py-2 ${item.className}`}
            >

                <span className="me-1">
                    ●
                </span>

                {item.label}

            </span>
    )
    }
    const getInitials=(user)=>{
        const name=user.username||user.full_name||'U'
        return name.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase()
    }
    if (loading){
        return (
             <div className="card border-0 shadow-sm">

                <div className="card-body py-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3 mb-0">
                        Loading users...
                    </p>

                </div>

            </div>
        )
    }
    if (!users.length){
        return (
            <div className="card border-0 shadow-sm">

                <div className="card-body text-center py-5">

                    <i className="bi bi-people fs-1 text-muted"></i>

                    <h5 className="mt-3">
                        No users found
                    </h5>

                    <p className="text-muted mb-0">
                        Try changing your search or filters.
                    </p>

                </div>

            </div>
        )
    }
    return (
        <div className="card border-0 shadow-sm">

            <div className="table-responsive">

                <table className="table align-middle mb-0">

                    <thead>

                        <tr>

                            <th className="px-4 py-3">
                                Profile
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Username
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Joined On
                            </th>

                            <th className="text-end px-4">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.map((user) => (

                            <tr key={user.id}>

                                <td className="px-4">

                                    {user.profile_image ? (

                                        <img
                                            src={
                                                user.profile_image
                                            }
                                            alt={
                                                user.full_name ||
                                                user.username
                                            }
                                            className="rounded-circle"
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                objectFit: 'cover',
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                            }}
                                        >
                                            {getInitials(user)}
                                        </div>

                                    )}

                                </td>


                                <td className="fw-semibold">

                                    {user.full_name ||
                                        '—'}

                                </td>


                                <td className="text-muted">

                                    @{user.username}

                                </td>


                                <td className="text-muted">

                                    {user.email}

                                </td>


                                <td>

                                    {getStatusBadge(
                                        user.status
                                    )}

                                </td>


                                <td className="text-muted">

                                    {new Date(
                                        user.date_joined
                                    ).toLocaleDateString(
                                        'en-IN',
                                        {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        }
                                    )}

                                </td>


                                <td className="text-end px-4">

                                    <UserActionMenu
                                        user={user}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onBlock={onBlock}
                                        onSuspend={onSuspend}
                                        onActivate={onActivate}
                                    />

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default UserTable