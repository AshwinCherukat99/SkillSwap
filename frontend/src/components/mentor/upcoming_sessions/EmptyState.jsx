import {CalendarDays} from 'lucide-react'

const EmptyState=()=>{
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">

                <CalendarDays
                    size={48}
                    className="text-muted mb-3"
                />

                <h5 className="fw-semibold">
                    No upcoming sessions
                </h5>

                <p className="text-muted mb-0">
                    You don't have any upcoming course sessions scheduled.
                </p>

            </div>
        </div>
    )
}

export default EmptyState