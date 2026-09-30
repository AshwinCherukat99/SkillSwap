import React from "react";

const QuestionNavigator=({
    questions,
    currentQuestion,
    answers,
    onSelectQuestion,
})=>{
    const answeredCount=questions.filter(
        question=>
            answers[question.id]!==undefined&&answers[question.id]!==''
    ).length
    return (
        <div className="card border-0 shadow-sm assessment-navigator">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h6 className="fw-bold mb-0">

                        Questions

                    </h6>

                    <span className="badge text-bg-light">

                        {answeredCount}/{questions.length}

                    </span>

                </div>


                <div className="row g-2">

                    {questions.map((question, index) => {

                        const answered =
                            answers[question.id] !== undefined &&
                            answers[question.id] !== '';


                        const active =
                            index === currentQuestion;


                        return (

                            <div
                                className="col-4"
                                key={question.id}
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectQuestion(index)
                                    }
                                    className={`btn w-100 question-number ${
                                        active
                                            ? 'btn-primary'
                                            : answered
                                                ? 'btn-primary-subtle'
                                                : 'btn-outline-secondary'
                                    }`}
                                >

                                    {index + 1}

                                </button>

                            </div>

                        );

                    })}

                </div>


                <hr className="my-4" />


                <div className="small text-muted">

                    <div className="d-flex align-items-center gap-2 mb-2">

                        <span className="question-legend answered" />

                        Answered

                    </div>


                    <div className="d-flex align-items-center gap-2 mb-2">

                        <span className="question-legend current" />

                        Current

                    </div>


                    <div className="d-flex align-items-center gap-2">

                        <span className="question-legend unanswered" />

                        Unanswered

                    </div>

                </div>

            </div>

        </div>
    )
}
export default QuestionNavigator