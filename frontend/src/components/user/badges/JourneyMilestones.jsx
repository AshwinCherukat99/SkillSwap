const milestoneColors=[
    '#ff765e',
    '#ffad32',
    '#36c99a',
    '#12a9d6',
    '#a96bd5',
    '#e46caa',
]

function JourneyMilestones({milestones=[]}){
    const completedCount=milestones.filter(
        milestone=>milestone.completed
    ).length
    const totalXP=milestones.reduce(
        (total,milestone)=>
            total+(milestone.completed?(milestone.xp_awarded??milestone.xp??0):0),
        0
    )
    const completionPercentage=milestones.length?
    Math.round(completedCount/milestones.length*100):0
    return (
        <section className="journey-section">

            <div className="journey-heading">
                <div>
                    <h2>Journey Milestones</h2>
                    <p>Your progress through SkillSwap</p>
                </div>
                <div className="journey-xp">
                    <span>Earned XP</span>
                    <strong>{totalXP.toLocaleString()} XP</strong>
                </div>
            </div>

            <div className="journey-timeline">
                <div className="journey-track">

                {milestones.map(
                    (milestone, index) => {
                        const color=milestoneColors[
                            index%milestoneColors.length
                        ]
                        const xp = milestone.xp_awarded ?? milestone.xp ?? 500
                        return (
                            <div
                                className={`journey-item ${
                                    milestone.completed ? 'is-completed' : 'is-pending'
                                }`}
                                key={milestone.key || index}
                                style={{ '--milestone-color': color }}
                            >
                                <div className="journey-segment">
                                    <div className="journey-node">
                                        {milestone.completed ? '✓' : index + 1}
                                    </div>
                                </div>

                                <div className="journey-content">
                                    <h5>{milestone.title}</h5>

                                    <span
                                        className={
                                            milestone.completed
                                                ? 'journey-completed'
                                                : 'journey-pending'
                                        }
                                    >
                                        {milestone.completed
                                            ? 'Completed'
                                            : 'Not completed yet'}
                                    </span>

                                    {milestone.completed && milestone.date && (
                                        <small>
                                            {new Date(milestone.date).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }
                                            )}
                                        </small>
                                    )}

                                    <div className="journey-reward">
                                        {milestone.completed
                                            ? `+${xp} XP earned`
                                            : `Earn ${xp} XP`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="journey-footer">
                <span>
                    {completedCount}/{milestones.length} milestones completed
                </span>

                <span>{completionPercentage}% completed</span>
            </div>
        </section>
    )
}

export default JourneyMilestones