import React,{useEffect,useMemo,useState} from "react";

import adminApi from "../../../services/adminApi";

import './AdminReviewManagement.css'

import ReviewStats from "../../../components/admin/review_mgmt/ReviewStats";
import ReviewFilters from "../../../components/admin/review_mgmt/ReviewFilters";
import ReviewList from "../../../components/admin/review_mgmt/ReviewList";
import ReviewReportsModal from "../../../components/admin/review_mgmt/ReviewReportsModal";

const AdminReviewManagement=()=>{
    const [reviews,setReviews]=useState([])
    const [stats,setStats]=useState({
        total_reviews:0,
        visible_reviews:0,
        hidden_reviews:0,
        reported_reviews:0,
    })
    const [search,setSearch]=useState('')
    const [rating,setRating]=useState('all')
    const [visibility,setVisibility]=useState('all')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [selectedReview,setSelectedReview]=useState(null)
    const fetchReviews=async ()=>{
        try{
            setLoading(true)
            setError('')
            const params={}
            if (search.trim()){
                params.search=search.trim()
            }
            if (rating!=='all'){
                params.rating=rating
            }
            if (visibility!=='all'){
                params.visibility=visibility
            }
            const response=await adminApi.get(
                '/admin/reviews/',
                {params}
            )
            setReviews(response.data.reviews||[])
            setStats(
                response.data.stats||{
                    total_reviews:0,
                    visible_reviews:0,
                    hidden_reviews:0,
                    reported_reviews:0,
                }
            )
        }catch(err){
            console.error('faile to fetch reviews:',err)
            setError(err.response?.data?.error||err.response?.data?.detail||'failed to load reviews')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        const timer=setTimeout(()=>{
            fetchReviews()
        },300)
        return ()=>clearTimeout(timer)
    },[search,rating,visibility])
    const hideReview=async (review)=>{
        const confirmed=window.confirm(
            'are you sure you want to hide this review?'
        )
        if (!confirmed){
            return
        }
        try{
            await adminApi.patch(
                `/admin/reviews/${review.id}/hide/`
            )
            await fetchReviews()
        }catch(err){
            console.error('failed to hide review:',err)
            alert(err.reponse?.data?.error||'failed to hide review')
        }
    }
    const restoreReview=async (review)=>{
        try{
            await adminApi.patch(
                `/admin/reviews/${review.id}/reveal/`
            )
            await fetchReviews()
        }catch(err){
            console.error('failed to reveal review:',err)
            alert(err.response?.data?.error||'failed to reveal review')
        }
    }
    const deleteReview=async (review)=>{
        const confirmed=window.confirm('remove this review permanently? this action cannot be undone')
        if (!confirmed){
            return
        }
        try{
            await adminApi.delete(
                `/admin/reviews/${review.id}/`
            )
            await fetchReviews()
        }catch(err){
            console.error('failed to remove review-',err)
            alert(err.response?.data?.error||'failed to remove review')
        }
    }
    const viewReports=(review)=>{
        setSelectedReview(review)
    }
    return (
        <div className="container-fluid py-4">

            {/* Header */}

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Review Management
                    </h2>

                    <p className="text-secondary mb-0">
                        Monitor, moderate and manage
                        user reviews.
                    </p>

                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={fetchReviews}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>

            </div>

            {/* Stats */}

            <ReviewStats
                stats={stats}
            />

            {/* Error */}

            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">

                    <span>
                        {error}
                    </span>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={fetchReviews}
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* Filters */}

            <ReviewFilters
                search={search}
                setSearch={setSearch}
                rating={rating}
                setRating={setRating}
                visibility={visibility}
                setVisibility={setVisibility}
            />

            {/* Reviews */}

            <ReviewList
                reviews={reviews}
                loading={loading}
                onHide={hideReview}
                onRestore={restoreReview}
                onDelete={deleteReview}
                onViewReports={viewReports}
            />

            {/* Reports modal */}

            {selectedReview && (
                <ReviewReportsModal
                    review={selectedReview}
                    onClose={() =>
                        setSelectedReview(null)
                    }
                />
            )}

        </div>
    )
}

export default AdminReviewManagement