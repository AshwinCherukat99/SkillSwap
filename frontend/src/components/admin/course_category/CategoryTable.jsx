const CategoryTable=({
    categories,
    search,
    setSearch,
    sort,
    setSort,
    onEdit,
    onDelete
})=>{
    return (
        <div className="card border-0 shadow-sm category-table-card">

            <div className="card-body p-0">

                {/* Table Header */}

                <div className="p-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">

                    <div>
                        <h5 className="fw-bold mb-1">
                            All Categories
                        </h5>

                        <p className="text-muted small mb-0">
                            Manage the categories used to organize SkillSwap courses.
                        </p>
                    </div>

                    <div className="d-flex flex-wrap gap-2">

                        <div className="input-group category-search">

                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search"></i>
                            </span>

                            <input
                                type="text"
                                className="form-control bg-light border-start-0"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                        <select
                            className="form-select category-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="most">Most Courses</option>
                            <option value="fewest">Fewest Courses</option>
                            <option value="az">Name: A–Z</option>
                            <option value="za">Name: Z–A</option>
                        </select>

                    </div>

                </div>

                {/* Table */}

                <div className="table-responsive">

                    <table className="table align-middle mb-0 category-table">

                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Number of Courses</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {categories.length === 0 ? (

                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <i className="bi bi-folder2-open fs-1 text-muted"></i>

                                        <h6 className="mt-3 fw-semibold">
                                            No categories found
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            Try changing your search.
                                        </p>
                                    </td>
                                </tr>

                            ) : (

                                categories.map((category) => {

                                    const count = Number(
                                        category.course_count ??
                                        category.courses_count ??
                                        0
                                    );

                                    return (
                                        <tr key={category.id}>

                                            <td>

                                                <div className="d-flex align-items-center gap-3">

                                                    <div className={`category-folder-icon ${count === 0 ? "empty" : ""}`}>
                                                        <i className="bi bi-folder-fill"></i>
                                                    </div>

                                                    <span className="fw-semibold">
                                                        {category.name}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <span className={`course-count-badge ${count === 0 ? "zero" : ""}`}>

                                                    <i className={`bi ${count === 0 ? "bi-hourglass" : "bi-journal-text"} me-1`}></i>

                                                    {count} {count === 1 ? "course" : "courses"}

                                                </span>

                                            </td>

                                            <td className="text-end">

                                                <button
                                                    className="btn btn-sm category-action-edit me-2"
                                                    title="Edit Category"
                                                    onClick={() => onEdit(category)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm category-action-delete"
                                                    title="Delete Category"
                                                    onClick={() => onDelete(category)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </td>

                                        </tr>
                                    );
                                })

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="px-4 py-3 border-top bg-light-subtle">

                    <span className="text-muted small">
                        Showing {categories.length} categories
                    </span>

                </div>

            </div>

        </div>
    )
}

export default CategoryTable