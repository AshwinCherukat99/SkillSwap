import { useState } from "react"

function CourseHeader({search,setSearch,filters,setFilters,categories}){
    const [showFilters,setShowFilters]=useState(false)
    const handleFilterChange=(field,value)=>{
        setFilters(previous=>({
            ...previous,
            [field]:value
        }))
    }
    const clearFilters=()=>{
        setFilters({
            level:'',
            category:'',
            published:'',
            duration:'',
        })
    }
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
                        onClick={setShowFilters(!showFilters)}
                    >
                        <i className="bi bi-sliders me-2"></i>
                        <i className={`bi ms-2 ${showFilers?'bi-chevron-up':'bi-chevron-down'}`}></i>
                        Filters
                    </button>

                </div>

            </div>

            {showFilters&&(
                <div className="course-filter-panel mt-3">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label">
                                Course Level
                            </label>
                            <select
                            className="form-select"
                            value={filters.level}
                            onChange={(e)=>
                                handleFilterChange('level',e.target.value)
                            }>
                                <option value="">All Levels</option>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label">
                                Category
                            </label>
                            <select
                            className="form-select"
                            value={filters.category}
                            onChange={(e)=>
                                handleFilterChange('category',e.target.value)
                            }>
                                <option value="">All Categories</option> 
                                {categories.map(category=>(
                                    <option
                                    key={category.id}
                                    value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                                <label className='form-label'>
                                    Published Date
                                </label>
                                <select
                                className='form-select'
                                value={filters.published}
                                onChange={(e)=>
                                    handleFilterChange('published',e.target.value)
                                }>
                                    <option value="">Any Time</option>
                                    <option value="LATEST">Latest First</option>
                                    <option value="7_DAYS">Last 7 Days</option>
                                    <option value="30_DAYS">Last 30 Days</option>
                                    <option value="OLDER">Older Courses</option>
                                </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                                <label className="form-label">
                                    Estimated Duration
                                </label>
                                <select 
                                className="form-select"
                                value={filters.duration}
                                onChange={(e)=>
                                    handleFilterChange('duration',e.target.value)
                                }
                                >
                                    <option value="">Any Duration</option>
                                    <option value="SHORT">Under 1 Hour</option>
                                    <option value="MEDIUM">1-3 Hours</option>
                                    <option value="LONG">Over 3 Hours</option>
                                </select>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                                <button
                                type='button-type'
                                className="btn btn-outline-secondary"
                                onClick={clearFilters}>
                                    Clear Filters
                                </button>
                        </div>
                    </div>
                </div>
            )}

        </header>
    )
}

export default CourseHeader