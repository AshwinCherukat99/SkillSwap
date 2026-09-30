import React from "react";

const AssessmentProgress=({currentQuestion,totalQuestions})=>{
    const progress=totalQuestions>0?((currentQuestion+1)/totalQuestions)*100:0
    return (
        <div className="assessment-progress bg-white border-bottom">

            <div className="container-fluid px-4 px-lg-5 py-3">

                <div className="d-flex justify-content-between align-items-center mb-2">

                    <span className="small fw-semibold">

                        Question {currentQuestion + 1} of {totalQuestions}

                    </span>


                    <span className="small text-muted">

                        {Math.round(progress)}% complete

                    </span>

                </div>


                <div
                    className="progress"
                    style={{ height: '7px' }}
                >

                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

            </div>

        </div>
    )
}

export default AssessmentProgress