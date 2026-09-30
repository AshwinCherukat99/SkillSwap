import React from "react";

const AssessmentReview=({
    questions,
    answers,
    onSelectQuestion,
    onBack,
    onSubmit,
    submitting
})=>{
    const answeredCount=questions.filter(
        question=>
            answers[question.id]!==undefined&&answers[question.id]!==''
    ).length
    return (
        <main className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-9 col-xl-8">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4 p-lg-5">

                            <div className="text-center mb-5">

                                <div className="review-icon mx-auto mb-3">

                                    <i className="bi bi-clipboard-check" />

                                </div>

                                <h2 className="fw-bold">

                                    Review Your Answers

                                </h2>

                                <p className="text-muted">

                                    Check your answers before submitting
                                    the assessment.

                                </p>

                            </div>


                            <div className="alert alert-light border mb-4">

                                <div className="d-flex justify-content-between">

                                    <span>

                                        Questions answered

                                    </span>

                                    <strong>

                                        {answeredCount} / {questions.length}

                                    </strong>

                                </div>

                            </div>


                            <div className="list-group mb-4">

                                {questions.map(
                                    (question, index) => {

                                        const answered =
                                            answers[question.id] !== undefined &&
                                            answers[question.id] !== '';

                                        return (

                                            <button
                                                type="button"
                                                key={question.id}
                                                onClick={() =>
                                                    onSelectQuestion(index)
                                                }
                                                className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
                                            >

                                                <span
                                                    className={`review-question-number ${
                                                        answered
                                                            ? 'answered'
                                                            : ''
                                                    }`}
                                                >

                                                    {index + 1}

                                                </span>


                                                <div className="flex-grow-1 text-start">

                                                    <div className="fw-semibold">

                                                        {question.question_text}

                                                    </div>

                                                    <small className="text-muted">

                                                        {question.question_type}

                                                    </small>

                                                </div>


                                                <i
                                                    className={`bi ${
                                                        answered
                                                            ? 'bi-check-circle-fill text-success'
                                                            : 'bi-circle text-muted'
                                                    }`}
                                                />

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            <div className="d-flex justify-content-between">

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={onBack}
                                    disabled={submitting}
                                >

                                    <i className="bi bi-arrow-left me-2" />

                                    Back to Questions

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                    onClick={onSubmit}
                                    disabled={submitting}
                                >

                                    {submitting ? (

                                        <>

                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />

                                            Submitting...

                                        </>

                                    ) : (

                                        <>

                                            Submit Assessment

                                            <i className="bi bi-check2 ms-2" />

                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    )
}

export default AssessmentReview