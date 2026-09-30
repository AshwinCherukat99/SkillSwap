import React from "react";

const SkillList=({
    skills,
    loading,
    onDelete
})=>{
    if (loading){
        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

            </div>
        )
    }
    if (!skills.length){
        return (
            <div className="text-center py-5">

                <i className="bi bi-stars fs-1 text-muted"></i>

                <h6 className="mt-3">
                    No skills found
                </h6>

                <p className="text-muted small mb-0">
                    Try changing your search or add
                    a new skill.
                </p>

            </div>
        )
    }
    return (
        <div className="table-responsive">

            <table className="table align-middle mb-0">

                <thead>

                    <tr>

                        <th>
                            Skill
                        </th>

                        <th>
                            Slug
                        </th>

                        <th>
                            Status
                        </th>

                        <th className="text-end">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {skills.map((skill) => (

                        <tr key={skill.id}>

                            <td>

                                <div className="d-flex align-items-center gap-2">

                                    <div
                                        className="rounded-2 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 38,
                                            height: 38
                                        }}
                                    >

                                        <i className="bi bi-lightning-charge"></i>

                                    </div>

                                    <span className="fw-semibold">
                                        {skill.name}
                                    </span>

                                </div>

                            </td>


                            <td>

                                <span className="text-muted small">

                                    {skill.slug ||
                                        'No slug present'}

                                </span>

                            </td>


                            <td>

                                {skill.is_active ? (

                                    <span className="badge bg-success-subtle text-success">

                                        Active

                                    </span>

                                ) : (

                                    <span className="badge bg-secondary-subtle text-secondary">

                                        Inactive

                                    </span>

                                )}

                            </td>


                            <td className="text-end">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                        onDelete(
                                            skill.id
                                        )
                                    }
                                >

                                    <i className="bi bi-trash"></i>

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default SkillList