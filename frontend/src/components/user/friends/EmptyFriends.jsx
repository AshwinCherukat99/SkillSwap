import React from 'react'

import {Users} from 'lucide-react'

const EmptyFriends=()=>{
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-5">

                <Users
                    size={48}
                    className="text-muted mb-3"
                />

                <h5 className="fw-semibold">
                    No friends found
                </h5>

                <p className="text-muted mb-0">
                    Try changing your search or filters.
                </p>

            </div>

        </div>
    )
}

export default EmptyFriends