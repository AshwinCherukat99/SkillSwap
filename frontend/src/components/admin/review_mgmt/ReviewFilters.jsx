import React from "react";

const ReviewFilters=({
    search,
    setSearch,
    rating,
    setRating,
    visibility,
    setVisibility
})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                <div className="row g-3">

                    <div className="col-12 col-lg-6">

                        <label className="form-label">
                            Search Reviews
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search reviewer, user or review..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="col-12 col-md-6 col-lg-3">

                        <label className="form-label">
                            Rating
                        </label>

                        <select
                            className="form-select"
                            value={rating}
                            onChange={(e) =>
                                setRating(e.target.value)
                            }
                        >
                            <option value="all">
                                All Ratings
                            </option>

                            <option value="5">
                                5 Stars
                            </option>

                            <option value="4">
                                4 Stars
                            </option>

                            <option value="3">
                                3 Stars
                            </option>

                            <option value="2">
                                2 Stars
                            </option>

                            <option value="1">
                                1 Star
                            </option>
                        </select>

                    </div>

                    <div className="col-12 col-md-6 col-lg-3">

                        <label className="form-label">
                            Visibility
                        </label>

                        <select
                            className="form-select"
                            value={visibility}
                            onChange={(e) =>
                                setVisibility(e.target.value)
                            }
                        >
                            <option value="all">
                                All Reviews
                            </option>

                            <option value="visible">
                                Visible
                            </option>

                            <option value="hidden">
                                Hidden
                            </option>
                        </select>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default ReviewFilters