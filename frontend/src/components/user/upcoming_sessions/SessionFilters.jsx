import React from 'react'

import {Search,} from 'lucide-react'

const SessionFilters=({search,setSearch,type,setType})=>{
    return (
        <div className="upcoming-filters mb-5">

            <div className="upcoming-search">

                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search sessions, mentors, or skills..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

            </div>


            <div className="upcoming-filter-group">

                <button
                    className={
                        type === 'ALL'
                            ? 'upcoming-filter active'
                            : 'upcoming-filter'
                    }
                    onClick={() =>
                        setType('ALL')
                    }
                >
                    All
                </button>


                <button
                    className={
                        type === 'MENTOR'
                            ? 'upcoming-filter active'
                            : 'upcoming-filter'
                    }
                    onClick={() =>
                        setType('MENTOR')
                    }
                >
                    Mentor
                </button>


                <button
                    className={
                        type === 'SKILL_EXCHANGE'
                            ? 'upcoming-filter active'
                            : 'upcoming-filter'
                    }
                    onClick={() =>
                        setType(
                            'SKILL_EXCHANGE'
                        )
                    }
                >
                    Skill Exchange
                </button>

            </div>

        </div>
    )
}

export default SessionFilters