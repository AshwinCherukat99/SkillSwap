import { use, useCallback, useState } from "react";          

const useAdminPagination=(initialPageSize=10)=>{
    const [currentPage,setCurrentPage]=useState(1)
    const [pageSize,setPageSize]=useState(initialPageSize)
    const [totalPages,setTotalPages]=useState(1)
    const [totalCount,setTotalCount]=useState(0)
    const updatePagination=(data)=>{
        setCurrentPage(data.current_page||1)
        setTotalPages(data.total_pages||1)
        setTotalCount(data.count||0)
    }
    const changePage=useCallback((page)=>{
        if (page>=1&&page<=totalPages){
            setCurrentPage(page)
        }
    })
    const changePageSize=useCallback((size)=>{
        setPageSize(size)
        setCurrentPage(1)
    })
    const resetPagination=useCallback(()=>{
        setCurrentPage(1)
    })
    return {
        currentPage,
        pageSize,
        totalPages,
        totalCount,
        updatePagination,
        changePage,
        changePageSize,
        resetPagination
    }
} 

export default useAdminPagination