const RatingSummary=({
    mentor,
    ratingDistribution={}
})=>{
    const rating=Number(mentor?.rating||0)
    const totalReviews=Number(mentor?.total_reviews||0)
    const getCount=(star)=>{
        return Number(ratingDistribution?.[String(star)]||0)
    }
    const percentage=(star)=>{
        if (!totalReviews){
            return 0
        } 
        return Math.round((getCount(star)/totalReviews)*100)
    }
    return (
        <div className="glass-card review-card h-100 p-4 p-md-5">

            <div className="row align-items-center g-4">

                {/* Overall Rating */}
                <div className="col-12 col-md-4">

                    <div className="rating-overview">

                        <div className="display-rating">
                            {rating.toFixed(1)}
                        </div>

                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={
                                        star <= Math.round(rating)
                                            ? "bi bi-star-fill"
                                            : "bi bi-star"
                                    }
                                ></i>
                            ))}
                        </div>

                        <div className="rating-review-count">
                            {totalReviews.toLocaleString()} verified reviews
                        </div>

                    </div>

                </div>


                {/* Distribution */}
                <div className="col-12 col-md-8">

                    <h3 className="section-title mb-4">
                        Rating Distribution
                    </h3>


                    <div className="rating-distribution">

                        {[5, 4, 3, 2, 1].map((star) => (

                            <div
                                className="rating-row"
                                key={star}
                            >

                                <span className="rating-label">
                                    {star} Star
                                </span>


                                <div className="progress rating-progress">

                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${percentage(star)}%`,
                                        }}
                                    ></div>

                                </div>


                                <span className="rating-count">
                                    {getCount(star)}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RatingSummary