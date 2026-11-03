import StatusBadge from './StatusBadge'       

import { BACKEND_ORIGIN } from '../../../config'

const formatSessionTime=(timestamp)=>{
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('en-IN',{
        day:'2-digit',
        month:'short',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
        timeZone:'Asia/Kolkata',
    })
}

function RecentSessions({sessions=[],onViewAll,}){
    return (
        <div className="admin-panel sessions-panel">

            <div className="admin-panel-header">

                <h3>
                    Recent Sessions
                </h3>

                <button
                    type="button"
                    onClick={onViewAll}
                >
                    View All
                </button>

            </div>

            <div className="sessions-table-wrapper">

                <table className="sessions-table">

                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>Participants</th>
                            <th>Category</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {sessions.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="4"
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                    }}
                                >
                                    No recent sessions
                                </td>
                            </tr>

                        ) : (

                            sessions.map((session) => (

                                <tr key={session.id}>

                                    <td>

                                        <div className="session-info">

                                            <strong>
                                                {session.title}
                                            </strong>

                                            <span>
                                                {formatSessionTime(session.time)}
                                            </span>

                                        </div>

                                    </td>

                                    <td>

                                        <div className="participant-stack">

                                            {(session.participants || [])
                                                .map((participant) => (

                                                    <img
                                                        key={participant.id}
                                                        src={
                                                            participant.profile_image
                                                            ?`${BACKEND_ORIGIN}${participant.profile_image}` 
                                                            :"/default-avatar.png"
                                                        }
                                                        alt={
                                                            participant.username ||
                                                            "Participant"
                                                        }
                                                    />

                                                ))}

                                            {session.extra > 0 && (
                                                <span className="participant-extra">
                                                    +{session.extra}
                                                </span>
                                            )}

                                        </div>

                                    </td>

                                    <td>

                                        <span className="category-badge">
                                            {session.category}
                                        </span>

                                    </td>

                                    <td>

                                        <StatusBadge
                                            type={session.statusType}
                                            label={session.status}
                                        />

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default RecentSessions