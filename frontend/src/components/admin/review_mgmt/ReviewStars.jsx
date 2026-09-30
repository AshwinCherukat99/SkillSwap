import React from "react";

const ReviewStars=({rating})=>{
    return (
        <div className="text-warning">

            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={
                        star <= rating
                            ? "bi bi-star-fill"
                            : "bi bi-star"
                    }
                ></i>
            ))}

            <span className="text-secondary ms-2 small">
                {rating}/5
            </span>

        </div>
    )
}

export default ReviewStars