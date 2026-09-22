import React from "react";

import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    UserX,
    Clock3,
    Wallet,
} from 'lucide-react'

const SessionStats=({stats})=>{
    const cards=[
        {
            label:'Total Sessions',
            value:stats.total,
            icon:CalendarDays,
            className:'stat-primary',
            description:'All recorded sessions'
        },
        {
            label:'Completed',
            value:stats.completed,
            icon:CheckCircle2,
            className:'stat-success',
            description:stats.total>0?`${((stats.completed/stats.total)*100).toFixed(1)}% delivery date`:'0% delivery date'
        },
        {
            label:'Cancelled',
            value:stats.cancelled,
            icon:XCircle,
            className:'stat-danger',
            description:'Cancelled sessions'
        },
        {
            label:'Expired',
            value:stats.expired,
            icon:UserX,
            className:'stat-warning',
            description:'Expired sessions'
        },
        {
            label:'Total Hours',
            value:(
                <>
                {stats.totalHours}   
                <span className="stat-unit">
                    hrs
                </span>
                </>
            ),
            icon:Clock3,
            className:'stat-neutral',
            description:'Mentoring time'
        },
        {
            label:'Gross Earnings',
            value:'-',
            icon:Wallet,
            className:'stat-success',
            description:'Not provided by current API'
        },
    ]
    return (
        <div className="row g-3 mb-4">

            {cards.map(card => {

                const Icon = card.icon

                return (
                    <div
                        className="col-6 col-md-4 col-xl-2"
                        key={card.label}
                    >

                        <div className="session-stat-card">

                            <div className="d-flex justify-content-between align-items-start">

                                <span className="session-stat-label">
                                    {card.label}
                                </span>

                                <div
                                    className={`session-stat-icon ${card.className}`}
                                >
                                    <Icon size={18} />
                                </div>

                            </div>


                            <div className="session-stat-value">
                                {card.value}
                            </div>


                            <div className="session-stat-description">
                                {card.description}
                            </div>

                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default SessionStats