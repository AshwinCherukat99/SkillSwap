import React from 'react'

import {CalendarDays,CheckCircle2,Clock3} from 'lucide-react'

const SessionStats=({stats})=>{
    return (
        <div className="row g-4 mb-5">

            {/* Total Sessions */}

            <div className="col-12 col-sm-6 col-lg-4">

                <div className="session-stat-card">

                    <div className="session-stat-icon">

                        <CalendarDays
                            size={24}
                        />

                    </div>

                    <div className="session-stat-value">

                        {stats.total_sessions || 0}

                    </div>

                    <div className="session-stat-label">

                        Total Sessions

                    </div>

                </div>

            </div>


            {/* Completed */}

            <div className="col-12 col-sm-6 col-lg-4">

                <div className="session-stat-card">

                    <div className="session-stat-icon">

                        <CheckCircle2
                            size={24}
                        />

                    </div>

                    <div className="session-stat-value">

                        {stats.completed_sessions || 0}

                    </div>

                    <div className="session-stat-label">

                        Sessions Completed

                    </div>

                </div>

            </div>


            {/* Total Hours */}

            <div className="col-12 col-sm-6 col-lg-4">

                <div className="session-stat-card">

                    <div className="session-stat-icon">

                        <Clock3
                            size={24}
                        />

                    </div>

                    <div className="session-stat-value">

                        {stats.total_hours || 0}h

                    </div>

                    <div className="session-stat-label">

                        Total Session Time

                    </div>

                </div>

            </div>

        </div>
    )
}   

export default SessionStats