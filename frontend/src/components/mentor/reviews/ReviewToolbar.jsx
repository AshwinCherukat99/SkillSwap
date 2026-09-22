import React from "react"

const ReviewToolbar=({
    search,
    setSearch,
    course,
    setCourse,
    sort,
    setSort,
    courses=[],
})=>{
    return (
        <div className="glass-card review-toolbar mb-4">

            <div className="row g-3 align-items-center">

                <div className="col-12 col-md">

                    <div className="search-wrapper">

                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filter by learner name..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                <div className="col-12 col-md-auto">

                    <select
                        className="form-select review-filter"
                        value={course}
                        onChange={(e) =>
                            setCourse(e.target.value)
                        }
                    >

                        <option value="all">
                            All Courses
                        </option>

                        {courses.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.title}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="col-12 col-md-auto">

                    <select
                        className="form-select review-filter"
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                    >

                        <option value="newest">
                            Newest First
                        </option>

                        <option value="highest">
                            Highest Rating
                        </option>

                        <option value="lowest">
                            Lowest Rating
                        </option>

                    </select>

                </div>

            </div>

        </div>
    )
}

export default ReviewToolbar