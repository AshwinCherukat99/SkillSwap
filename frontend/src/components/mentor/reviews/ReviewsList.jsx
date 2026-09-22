import {useMemo} from 'react'
import ReviewCard from './ReviewCard'

const ReviewsList=({
    reviews=[],
    search,
    course,
    sort,
    onReply,
    replyLoading,
    replyError,
    onLoadMore,
    loadingMore,
    hasMore,
})=>{
    const filteredReviews=useMemo(()=>{
        let result=[...reviews]
        if (search.trim()){
            const searchValue=search.toLowerCase().trim()
            result=result.filter((review)=>review.student_name?.toLowerCase().includes(searchValue))
        }
        if (course!=='all'){
            result=result.filter(
                (review)=>String(review.course_id)===String(course)
            )
        }
        if (sort==='highest'){
            result.sort(
                (a,b)=>
                    Number(b.rating||0)-Number(a.rating||0)
            )
        }else if (sort==='lowest'){
            result.sort(
                (a,b)=>
                    Number(a.rating||0)-Number(b.rating||0)
            )
        }else{
            result.sort(
                (a,b)=>new Date(b.created_at)-new Date(a.created_at)
            )
        }
        return result
    },[reviews,search,sort,course])
    return (
        <div>

            {replyError && (
                <div className="alert alert-danger">
                    {replyError}
                </div>
            )}


            {filteredReviews.length === 0 ? (

                <div className="glass-card empty-reviews">

                    <i className="bi bi-chat-square-text fs-1"></i>

                    <h5 className="mt-3">
                        No reviews found
                    </h5>

                    <p className="text-muted mb-0">
                        Try changing your search or filters.
                    </p>

                </div>

            ) : (

                <div className="d-flex flex-column gap-3">

                    {filteredReviews.map((review) => (

                        <ReviewCard
                            key={review.id}
                            review={review}
                            onReply={onReply}
                            replyLoading={replyLoading}
                        />

                    ))}

                </div>

            )}


            {hasMore && (

                <div className="text-center mt-4">

                    <button
                        type="button"
                        className="btn load-more-btn"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                    >

                        {loadingMore ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                ></span>

                                Loading...
                            </>
                        ) : (
                            <>
                                Load More Reviews

                                <i className="bi bi-chevron-down ms-2"></i>
                            </>
                        )}

                    </button>

                </div>

            )}

        </div>
    )
}

export default ReviewsList