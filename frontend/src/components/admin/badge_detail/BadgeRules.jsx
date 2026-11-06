const BadgeRules=({rules=[]})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

                <h5 className="fw-bold border-bottom pb-3 mb-4">
                    Achievement Rules
                </h5>

                {rules.length === 0 ? (
                    <p className="text-muted mb-0">
                        No achievement rules configured.
                    </p>
                ) : (
                    <div className="d-flex flex-column gap-3">

                        {rules.map((rule, index) => (
                            <div
                                key={rule.id}
                                className="badge-rule-item d-flex align-items-center gap-3 p-3 rounded-3"
                            >
                                <div className="badge-rule-number">
                                    {index + 1}
                                </div>

                                <div className="flex-grow-1">
                                    <p className="fw-semibold mb-1">
                                        {rule.rule_type_display || rule.rule_type}
                                    </p>

                                    <small className="text-muted">
                                        Target requirement
                                    </small>
                                </div>

                                <span className="badge text-bg-primary px-3 py-2">
                                    {rule.target_value}
                                </span>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    )
}

export default BadgeRules