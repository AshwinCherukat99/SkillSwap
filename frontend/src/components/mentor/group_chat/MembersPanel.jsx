import React from 'react'

const MembersPanel=({members=[]})=>{
    return (
        <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-4">
          Members ({members.length})
        </h5>

        <div className="members-list">
          {members.map((member) => (
            <div
              key={member.id}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <div className="d-flex align-items-center gap-2">
                <div className="member-avatar">
                  {member.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <div className="small fw-bold">
                    {member.name}
                  </div>

                  <div className="text-muted member-status">
                    {member.is_online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              <span
                className={`badge ${
                  member.role === "MENTOR"
                    ? "bg-primary-subtle text-primary"
                    : member.role === "MOD"
                    ? "bg-success-subtle text-success"
                    : "bg-light text-dark"
                }`}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
} 

export default MembersPanel