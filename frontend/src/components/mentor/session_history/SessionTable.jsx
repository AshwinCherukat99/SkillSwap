import React from "react";

import SessionRow from './SessionRow'

const SessionTable=({sessions,onViewDetails})=>{
    return (
        <div className="session-table-card">

            <div className="table-responsive">

                <table className="table session-table align-middle mb-0">

                    <thead>

                        <tr>
                            <th>Student</th>
                            <th>Course &amp; Topic</th>
                            <th>Date &amp; Slot</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {sessions.map(session => (

                            <SessionRow
                                key={session.id}
                                session={session}
                                onViewDetails={
                                    onViewDetails
                                }
                            />

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default SessionTable