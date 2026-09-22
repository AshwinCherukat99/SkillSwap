import React from 'react'

import {Users,Wifi,Handshake,UserPlus} from 'lucide-react'

const FriendStats=({stats})=>{
    const cards=[
        {
            title:'Total Friends',
            value:stats.total_friends,
            icon:Users,
            bg:'bg-primary-subtle',
            text:'text-primary',
        },
        {
            title:'Online Friends',
            value:stats.online_friends,
            icon:Wifi,
            bg:'bg-success-subtle',
            text:'text-success',
        },
        {
            title:'Sessions Together',
            value:stats.sessions_together,
            icon:Handshake,
            bg:'bg-warning-subtle',
            text:'text-warning',
        },
        {
            title:'New This Month',
            value:stats.new_this_month,
            icon:UserPlus,
            bg:'bg-purple-subtle',
            text:'text-purple',
        },
    ]
    return (
        <div className="row g-4 mb-4">

            {cards.map((card) => {

                const Icon = card.icon

                return (
                    <div
                        className="col-12 col-md-6 col-xl-3"
                        key={card.title}
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body p-4">

                                <div
                                    className={`d-inline-flex p-3 rounded-3 ${card.bg} ${card.text} mb-3`}
                                >
                                    <Icon size={22} />
                                </div>

                                <p className="text-muted small text-uppercase mb-1">
                                    {card.title}
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {card.value}
                                </h3>

                            </div>

                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default FriendStats