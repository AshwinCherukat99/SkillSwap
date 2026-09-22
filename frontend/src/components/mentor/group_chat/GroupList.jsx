import React from 'react'

const GroupList=({
    groups,
    selectedGroup,
    onSelectGroup,
    loading,
})=>{
    return (
        <div className="card border-0 shadow-sm h-100 mentor-chat-panel">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold">Your Groups</h5>

        <button
          type="button"
          className="btn btn-sm btn-light"
          title="Filter groups"
        >
          <i className="bi bi-funnel"></i>
        </button>
      </div>

      <div className="card-body p-2 overflow-auto">
        {loading ? (
          <div className="text-center py-4">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-chat-square-text fs-3"></i>
            <p className="mt-2 mb-0">No study groups found.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`group-list-item rounded-3 p-3 mb-1 ${
                selectedGroup?.id === group.id
                  ? "active-group"
                  : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="mb-1 fw-bold">
                  {group.name || group.course_title}
                </h6>

                {group.unread_count > 0 && (
                  <span
                    className={`badge ${
                      selectedGroup?.id === group.id
                        ? "bg-light text-primary"
                        : "bg-primary"
                    }`}
                  >
                    {group.unread_count}
                  </span>
                )}
              </div>

              <div className="small opacity-75">
                {group.member_count || 0} members
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    )
} 

export default GroupList