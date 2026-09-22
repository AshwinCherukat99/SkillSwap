import React,{useState} from 'react'

import ModuleCard from './ModuleCard'

const ModuleList=({modules})=>{
    const [expandedModules,setExpandedModules]=useState(
        modules.length>0?
        [modules[0].id]:
        []
    )
    const toggleModule=(moduleId)=>{
        setExpandedModules((previous)=>{
            if (previous.includes(moduleId)){
                return previous.filter(
                    id=>id!==moduleId
                )
            }
            return [...previous,moduleId]
        })
    }
    const expandAll=()=>{
        setExpandedModules(
            modules.map(module=>module.id)
        )
    }
    const collapseAll=()=>{
        setExpandedModules([])
    }
    return (
        <section>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">

                <div>

                    <div className="d-flex align-items-center gap-2">

                        <h2 className="h4 fw-bold mb-0">
                            Curriculum & Course Content
                        </h2>

                        <span className="badge bg-light text-dark">
                            {modules.length} Modules
                        </span>

                    </div>

                </div>


                <div className="d-flex gap-2">

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={expandAll}
                    >
                        Expand All
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={collapseAll}
                    >
                        Collapse All
                    </button>

                </div>

            </div>


            {modules.length === 0 ? (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <h5>
                            No modules yet
                        </h5>

                        <p className="text-muted mb-0">
                            This course does not have any
                            modules or lessons yet.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="d-flex flex-column gap-3">

                    {modules.map((module, index) => (

                        <ModuleCard
                            key={module.id}
                            module={module}
                            moduleIndex={index}
                            expanded={expandedModules.includes(
                                module.id
                            )}
                            onToggle={() =>
                                toggleModule(module.id)
                            }
                        />

                    ))}

                </div>

            )}

        </section>
    )
}

export default ModuleList