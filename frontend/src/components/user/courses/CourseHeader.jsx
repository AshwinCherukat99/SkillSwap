function CourseHeader({search,setSearch}){
    return (
        <header className="course-header">

            <div className="course-header-content">

                <h1>
                    My Courses
                </h1>

                <p>
                    Continue learning, discover courses tailored
                    for you, and explore what other learners are loving.
                </p>

            </div>

            <div className="row g-3 mt-2">

                <div className="col-12 col-md-8 col-lg-7">

                    <div className="course-search">

                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for courses, skills, or instructors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                </div>

                <div className="col-12 col-md-auto">

                    <button
                        type="button"
                        className="btn course-filter-btn"
                    >
                        <i className="bi bi-sliders me-2"></i>
                        Filters
                    </button>

                </div>

            </div>

        </header>
    )
}

export default CourseHeader