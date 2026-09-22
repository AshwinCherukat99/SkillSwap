import React from "react";

import MentorVerificationCard from "./MentorVerificationCard";

const MentorVerificationList=({mentors,loading})=>{
    if (loading){
        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-secondary mt-3 mb-0">
                    Loading mentor verification queue...
                </p>

            </div>
        )
    }
    if (!mentors.length){
        return null
    }
    return (
        <div>

            {mentors.map((mentor) => (

                <MentorVerificationCard
                    key={mentor.id}
                    mentor={mentor}
                />

            ))}

        </div>
    )
}

export default MentorVerificationList