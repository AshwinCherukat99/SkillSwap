const Pagination=({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    totalCount
})=>{
    if (!totalPages||totalPages<=1){
        return null
    }
    const getPageNumbers=()=>{
        const pages=[]
        const maxVisible=5
        let start=Math.max(1,currentPage-2)
        let end=Math.min(totalPages,start+maxVisible-1)
        if (end-start<maxVisible-1){
            start=Math.max(1,end-maxVisible+1)
        }
        for (let page=start;page<=end;page++){
            pages.push(page)
        }
        return pages
    }
    const startRecord=(currentPage-1)*pageSize+1
    const endRecord=Math.min(currentPage*pageSize,totalCount)
    return (
        <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Record information */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                    Showing {startRecord}–{endRecord} of {totalCount}
                </span>

                {onPageSizeChange && (
                    <select
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value))
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-700"
                    >
                        {[10, 20, 50, 100].map(size => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">

                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Previous
                </button>

                {getPageNumbers().map(page => (
                    <button
                        type="button"
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`min-w-9 px-3 py-2 rounded-lg border text-sm ${
                            currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Next
                </button>

            </div>
        </div>
    )
}

export default Pagination