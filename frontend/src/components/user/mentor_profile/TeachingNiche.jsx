function TeachingNiche({teachingNiche}){
    const niches=teachingNiche?teachingNiche.split(',').map((item)=>item.trim()).filter(Boolean):[]
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4 p-md-5">

                <div className="d-flex align-items-center gap-2 mb-4">

                    <span className="material-symbols-outlined text-primary">
                        psychology
                    </span>

                    <h2 className="h5 fw-bold mb-0">
                        Teaching Niche
                    </h2>

                </div>


                {niches.length > 0 ? (

                    <div className="d-flex flex-wrap gap-2">

                        {niches.map((niche, index) => (

                            <span
                                key={index}
                                className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2"
                            >
                                {niche}
                            </span>

                        ))}

                    </div>

                ) : (

                    <p className="text-muted mb-0">
                        No teaching niches added yet.
                    </p>

                )}

            </div>

        </section>
    )
}

export default TeachingNiche