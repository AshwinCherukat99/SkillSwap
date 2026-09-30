import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewList=({
    reviews,
    loading,
    onHide,
    onRestore,
    onDelete,
    onViewReports,
})=>{
    if (loading){
        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="text-secondary mt-3">
                    Loading reviews...
                </p>

            </div>
        )
    }
    if (!reviews.length){
        return (
            <div className="card border-0 shadow-sm">

                <div className="card-body text-center py-5">

                    <i className="bi bi-chat-square-text fs-1 text-secondary"></i>

                    <h5 className="mt-3">
                        No reviews found
                    </h5>

                    <p className="text-secondary mb-0">
                        Reviews matching your filters will
                        appear here.
                    </p>

                </div>

            </div>
        )
    }
    return (
        <div>

            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onHide={onHide}
                    onRestore={onRestore}
                    onDelete={onDelete}
                    onViewReports={onViewReports}
                />
            ))}

        </div>
    )
}

export default ReviewList