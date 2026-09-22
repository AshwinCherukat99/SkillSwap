import React from 'react'

function TeachingNiche({value,onChange}){
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4 p-lg-5">

                <div className="d-flex justify-content-between align-items-start mb-4">

                    <div>

                        <div className="d-flex align-items-center gap-2">

                            <span className="material-symbols-outlined text-primary">
                                category
                            </span>

                            <h3 className="h5 mb-0">
                                Teaching Niche
                            </h3>

                        </div>

                        <p className="text-muted small mt-2 mb-0">
                            Describe the areas and subjects you specialize
                            in teaching.
                        </p>

                    </div>

                    <span className="badge bg-primary-subtle text-primary">
                        Editable
                    </span>

                </div>

                <label
                    htmlFor="teaching_niche"
                    className="form-label fw-semibold"
                >
                    Your Teaching Specialization
                </label>

                <textarea
                    id="teaching_niche"
                    name="teaching_niche"
                    className="form-control"
                    rows="5"
                    value={value}
                    onChange={onChange}
                    placeholder="Describe the areas you specialize in teaching..."
                />

                <div className="form-text">
                    Explain your areas of expertise so learners can
                    understand what you can help them with.
                </div>

            </div>

        </section>
    )
} 

export default TeachingNiche