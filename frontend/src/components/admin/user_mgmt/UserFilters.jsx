import React from "react";

const UserFilters=({
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus
})=>{
    const filters=[
        {
            label:'All',
            value:'ALL',
        },
        {
            label:'Active',
            value:'ACTIVE',
        },
        {
            label:'Blocked',
            value:'BLOCKED',
        },
        {
            label:'Suspended',
            value:'SUSPENDED',
        },
    ]
    return (
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between mb-4">

            <div className="d-flex flex-wrap gap-2">

                {filters.map((filter) => (

                    <button
                        key={filter.value}
                        type="button"
                        className={
                            selectedStatus === filter.value
                                ? 'btn btn-primary rounded-pill px-4'
                                : 'btn btn-light border rounded-pill px-4'
                        }
                        onClick={() =>
                            setSelectedStatus(
                                filter.value
                            )
                        }
                    >
                        {filter.label}
                    </button>

                ))}

            </div>


            <div
                className="position-relative"
                style={{
                    minWidth: '280px'
                }}
            >

                <i
                    className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted"
                ></i>

                <input
                    type="search"
                    className="form-control ps-5"
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

            </div>

        </div>
    )
}

export default UserFilters