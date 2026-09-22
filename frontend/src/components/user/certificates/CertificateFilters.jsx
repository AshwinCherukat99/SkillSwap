import {useMemo} from 'react'

function CertificateFilters({
    certificates=[],
    selectedCategory,
    setSelectedCategory
}){
    const categories=useMemo(()=>{
        return [
            ...new Set(
                certificates.map((certificate)=>certificate.course_category).filter(Boolean)
            )
        ]
    },[certificates])
    const getCategoryCount=(category)=>{
        return certificates.filter(
            (certificate)=>certificate.course_category===category
        ).length
    }
    return (
        <div className="mb-4">

            {/* Category filter */}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0 fw-semibold">
                    Filter by Category
                </h6>

                {/* Clear filter */}
                {selectedCategory !== "all" && (
                    <button
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none p-0"
                        onClick={() => setSelectedCategory("all")}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="d-flex gap-2 overflow-auto pb-2">

                {/* All categories */}
                <button
                    type="button"
                    className={`btn btn-sm rounded-pill flex-shrink-0 ${
                        selectedCategory === "all"
                            ? "btn-primary"
                            : "btn-light"
                    }`}
                    onClick={() => setSelectedCategory("all")}
                >
                    All ({certificates.length})
                </button>

                {/* Categories from database */}
                {categories.map((category) => (
                    <button
                        type="button"
                        key={category}
                        className={`btn btn-sm rounded-pill flex-shrink-0 ${
                            selectedCategory === category
                                ? "btn-primary"
                                : "btn-light"
                        }`}
                        onClick={() =>
                            setSelectedCategory(category)
                        }
                    >
                        {category} ({getCategoryCount(category)})
                    </button>
                ))}
            </div>

            {/* No categories available */}
            {categories.length === 0 && certificates.length === 0 && (
                <p className="text-muted small mb-0 mt-2">
                    No certificate categories available.
                </p>
            )}
        </div>
    )
}

export default CertificateFilters