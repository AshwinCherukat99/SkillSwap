import React from 'react'

import {CalendarDays,Clock3,Users,Flame,} from 'lucide-react'

const SessionStats=({stats})=>{
    return (
        <div className="row g-4 mb-5">

            <div className="col-12 col-sm-6 col-lg-3">

                <div className="upcoming-stat-card">

                    <span>
                        Upcoming Sessions
                    </span>

                    <div>

                        <strong>
                            {stats.upcoming_sessions}
                        </strong>

                        <CalendarDays size={22} />

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="upcoming-stat-card">

                    <span>
                        Total Session Hours
                    </span>

                    <div>

                        <strong>
                            {stats.total_hours}
                        </strong>

                        <small>
                            Hours
                        </small>

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="upcoming-stat-card">

                    <span>
                        Upcoming User Sessions
                    </span>

                    <div>

                        <strong>
                            {stats.upcoming_user_sessions}
                        </strong>

                        <Users size={22} />

                    </div>

                </div>

            </div>


            <div className="col-12 col-sm-6 col-lg-3">

                <div className="upcoming-stat-card streak">

                    <span>
                        Learning Streak
                    </span>

                    <div>

                        <strong>
                            {stats.learning_streak}
                        </strong>

                        <Flame size={22} />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SessionStats