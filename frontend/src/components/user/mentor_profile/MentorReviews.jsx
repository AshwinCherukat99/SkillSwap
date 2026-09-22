import {useState,useEffect} from 'react'

import api from '../../../services/api'

function MentorReviews({mentor}){
    const [review,setReview]=useState('')
    const [reviews,setReviews]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [submitting,setSubmitting]=useState(false)
    const [submitError,setSubmitError]=useState('')
    const [submitSuccess,setSubmitSuccess]=useState('')
    const [rating,setRating]=useState(0)
    useEffect(()=>{
        const fetchReviews=async ()=>{
            try{
                const response=await api.get(
                    `/mentors/${mentor.id}/reviews/`
                )
                setReviews(response.data.reviews||[])
            }catch(error){
                console.error('failed to load mentor reviews:',error)
                setError('unable to load mentor reviews')
            }finally{
                setLoading(false)
            }
        }
        if (mentor?.id){
                fetchReviews()
            }
    },[mentor?.id])
    const formatDate=(date)=>{
        if (!date){
            return ''
        }
        return new Date(date).toLocaleDateString(
            'en-IN',{
                day:'numeric',
                month:'short',
                year:'numeric',
            }
        )
    }
    const renderStars=(rating)=>{
        return (
            <div className="text-warning">

                {[1, 2, 3, 4, 5].map((star) => (

                    <span
                        key={star}
                        className="material-symbols-outlined"
                        style={{
                            fontSize: "18px",
                            fontVariationSettings:
                                star <= rating
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                        }}
                    >
                        star
                    </span>

                ))}

            </div>
        )
    }
    const handleSubmitReview=async (e)=>{
        e.preventDefault()
        setSubmitError('')
        setSubmitSuccess('')
        if (rating<1 || rating>5){
            setSubmitError(
                'please submit a rating between 1 and 5'
            )
            return
        }
        try{
            setSubmitting(true)
            const response=await api.post(
                `/mentors/${mentor.id}/reviews/`,
                {
                    'rating':rating,
                    'review':review.trim(),
                }
            )
            setSubmitSuccess(
                response.data.message||
                'review submitted successfully'
            )
            setRating(0)
            setReview('')
            const reviewsResponse=await api.get(
                `/mentors/${mentor.id}/reviews/`
            )
            setReviews(reviewsResponse.data.reviews)
        }catch(error){
            console.error('failed to submit mentor review:',error)
            setError(error.response?.data?.error||'unable to submit review')
        }finally{
            setSubmitting(false)
        }
    }
    return (
        <section className="card border-0 shadow-sm">

            <div className="card-body p-4 p-md-5">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <div className="d-flex align-items-center gap-2">

                            <span className="material-symbols-outlined text-primary">
                                reviews
                            </span>

                            <h2 className="h5 fw-bold mb-0">
                                Reviews & Ratings
                            </h2>

                        </div>

                        <p className="small text-muted mb-0 mt-1">
                            Feedback from SkillSwap learners
                        </p>

                    </div>

                    <span className="badge bg-light text-dark">
                        {mentor.total_reviews} Reviews
                    </span>

                </div>


                {/* Rating Summary */}

                <div className="bg-light rounded-3 p-4 mb-4">

                    <div className="row align-items-center">

                        <div className="col-md-4 text-center">

                            <div className="display-5 fw-bold">
                                {mentor.rating}
                            </div>

                            {renderStars(
                                Math.round(
                                    Number(mentor.rating)
                                )
                            )}

                            <small className="text-muted">
                                Based on {mentor.total_reviews} reviews
                            </small>

                        </div>


                        <div className="col-md-8 mt-3 mt-md-0">

                            <div className="d-flex align-items-center gap-2 mb-2">

                                <span className="small text-muted">
                                    5
                                </span>

                                <div className="progress flex-grow-1"
                                    style={{ height: "8px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: "0%" }}
                                    />
                                </div>

                            </div>


                            <div className="d-flex align-items-center gap-2 mb-2">

                                <span className="small text-muted">
                                    4
                                </span>

                                <div className="progress flex-grow-1"
                                    style={{ height: "8px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: "0%" }}
                                    />
                                </div>

                            </div>


                            <div className="d-flex align-items-center gap-2 mb-2">

                                <span className="small text-muted">
                                    3
                                </span>

                                <div className="progress flex-grow-1"
                                    style={{ height: "8px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: "0%" }}
                                    />
                                </div>

                            </div>


                            <div className="d-flex align-items-center gap-2 mb-2">

                                <span className="small text-muted">
                                    2
                                </span>

                                <div className="progress flex-grow-1"
                                    style={{ height: "8px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: "0%" }}
                                    />
                                </div>

                            </div>


                            <div className="d-flex align-items-center gap-2">

                                <span className="small text-muted">
                                    1
                                </span>

                                <div className="progress flex-grow-1"
                                    style={{ height: "8px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        style={{ width: "0%" }}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Loading */}

                {loading && (

                    <div className="text-center py-4">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}

                <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h5 className="fw-bold mb-3">
                        Write a Review
                    </h5>


                    {submitSuccess && (
                        <div className="alert alert-success">
                            {submitSuccess}
                        </div>
                    )}


                    {submitError && (
                        <div className="alert alert-danger">
                            {submitError}
                        </div>
                    )}


                    <form onSubmit={handleSubmitReview}>

                        {/* Rating */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Your Rating
                            </label>

                            <div className="d-flex gap-1">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        className="btn p-0 fs-3"
                                        onClick={() => setRating(star)}
                                        style={{
                                            color:
                                                star <= rating
                                                    ? "#ffc107"
                                                    : "#ced4da"
                                        }}
                                    >
                                        ★
                                    </button>

                                ))}

                            </div>

                        </div>


                        {/* Review */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Your Review
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Share your experience with this mentor..."
                                value={review}
                                onChange={(e) =>
                                    setReview(e.target.value)
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}

                        </button>

                    </form>

                </div>

            </div>


                {/* No Reviews */}

                {!loading &&
                    !error &&
                    reviews.length === 0 && (

                        <div className="text-center py-5">

                            <span className="material-symbols-outlined text-muted fs-1">
                                rate_review
                            </span>

                            <h5 className="mt-2">
                                No Reviews Yet
                            </h5>

                            <p className="text-muted mb-0">
                                This mentor hasn't received any reviews yet.
                            </p>

                        </div>

                    )}


                {/* Reviews */}

                {!loading &&
                    !error &&
                    reviews.length > 0 && (

                        <div className="d-flex flex-column gap-3">

                            {reviews.map((review) => (

                                <div
                                    key={review.id}
                                    className="border rounded-3 p-4"
                                >

                                    {/* Reviewer */}

                                    <div className="d-flex justify-content-between">

                                        <div className="d-flex align-items-center gap-3">

                                            <div>

                                                <h6 className="fw-bold mb-0">
                                                    {review.reviewer_name}
                                                </h6>

                                                <small className="text-muted">
                                                    @{review.reviewer_username}
                                                </small>

                                            </div>

                                        </div>


                                        <small className="text-muted">
                                            {formatDate(
                                                review.created_at
                                            )}
                                        </small>

                                    </div>


                                    {/* Rating */}

                                    <div className="d-flex align-items-center gap-2 mt-3">

                                        {renderStars(
                                            review.rating
                                        )}

                                        <span className="small fw-semibold">
                                            {review.rating}/5
                                        </span>

                                    </div>


                                    {/* Review text */}

                                    {review.review && (

                                        <p className="text-muted mt-2 mb-0 lh-lg">
                                            {review.review}
                                        </p>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

            </div>

        </section>
    )
}

export default MentorReviews