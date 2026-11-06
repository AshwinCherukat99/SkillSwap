import {useMemo,useState} from 'react'

const BadgeAwardedUsers=({users=[],total=0})=>{
    const [search,setSearch]=useState('')
    const filteredUsers=useMemo(()=>{
        const query=search.trim().toLowerCase()
        if (!query) return users
        return users.filter(user=>
        (user.full_name||'').toLowerCase().includes(query)||
        (user.username||'').toLowerCase().includes(query)
        )
    },[users,search])
    const formatDate=(date)=>{
        if (!date) return '-'
        return new Date(date).toLocaleDateString('en-IN',{
            day:'2-digit',
            month:'short',
            year:'numeric',
        })
    }
    const getInitials=(user)=>{
        const name=user.full_name||user.username||'U'
        return name
        .split(' ')
        .filter(Boolean)
        .slice(0,2)
        .map(part=>part[0].toUpperCase())
        .join('')
    }
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-4">

                    <div>
                        <h5 className="fw-bold mb-1">
                            Awarded Users
                        </h5>

                        <p className="text-muted small mb-0">
                            {total} users have earned this badge
                        </p>
                    </div>

                    <div className="badge-user-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                <div className="table-responsive">
                    <table className="table align-middle badge-users-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Username</th>
                                <th>Date Awarded</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">
                                        No awarded users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">

                                                <div className="badge-user-avatar">
                                                    {getInitials(user)}
                                                </div>

                                                <span className="fw-semibold">
                                                    {user.full_name || user.username}
                                                </span>

                                            </div>
                                        </td>

                                        <td className="text-muted">
                                            @{user.username}
                                        </td>

                                        <td className="text-muted">
                                            {formatDate(user.earned_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                <div className="text-muted small mt-3">
                    Showing {filteredUsers.length} of {total} awarded users
                </div>

            </div>
        </div>
    )
}

export default BadgeAwardedUsers