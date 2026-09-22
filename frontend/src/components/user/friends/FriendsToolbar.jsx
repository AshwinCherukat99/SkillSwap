import React from 'react'

import {Search,ArrowDownUp} from 'lucide-react'

const FriendsToolbar=({
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort
})=>{
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-3">

                <div className="row g-3 align-items-center">

                    {/* Search */}
                    <div className="col-12 col-lg-5">

                        <div className="input-group">

                            <span className="input-group-text bg-light border-end-0">
                                <Search size={18} />
                            </span>

                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Search friends by name or skill..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>


                    {/* Filters */}
                    <div className="col-12 col-lg-7">

                        <div className="d-flex flex-wrap gap-2 align-items-center">

                            <button
                                className={`btn btn-sm rounded-pill ${
                                    filter === 'all'
                                        ? 'btn-primary'
                                        : 'btn-outline-secondary'
                                }`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>

                            <button
                                className={`btn btn-sm rounded-pill ${
                                    filter === 'online'
                                        ? 'btn-primary'
                                        : 'btn-outline-secondary'
                                }`}
                                onClick={() => setFilter('online')}
                            >
                                Online
                            </button>

                            <button
                                className={`btn btn-sm rounded-pill ${
                                    filter === 'same_skills'
                                        ? 'btn-primary'
                                        : 'btn-outline-secondary'
                                }`}
                                onClick={() => setFilter('same_skills')}
                            >
                                Same Skills
                            </button>

                            <button
                                className={`btn btn-sm rounded-pill ${
                                    filter === 'mentors'
                                        ? 'btn-primary'
                                        : 'btn-outline-secondary'
                                }`}
                                onClick={() => setFilter('mentors')}
                            >
                                Mentors
                            </button>

                            <button
                                className="btn btn-sm btn-outline-secondary ms-lg-auto"
                                onClick={() =>
                                    setSort(
                                        sort === 'name' ? '-name' : 'name'
                                    )
                                }
                            >
                                <ArrowDownUp size={15} className="me-1" />
                                Sort by Name
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default FriendsToolbar