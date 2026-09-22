function JourneyMilestones({milestones}){
    return (
        <div className="journey-section">

            <h2>

                Journey Milestones

            </h2>


            <p>

                Your progress through SkillSwap.

            </p>


            <div className="journey-timeline">

                {milestones.map(
                    (milestone, index) => (

                        <div
                            className="
                                journey-item
                            "
                            key={index}
                        >

                            <div
                                className={
                                    `
                                    journey-marker
                                    ${milestone.completed
                                        ? "completed"
                                        : "pending"
                                    }
                                    `
                                }
                            >

                                {milestone.completed
                                    ? "✓"
                                    : index + 1
                                }

                            </div>


                            <div
                                className="
                                    journey-content
                                "
                            >

                                <h5>

                                    {milestone.title}

                                </h5>


                                {milestone.completed ? (

                                    <span>

                                        Completed{" "}

                                        {milestone.date &&
                                            `on ${new Date(
                                                milestone.date
                                            ).toLocaleDateString()}`
                                        }

                                    </span>

                                ) : (

                                    <span>

                                        Not completed yet

                                    </span>

                                )}

                            </div>


                            {index <
                                milestones.length - 1 && (

                                <div
                                    className="
                                        journey-line
                                    "
                                />

                            )}

                        </div>

                    )
                )}

            </div>

        </div>
    )
}

export default JourneyMilestones