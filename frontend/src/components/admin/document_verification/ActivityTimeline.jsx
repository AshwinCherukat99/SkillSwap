import React from 'react'  

import {Upload,Clock,CheckCircle,XCircle} from 'lucide-react'

const ActivityTimeline=({verification,documents})=>{
    const events=[]
    if (verification?.created_at){
        events.push({
            title:'Verification Submitted',
            date:verification.created_at,
            icon:Upload,
            className:'timeline-primary',
            description:`verification record was created with ${documents.length} submitted documents`
        })
    }
    if (verification?.reviewed_at){
        const isApproved=verification.status==='APPROVED'
        const isRejected=verification.status==='REJECTED'
        events.push({
            title:isApproved?'Mentor Approved':isRejected?'Mentor Rejected':'Verification Reviewed',
            date:verification.reviewed_at,
            icon:isApproved?CheckCircle:isRejected?XCircle:Clock,
            className:isApproved?'timeline-success':isRejected?'timeline-danger':'timeline-warning',
            description:isApproved?'mentor verification was approved':isRejected?(verification.rejection_reason||'mentor verification was rejected'):'mentor verification was reviewed'
        })
    }
    return (
        <section className="card border-0 shadow-sm verification-card mt-4">

            <div className="card-body p-4">

                <h3 className="h5 fw-bold mb-4">
                    Activity Timeline
                </h3>


                {events.length === 0 ? (
                    <p className="text-muted mb-0">
                        No activity available.
                    </p>
                ) : (

                    <div className="timeline">

                        {events.map((event, index) => {

                            const Icon = event.icon

                            return (
                                <div
                                    className="timeline-item"
                                    key={`${event.title}-${index}`}
                                >

                                    <div
                                        className={
                                            `timeline-icon ${event.className}`
                                        }
                                    >
                                        <Icon size={14} />
                                    </div>


                                    <div className="timeline-content">

                                        <div className="d-flex justify-content-between gap-3">

                                            <strong>
                                                {event.title}
                                            </strong>

                                            <small className="text-muted">
                                                {new Date(
                                                    event.date
                                                ).toLocaleString()}
                                            </small>

                                        </div>

                                        <p className="small text-muted mb-0 mt-1">
                                            {event.description}
                                        </p>

                                    </div>

                                </div>
                            )
                        })}

                    </div>

                )}

            </div>

        </section>
    )
}

export default ActivityTimeline