import React from "react";

const QuestionCard=({
    question,
    questionNumber,
    answer,
    onAnswer,
})=>{
    if (!question){
        return null
    }
    const renderQuestion=()=>{
        switch(question.question_type){
            case 'MCQ':
                return (
                    <div className="d-flex flex-column gap-3">

                        {question.options?.map(
                            (option, index) => {

                                const selected =
                                    answer === option;

                                return (

                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() =>
                                            onAnswer(option)
                                        }
                                        className={`assessment-option text-start ${
                                            selected
                                                ? 'selected'
                                                : ''
                                        }`}
                                    >

                                        <span className="option-letter">

                                            {String.fromCharCode(
                                                65 + index
                                            )}

                                        </span>

                                        <span>

                                            {option}

                                        </span>

                                    </button>

                                );

                            }
                        )}

                    </div>
                )
            case 'TRUE_FALSE':
                return (
                    <div className="d-flex flex-column gap-3">

                        {question.options?.map(
                            option => {

                                const selected =
                                    answer === option;

                                return (

                                    <button
                                        type="button"
                                        key={option}
                                        onClick={() =>
                                            onAnswer(option)
                                        }
                                        className={`assessment-option text-start ${
                                            selected
                                                ? 'selected'
                                                : ''
                                        }`}
                                    >

                                        <span className="option-letter">

                                            {option === 'True'
                                                ? 'T'
                                                : 'F'}

                                        </span>

                                        <span>

                                            {option}

                                        </span>

                                    </button>

                                );

                            }
                        )}

                    </div>
                )
            case 'SHORT_ANSWER':
                return (
                    <textarea
                        className="form-control assessment-textarea"
                        rows="7"
                        placeholder="Type your answer here..."
                        value={answer || ''}
                        onChange={event =>
                            onAnswer(
                                event.target.value
                            )
                        }
                    />
                )
            case 'CODE':
                return (
                    <textarea
                        className="form-control assessment-code"
                        rows="14"
                        placeholder="// Write your solution here..."
                        value={answer || ''}
                        onChange={event =>
                            onAnswer(
                                event.target.value
                            )
                        }
                    />
                )
            default:
                return (
                    <div className="alert alert-warning">

                        Unsupported question type.

                    </div>
                )
        }
    }
    return (
        <div className="card border-0 shadow-sm assessment-question-card">

            <div className="card-body p-4 p-lg-5">


                {/* Question type */}

                <div className="d-flex align-items-center gap-2 mb-4">

                    <span className="badge text-bg-primary">

                        Question {questionNumber}

                    </span>


                    <span className="badge text-bg-light">

                        {question.question_type}

                    </span>


                    <span className="small text-muted">

                        {question.points} point

                    </span>

                </div>


                {/* Question */}

                <h4 className="fw-bold mb-4">

                    {question.question_text}

                </h4>


                {/* Answer */}

                {renderQuestion()}

            </div>

        </div>
    )
}

export default QuestionCard