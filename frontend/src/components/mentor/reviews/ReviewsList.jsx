import {useMemo} from 'react'
import ReviewCard from './ReviewCard'

const ReviewsList=({
    reviews=[],
    onReply,
    replyLoading,
    replyError,
})=>{
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

                    {reviews.map((review) => (

                        <ReviewCard
                            key={review.id}
                            review={review}
                            onReply={onReply}
                            replyLoading={replyLoading}
                        />

                    ))}

                </div>

            )}

        </div>
    )
}

export default ReviewsList