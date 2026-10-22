import React,{useMemo,useState} from "react";

function displayAnswer(answer){
    if (answer==null|answer==='') return 'no answer submitted'
    if (typeof answer==='object'){
        return answer.text??answer.label??JSON.stringify(answer)
    }
    return String(answer)
}

function QuestionCard({question,index,expanded,onToggle}){
    const correct=Boolean(question.is_correct)
    const type=String(question.question_type||'Question').replaceAll('_',' ').replace(/\b\w/g, (char) => char.toUpperCase())
    const options=Array.isArray(question.options)?question.options:[]
    return (
        <article className="result-card question-card">
      <button
        type="button"
        className="question-trigger"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span
          className={`question-number ${
            correct ? 'question-correct' : 'question-incorrect'
          }`}
        >
          Q{index + 1}
        </span>

        <span className="question-heading">
          <strong>
            {question.title || question.question_text || `Question ${index + 1}`}
          </strong>
          <small>
            {type}
            {question.topic ? ` • ${question.topic}` : ''}
          </small>
        </span>

        <span
          className={`points-badge ${
            correct ? 'points-good' : 'points-bad'
          }`}
        >
          {question.score ?? 0} / {question.max_score ?? 0} pts
        </span>

        <i
          className={`bi bi-chevron-down question-chevron ${
            expanded ? 'is-expanded' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="question-content">
          <p className="question-prompt">
            {question.question_text || question.title}
          </p>

          {options.length > 0 && (
            <div className="d-flex flex-column gap-2">
              {options.map((option, optionIndex) => {
                const label = option.label || String.fromCharCode(65 + optionIndex);
                const optionText =
                  typeof option === 'string'
                    ? option
                    : option.text ?? option.label ?? '';

                const submitted = displayAnswer(question.student_answer);
                const isSelected =
                  submitted === optionText ||
                  submitted === label ||
                  submitted === `${label}. ${optionText}`;

                const isAnswer =
                  displayAnswer(question.correct_answer) === optionText ||
                  displayAnswer(question.correct_answer) === label ||
                  displayAnswer(question.correct_answer) ===
                    `${label}. ${optionText}`;

                return (
                  <div
                    key={option.id ?? optionIndex}
                    className={[
                      'answer-option',
                      isAnswer ? 'answer-option-correct' : '',
                      isSelected && !isAnswer
                        ? 'answer-option-wrong'
                        : '',
                    ].join(' ')}
                  >
                    <div>
                      <strong className="me-2">{label}.</strong>
                      <span>{optionText}</span>
                    </div>

                    <div className="answer-option-label">
                      {isSelected && (
                        <span>
                          <i className="bi bi-person-check me-1" />
                          Your answer
                        </span>
                      )}

                      {isAnswer && (
                        <span className="text-success">
                          <i className="bi bi-check-circle me-1" />
                          Correct answer
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="answer-detail">
            <span className="answer-detail-label">
              Your submitted answer
            </span>
            <div className="answer-detail-body">
              {question.submitted_code != null ? (
                <pre>
                  <code>{question.submitted_code}</code>
                </pre>
              ) : (
                displayAnswer(question.student_answer)
              )}
            </div>
          </div>

          {question.correct_answer != null && (
            <div className="answer-detail">
              <span className="answer-detail-label text-success">
                Correct answer / reference answer
              </span>
              <div className="answer-detail-body">
                {displayAnswer(question.correct_answer)}
              </div>
            </div>
          )}

          {question.feedback && (
            <div className="ai-feedback">
              <i className="bi bi-stars fs-5" />
              <div>
                <strong>
                  {'AI Feedback'}
                </strong>
                <p className="mb-0 mt-1">{question.feedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
    )
}

function QuestionReview({questions=[],result}){
    const [filter,setFilter]=useState('all')
    const [expandedIds,setExpandedIds]=useState([])
    const normalizedQuestions=useMemo(
        ()=>questions.map((question,index)=>({
            ...question,
            _key:question.id??index,
        })),
        [questions]
    )
    const correctCount=normalizedQuestions.filter(
        (question)=>Boolean(question.is_correct)
    ).length
    const incorrectCount=normalizedQuestions-correctCount
    const visibleQuestions=normalizedQuestions.filter((question)=>{
        if (filter==='correct') return Boolean(question.is_correct)
        if (filter==='incorrect') return !question.is_correct
        return true
    })
    const allVisibleExpanded=visibleQuestions.length>0&&
    visibleQuestions.every((question)=>
    expandedIds.includes(question._key))
    const toggleQuestion=(key)=>{
        setExpandedIds((previous)=>
        previous.includes(key)
        ?previous.filter((id)=>id!==key):[...previous,key]
    )
    }
    const toggleAll = () => {
    if (allVisibleExpanded) {
      setExpandedIds((previous) =>
        previous.filter(
          (id) => !visibleQuestions.some((question) => question._key === id)
        )
      );
    } else {
      setExpandedIds((previous) => [
        ...new Set([
          ...previous,
          ...visibleQuestions.map((question) => question._key),
        ]),
      ]);
    }
  };
  const filters=[
    {value:'all',label:`All Questions ${normalizedQuestions.length}`},
    {value:'correct',label:`Correct ${correctCount}`},
    {value:'Incorrect',label:`Incorrect ${incorrectCount}`}
  ]
  return (
    <section id="review-section">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Review Your Answers</h2>
          <p className="text-secondary mb-0">
            Understand what you got right, what needs improvement, and why.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-light border"
          onClick={toggleAll}
        >
          <i
            className={`bi ${
              allVisibleExpanded ? 'bi-arrows-collapse' : 'bi-arrows-expand'
            } me-2`}
          />
          {allVisibleExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="result-card question-toolbar mb-3">
        <div className="d-flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn btn-sm filter-button ${
                filter === item.value ? 'active' : ''
              }`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="small text-secondary mt-3 mt-md-0">
          <span className="text-success fw-semibold">
            {correctCount} Correct
          </span>
          <span className="mx-2">•</span>
          <span className="text-danger fw-semibold">
            {incorrectCount} Incorrect
          </span>
          {result && (
            <>
              <span className="mx-2">•</span>
              <strong className="text-dark">
                Total: {result.score ?? 0} / {result.max_score ?? 0} pts
              </strong>
            </>
          )}
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {visibleQuestions.map((question) => {
          const originalIndex = normalizedQuestions.findIndex(
            (item) => item._key === question._key
          );

          return (
            <QuestionCard
              key={question._key}
              question={question}
              index={originalIndex}
              expanded={expandedIds.includes(question._key)}
              onToggle={() => toggleQuestion(question._key)}
            />
          );
        })}

        {visibleQuestions.length === 0 && (
          <div className="result-card text-center py-5 text-secondary">
            No questions match this filter.
          </div>
        )}
      </div>
    </section>
  )
}

export default QuestionReview