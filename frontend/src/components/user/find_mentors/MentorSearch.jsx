import React from 'react'

function MentorSearch({search,onSearch}){
    return (
        <div className="msb">

            <i className="bi bi-search msb-icon"></i>

            <input
                type="text"
                className='msb-input'
                placeholder="Search mentors"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
            />

            {search && (
                <button
                    type="button"
                    className='msb-clear'
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