import React from "react";

const AssessmentHeader=({assessment})=>{
    const totalQuestions=assessment?.total_questions||10
    return (
        <header className="assessment-header bg-white border-bottom">

            <div className="container-fluid px-4 px-lg-5">

                <div className="d-flex justify-content-between align-items-center py-3">


                    {/* Left */}

                    <div className="d-flex align-items-center gap-3">

                        <div className="assessment-logo">

                            <i className="bi bi-stars" />

                        </div>


                        <div>

                            <h5 className="fw-bold mb-0">

                                AI Course Assessment

                            </h5>

                            <small className="text-muted">

                                Final assessment

                            </small>

                        </div>

                    </div>


                    {/* Right */}

                    <div className="d-flex align-items-center gap-4">

                        <div className="text-end">

                            <div className="small text-muted">

                                Questions

                            </div>

                            <div className="fw-bold">

                                {totalQuestions}

                            </div>

                        </div>


                        <div className="vr" />


                        <div className="text-end">

                            <div className="small text-muted">

                                Attempt

                            </div>

                            <div className="fw-bold">

                                #{assessment?.attempt_number}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    )
}

export default AssessmentHeader