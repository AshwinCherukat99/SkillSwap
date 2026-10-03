import React from "react";

const RULE_TYPES=[
    {
        value:'SESSIONS_COMPLETED',
        label:'Sessions Completed'
    },
    {
        value:'COURSES_COMPLETED',
        label:'Courses Completed'
    },
    {
        value:'COURSES_PASSED',
        label:'Courses Passed'
    },
    {
        value:'FRIENDS_ADDED',
        label:'Friends Added'
    },
    {
        value:'POSTS_CREATED',
        label:'Posts Created'
    },
    {
        value:'POSTS_LIKED',
        label:'Posts Liked'
    },
    {
        value:'COMMENTS_CREATED',
        label:'Commnents Created'
    },
    {
        value:'STREAK_DAYS',
        label:'Streak Days'
    },
]
const AchievementRule=({
    rule,
    index,
    onChange,
    onRemove,
})=>{
    return (
        <div className="border rounded-3 p-3 mb-3">

            <div className="d-flex justify-content-between mb-3">

                <strong>
                    Rule {index + 1}
                </strong>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onRemove(index)}
                >
                    <i className="bi bi-trash"></i>
                </button>

            </div>

            <div className="row g-3">

                <div className="col-md-8">

                    <label className="form-label">
                        Condition
                    </label>

                    <select
                        className="form-select"
                        value={rule.rule_type}
                        onChange={(e) =>
                            onChange(
                                index,
                                "rule_type",
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Select condition
                        </option>

                        {RULE_TYPES.map((type) => (

                            <option
                                key={type.value}
                                value={type.value}
                            >
                                {type.label}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="col-md-4">

                    <label className="form-label">
                        Target
                    </label>

                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={rule.target_value}
                        onChange={(e) =>
                            onChange(
                                index,
                                "target_value",
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

            </div>

        </div>
    )
}

export default AchievementRule