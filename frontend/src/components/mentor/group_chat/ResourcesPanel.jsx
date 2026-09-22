import React from 'react'

const ResourcesPanel=({resources=[]})=>{
    return (
        <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Resources</h5>

          <button className="btn btn-link btn-sm text-primary p-0">
            View All
          </button>
        </div>

        {resources.length === 0 ? (
          <div className="text-center text-muted py-3">
            <i className="bi bi-folder2-open fs-3"></i>
            <p className="small mt-2 mb-0">
              No shared resources yet.
            </p>
          </div>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="resource-item d-flex align-items-center gap-3 mb-3"
            >
              <div className="resource-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>

              <div className="flex-grow-1 overflow-hidden">
                <div className="small fw-bold text-truncate">
                  {resource.name}
                </div>

                <div className="text-muted resource-meta">
                  {resource.size}
                </div>
              </div>

              <button className="btn btn-sm btn-light">
                <i className="bi bi-download"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    )
} 

export default ResourcesPanel