import React from "react";

const SkillManagementHeader=({
    search,
    setSearch,
    onAddSkill,
})=>{
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

            <div>

                <h3 className="fw-bold mb-1">
                    Skill Management
                </h3>

                <p className="text-muted mb-0">
                    Manage platform skills and review
                    user suggestions.
                </p>

            </div>


            <div className="d-flex gap-2">

                <div className="input-group">

                    <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                    </span>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search skills..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <button
                    type="button"
                    className="btn btn-primary text-nowrap"
                    onClick={onAddSkill}
                >

                    <i className="bi bi-plus-lg me-1"></i>

                    Add Skill

                </button>

            </div>

        </div>
    )
}

export default SkillManagementHeader