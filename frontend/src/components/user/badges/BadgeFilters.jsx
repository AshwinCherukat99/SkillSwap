function BadgeFilters({activeFilter,setActiveFilter}){
    return (
        <div className="badge-filters">

            <button
                className={
                    activeFilter === "all"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setActiveFilter("all")
                }
            >

                All

            </button>


            <button
                className={
                    activeFilter === "earned"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setActiveFilter("earned")
                }
            >

                Earned

            </button>


            <button
                className={
                    activeFilter === "locked"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setActiveFilter("locked")
                }
            >

                Locked

            </button>

        </div>
    )
}

export default BadgeFilters