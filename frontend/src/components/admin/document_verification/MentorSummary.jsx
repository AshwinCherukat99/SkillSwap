import React from 'react'

import { BriefcaseBusiness,Mail,CalendarDays,Star } from 'lucide-react'

const MentorSummary=({
    mentor,
    verification,
})=>{
    const getStatusClass=()=>{
        if (verification?.status==='APPROVED'){
            return 'bg-success-subtle text-success'
        }
        if (verification?.status==='REJECTED'){
            return 'bg-danger-subtle text-danger'
        }
        if (verification?.status==='REQUESTED'){
            return 'bg-warning-subtle text-warning-emphasis'
        }
        return 'bg-warning-subtle text-warning-emphasis'
    }
    return (
        <section className="card border-0 shadow-sm verification-card">

            <div className="verification-accent" />

            <div className="card-body p-4">

                <div className="d-flex align-items-start gap-3">

                    <div className="mentor-avatar">
                        {mentor?.username
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div className="flex-grow-1">

                        <h2 className="h5 fw-bold mb-1">
                            {mentor?.username}
                        </h2>

                        <p className="text-primary mb-2">
                            {mentor?.email}
                        </p>

                        <span
                            className={`badge rounded-pill ${getStatusClass()}`}
                        >
                            {verification?.status
                                ?.replaceAll('_', ' ') ||
                                'PENDING'}
                        </span>

                    </div>

                </div>


                <div className="mt-4">

                    <div className="verification-info-row">
                        <span>
                            <Mail size={16} />
                            Email
                        </span>

                        <strong>
                            {mentor?.email || '-'}
                        </strong>
                    </div>


                    <div className="verification-info-row">
                        <span>
                            <Star size={16} />
                            Rating
                        </span>

                        <strong>
                            {mentor?.rating || '0.00'}
                        </strong>
                    </div>


                    <div className="verification-info-row">
                        <span>
                            <CalendarDays size={16} />
                            Applied
                        </span>

                        <strong>
                            {verification?.created_at
                                ? new Date(
                                    verification.created_at
                                ).toLocaleDateString()
                                : '-'}
                        </strong>
                    </div>


                    <div className="verification-info-row">
                        <span>
                            <BriefcaseBusiness size={16} />
                            Verification
                        </span>

                        <strong>
                            {mentor?.is_verified
                                ? 'Verified'
                                : 'Not Verified'}
                        </strong>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default MentorSummary