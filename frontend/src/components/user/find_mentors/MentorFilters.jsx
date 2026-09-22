import React, { useState } from "react";

function MentorFilters({
    filters,
    onFilterChange,
    onClearFilters,
    courses = [],
}) {

    const [courseSearch, setCourseSearch] = useState("");
    const [showCourseSuggestions, setShowCourseSuggestions] =
        useState(false);


    // =========================================
    // COURSE SUGGESTIONS
    // =========================================

    const normalizedCourseSearch =
        courseSearch.trim().toLowerCase();

    const courseSuggestions = courses.filter((course) => {

        const courseName =
            typeof course === "string"
                ? course
                : course.name || "";

        return courseName
            .toLowerCase()
            .includes(normalizedCourseSearch);

    }).slice(0, 8);


    const handleCourseSelect = (course) => {

        const courseName =
            typeof course === "string"
                ? course
                : course.name;

        setCourseSearch(courseName);

        onFilterChange(
            "course",
            courseName
        );

        setShowCourseSuggestions(false);
    };


    const handleCourseInput = (event) => {

        const value = event.target.value;

        setCourseSearch(value);

        /*
         * Don't immediately apply arbitrary text as
         * a course filter. The user selects a suggestion.
         */

        if (!value.trim()) {
            onFilterChange("course", "");
        }

        setShowCourseSuggestions(true);
    };


    return (
        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h5 className="mb-0">
                        Filters
                    </h5>

                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => {
                            setCourseSearch("");
                            onClearFilters();
                        }}
                    >
                        Reset
                    </button>

                </div>


                {/* =================================
                    COURSE / SKILL
                ================================= */}

                <div className="mb-4 position-relative">

                    <label
                        className="form-label fw-semibold"
                        htmlFor="course-search"
                    >
                        Course / Skill
                    </label>

                    <input
                        id="course-search"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Python"
                        value={courseSearch}
                        onChange={handleCourseInput}
                        onFocus={() =>
                            setShowCourseSuggestions(true)
                        }
                        autoComplete="off"
                    />


                    {showCourseSuggestions &&
                        normalizedCourseSearch &&
                        courseSuggestions.length > 0 && (

                        <div className="course-suggestions">

                            {courseSuggestions.map((course) => {

                                const courseName =
                                    typeof course === "string"
                                        ? course
                                        : course.name;

                                const courseId =
                                    typeof course === "string"
                                        ? courseName
                                        : course.id;

                                return (
                                    <button
                                        type="button"
                                        key={courseId}
                                        className="course-suggestion-item"
                                        onClick={() =>
                                            handleCourseSelect(course)
                                        }
                                    >
                                        <i className="bi bi-book me-2"></i>

                                        {courseName}
                                    </button>
                                );

                            })}

                        </div>

                    )}

                </div>


                {/* =================================
                    EXPERIENCE
                ================================= */}

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Experience
                    </label>

                    <select
                        className="form-select"
                        value={filters.experience}
                        onChange={(event) =>
                            onFilterChange(
                                "experience",
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            Any experience
                        </option>

                        <option value="1-3">
                            1–3 yrs
                        </option>

                        <option value="3-5">
                            3–5 yrs
                        </option>

                        <option value="5-10">
                            5–10 yrs
                        </option>

                        <option value="10+">
                            10+ yrs
                        </option>

                    </select>

                </div>


                {/* =================================
                    QUALIFICATION
                ================================= */}

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Qualification
                    </label>

                    <select
                        className="form-select"
                        value={filters.qualification}
                        onChange={(event) =>
                            onFilterChange(
                                "qualification",
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            Any Degree
                        </option>

                        <option value="btech">
                            B.Tech
                        </option>

                        <option value="mtech">
                            M.Tech
                        </option>

                        <option value="bsc">
                            B.Sc
                        </option>

                        <option value="msc">
                            M.Sc
                        </option>

                        <option value="bca">
                            BCA
                        </option>

                        <option value="mca">
                            MCA
                        </option>

                        <option value="be">
                            B.E
                        </option>

                        <option value="me">
                            M.E
                        </option>

                        <option value="phd">
                            PhD
                        </option>

                    </select>

                </div>


                {/* =================================
                    AVERAGE RATING
                ================================= */}

                <div className="mb-2">

                    <label className="form-label fw-semibold">
                        Minimum Rating
                    </label>

                    <div className="rating-filter">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <button
                                key={star}
                                type="button"
                                className={`rating-star ${
                                    filters.rating >= star
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    onFilterChange(
                                        "rating",
                                        star
                                    )
                                }
                                aria-label={`${star} stars and above`}
                            >
                                <i className="bi bi-star-fill"></i>
                            </button>

                        ))}

                    </div>

                    {filters.rating > 0 && (
                        <div className="small text-muted mt-1">
                            {filters.rating}.0+ rating
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default MentorFilters;