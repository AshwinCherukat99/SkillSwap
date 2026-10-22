import React from "react";

function AIsummary({result}){
    if (!result) return null
    const sections=[
        {
            title:'Overall Summary',
            content:result.ai_summary,
            icon:'bi bi-clipboard-check',
        },
        {
            title:'Strengths',
            content:result.strengths,
            icon:'bi bi-trophy',
        },
        {
            title:'Areas to Improve',
            content:result.weaknesses,
            icon:'bi bi-lightbulb',
        },
        {
            title:'Recommendations',
            content:result.recommendations,
            icon:'bi bi-jounal-text',
        },
    ]
    return (
        <section>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="section-icon">
              <i className="bi bi-stars" />
            </span>
            <h2 className="h4 fw-bold mb-0">
              AI Performance Summary
            </h2>
          </div>

          <p className="text-secondary mb-0">
            Personalized insights based on your answers and assessment
            performance.
          </p>
        </div>
      </div>

        <div className="row g-3">
          {sections.map((section) => (
            <div className="col-12 col-md-6" key={section.title}>
              <div className="h-100 p-3 rounded border">
                <h6>
                  <i className={`${section.icon} me-2`} />
                  {section.title}
                </h6>

                <p className="mb-0 text-secondary">
                  {section.content || "No information available."}
                </p>
              </div>
            </div>
          ))}
        </div>

    </section>
    )
}

export default AIsummary