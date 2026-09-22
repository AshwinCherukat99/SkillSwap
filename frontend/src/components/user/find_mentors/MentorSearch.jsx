import React from 'react'

function MentorSearch({search,onSearch}){
    return (
        <div className="mentor-search">

            <i className="bi bi-search"></i>

            <input
                type="text"
                placeholder="Search mentors, skills, or topics..."
                value={search}
                onChange={(event) => onSearch(event.target.value)}
            />

            {search && (
                <button
                    type="button"
                    className="btn btn-link text-muted p-0"
                    onClick={() => onSearch("")}
                    aria-label="Clear search"
                >
                    <i className="bi bi-x-circle"></i>
                </button>
            )}

        </div>
    )
}

export default MentorSearch