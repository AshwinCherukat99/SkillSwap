const StorySearch=({search,setSearch})=>{
    return (
        <div className="stories-search-wrapper">
            <div className="stories-search">
                <span className="material-symbols-outlined">
                    search
                </span>

                <input
                    type="text"
                    placeholder="Search people and stories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="stories-search-clear"
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default StorySearch