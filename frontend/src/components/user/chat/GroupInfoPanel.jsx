import React from 'react'

const GroupInfoPanel=({group,members})=>{
    if (!group){
        return null
    }
    return (
        <aside className="chat-info-panel d-none d-xl-flex flex-column">

            <div className="text-center">

                <div className="large-group-avatar mx-auto mb-3">

                    <i className="bi bi-people-fill"></i>

                </div>

                <h5 className="fw-bold mb-1">
                    {group.course_title}
                </h5>

                <p className="text-muted small">
                    {group.name}
                </p>

            </div>


            <hr />


            <div className="d-flex justify-content-between align-items-center mb-3">

                <h6 className="fw-bold mb-0">
                    Members
                </h6>

                <span className="badge bg-primary">
                    {group.member_count}
                </span>

            </div>


            <div>

                {members.map(member => (

                    <div
                        key={member.id}
                        className="member-item"
                    >

                        <div className="member-avatar">

                            {member.name
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="flex-grow-1">

                            <div className="fw-semibold small">
                                {member.name}
                            </div>

                            <div className="member-status">

                                {member.role === 'MENTOR'
                                    ? 'Mentor'
                                    : 'Student'}

                            </div>

                        </div>


                        {member.role === 'MENTOR' && (

                            <span className="badge bg-light text-primary">
                                Mentor
                            </span>

                        )}

                    </div>

                ))}

            </div>

        </aside>
    )
}

export default GroupInfoPanel