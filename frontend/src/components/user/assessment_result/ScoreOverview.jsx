import React from "react";

const formatDate=(value)=>{
    if (!value) return 'not available'
    const date=new Date(value)
    if (Number.isNaN(date.getTime())) return 'not available'
    return date.toLocaleString([],{
        dateStyle:'medium',
        timeStyle:'short'
    })
}

function MetricCard({icon,title,children}){
        return (
            <div className="col-12 col-sm-6">
      <div className="result-card metric-card h-100">
        <div className="d-flex justify-content-between align-items-center">
          <span className="metric-label">{title}</span>
          <span className="metric-icon">
            <i className={`bi ${icon}`} />
          </span>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
        )
    }

function ScoreOverview({result}){
    const percentage=Math.max(
        0,Math.min(100,Number(result.percentage??0))
    )
    const score=Number(result.score??0)
    const maxScore=Number(result.max_score??0)
    const passed=Boolean(result.passed)
    const threshold=Number(result.passing_percentage??0)
    const correct=Number(result.correct_answers??0)
    const incorrect=Number(result.incorrect_ansers??0)
    const total=Number(result.total_questions??result.questions?.length??0)
    const duration=result.duration_minutes!=null?`${result.duration_minutes} min`:'not available'
    const circumference=2*Math.PI*48
    const offset=circumference*(1-percentage/100)
    return (
        <>
      <section className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="result-card score-hero h-100">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <span className="metric-label">
                FINAL ASSESSMENT SCORE
              </span>

              <div className="d-flex gap-2 flex-wrap">
                <span
                  className={`badge rounded-pill ${
                    passed ? 'badge-passed' : 'badge-failed'
                  }`}
                >
                  {passed ? 'Passed' : 'Not Passed'}
                </span>

                {result.proficiency_level && (
                  <span className="badge rounded-pill badge-neutral">
                    {result.proficiency_level}
                  </span>
                )}
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 my-4">
              <div
                className="score-ring"
                role="img"
                aria-label={`Score ${percentage}%`}
              >
                <svg viewBox="0 0 120 120">
                  <circle
                    className="score-ring-track"
                    cx="60"
                    cy="60"
                    r="48"
                  />
                  <circle
                    className="score-ring-value"
                    cx="60"
                    cy="60"
                    r="48"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>

                <div className="score-ring-label">
                  <strong>{percentage.toFixed(0)}%</strong>
                  <span>
                    {score} / {maxScore} pts
                  </span>
                </div>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className={`bi ${
                      passed
                        ? 'bi-patch-check-fill text-success'
                        : 'bi-exclamation-circle-fill text-danger'
                    } fs-4`}
                  />

                  <h2 className="h5 fw-bold mb-0">
                    {passed ? 'Assessment Passed' : 'Keep Practising'}
                  </h2>
                </div>

                <p className="text-secondary mb-0">
                  {result.result_message ||
                    (passed
                      ? `You achieved ${percentage}% and met the ${threshold}% passing threshold.`
                      : `You scored ${percentage}%. Review the feedback below and practise your weaker topics.`)}
                </p>
              </div>
            </div>

            <div className="threshold-bar">
              <span>
                Passing threshold: {threshold}%
              </span>
              <strong>
                {percentage >= threshold
                  ? `+${(percentage - threshold).toFixed(1)}%`
                  : `-${(threshold - percentage).toFixed(1)}%`}
              </strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="row g-3 h-100">
            <MetricCard
              icon="bi-trophy"
              title="TOTAL SCORE"
            >
              <h3 className="metric-value">
                {score}{' '}
                <span>/ {maxScore} pts</span>
              </h3>
              <span className="text-success small fw-semibold">
                {result.grade || result.proficiency_level || 'Assessment result'}
              </span>
            </MetricCard>

            <MetricCard
              icon="bi-ui-checks"
              title="QUESTION BREAKDOWN"
            >
              <h3 className="metric-value">{total} Total</h3>
              <div className="small mt-2">
                <span className="text-success fw-semibold">
                  {correct} Correct
                </span>
                <span className="text-secondary mx-2">•</span>
                <span className="text-danger fw-semibold">
                  {incorrect} Incorrect
                </span>
              </div>
            </MetricCard>

            <MetricCard
              icon="bi-clock"
              title="STARTED AT"
            >
              <h3 className="metric-date">
                {formatDate(result.started_at)}
              </h3>
              <span className="small text-secondary">
                Assessment start time
              </span>
            </MetricCard>

            <MetricCard
              icon="bi-stopwatch"
              title="DURATION & END"
            >
              <h3 className="metric-date">{duration}</h3>
              <span className="small text-secondary">
                Completed: {formatDate(result.completed_at)}
              </span>
            </MetricCard>
          </div>
        </div>
      </section>
    </>
    )
}

export default ScoreOverview