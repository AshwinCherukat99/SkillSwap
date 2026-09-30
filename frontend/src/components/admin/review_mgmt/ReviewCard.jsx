import React from "react";
import ReviewStars from "./ReviewStars";
import ReviewActionMenu from "./ReviewActionMenu";

const ReviewCard=({
    review,
    onHide,
    onRestore,
    onDelete,
    onViewReports,
})=>{
    const reviewerInitials=(
        review.reviewer_name||
        review.reviewer_username||
        'U'
    ).split(' ').map((word)=>word[0]).join('').slice(0,2).toUpperCase()
    const date=review.created_at?new Date(review.created_at).toLocaleDateString():''
    return (
        <div className="card border-0 shadow-sm mb-3">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                    <div className="d-flex gap-3">

                        <div
                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{
                                width: "48px",
                                height: "48px",
                            }}
                        >
                            {reviewerInitials}
                        </div>

                        <div>

                            <h6 className="fw-bold mb-1">
                                {review.reviewer_name}
                            </h6>

                            <div className="small text-secondary">
                                @{review.reviewer_username}
                            </div>

                        </div>

                    </div>

                    <ReviewActionMenu
                        review={review}
                        onHide={onHide}
                        onRestore={onRestore}
                        onDelete={onDelete}
                        onViewReports={onViewReports}
                    />

                </div>

                <div className="mt-3">

                    <div className="d-flex flex-wrap gap-2 align-items-center">

                        <ReviewStars
                            rating={review.rating}
                        />

                        {review.is_hidden && (
                            <span className="badge bg-warning-subtle text-warning-emphasis">
                                <i className="bi bi-eye-slash me-1"></i>
                                Hidden
                            </span>
                        )}

                        {review.report_count > 0 && (
                            <span className="badge bg-danger-subtle text-danger">
                                <i className="bi bi-flag me-1"></i>
                                {review.report_count} Report
                                {review.report_count !== 1
                                    ? "s"
                                    : ""}
                            </span>
                        )}

                    </div>

                </div>

                <div className="mt-3">

                    {review.review ? (

                        <p
                            className={`mb-3 ${
                                review.is_hidden
                                    ? "text-secondary"
                                    : "text-dark"
                            }`}
                        >
                            {review.review}
                        </p>

                    ) : (

                        <p className="text-secondary fst-italic mb-3">
                            No written review.
                        </p>

                    )}

                </div>

                <div className="border-top pt-3">

                    <div className="d-flex flex-wrap justify-content-between gap-2">

                        <div className="small text-secondary">

                            <i className="bi bi-person me-1"></i>

                            Review for{" "}

                            <strong>
                                {review.reviewed_user_name}
                            </strong>

                        </div>

                        <div className="small text-secondary">
                            {date}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default ReviewCard