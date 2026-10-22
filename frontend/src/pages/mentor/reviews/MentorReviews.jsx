import {useState,useEffect} from 'react'
import MonthlyTrends from '../../../components/mentor/reviews/MonthlyTrends'
import RatingSummary from '../../../components/mentor/reviews/RatingSummary'
import ReviewsHeader from '../../../components/mentor/reviews/ReviewsHeader'
import ReviewsList from '../../../components/mentor/reviews/ReviewsList'
import ReviewStats from '../../../components/mentor/reviews/ReviewStats'
import ReviewToolbar from '../../../components/mentor/reviews/ReviewToolbar'

import './MentorReviews.css'

import mentorApi from '../../../services/mentorApi'

const MentorReviews=()=>{
    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [search,setSearch]=useState("")
    const [course,setCourse]=useState('all')
    const [sort,setSort]=useState('newest')
    const [replyLoading,setReplyLoading]=useState(null)
    const [replyError,setReplyError]=useState("")
    const [loadingMore,setLoadingMore]=useState(false)
    const fetchReviews=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await mentorApi.get(
                '/mentors/reviews/'
            )   
            console.log("MENTOR REVIEWS RESPONSE:", response.data)
            setData(response.data)
        }catch(err){
            console.error('failed to fetch mentor reviews:',err)  
            setError(err.response?.data?.detail||'unable to load reviews')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchReviews()
    },[])
    const handleReply=async (reviewId,message)=>{
        if (!message.trim()){
            return
        } 
        try{
            setReplyLoading(reviewId)
            setReplyError("")  
            await mentorApi.post(
                `/reviews/mentor/${reviewId}/reply/`,
                {
                    message:message.trim()
                }
            )
            await fetchReviews()
        }catch(err){
            console.error('failed to send reply:',err)
            setReplyError(
                err.response?.data?.detail||
                'unable to send reply'
            )
        }finally{
            setReplyLoading(null)
        }
    }
    const handleLoadMore=async ()=>{
        try{
            setLoadingMore(true)
            console.log('load more reviews')
        }finally{
            setLoading(false)
        }
    }
    if (loading){
        return (
            <div className="mentor-reviews-page">
                <div className="container-fluid py-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (error){
        return (
            <div className="mentor-reviews-page">
                <div className="container-fluid py-5">
                    <div className="alert alert-danger">
                        <strong>Error:</strong> {error}

                        <button
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={fetchReviews}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    const mentor=data?.mentor||{}
    const summary=data?.summary||{}
    return (
        <div className="mentor-reviews-page">

            <ReviewsHeader mentor={mentor} />


            <main className="mentor-reviews-content">

                {/* Rating Summary + Monthly Trends */}
                <section className="row g-4 mb-4">

                    <div className="col-12 col-lg-8">
                        <RatingSummary
                            mentor={mentor}
                            ratingDistribution={
                                data?.rating_distribution || {}
                            }
                        />
                    </div>

                    <div className="col-12 col-lg-4">
                        <MonthlyTrends
                            trends={
                                data?.monthly_trends || []
                            }
                            growth={summary.growth}
                        />
                    </div>

                </section>


                {/* KPI Cards */}
                <ReviewStats
                    mentor={mentor}
                    summary={summary}
                    ratingDistribution={
                        data?.rating_distribution || {}
                    }
                />


                {/* Reviews + Achievements */}
                <section className="row g-4 mt-1">

                    <div className="col-12 col-lg-8">

                        <ReviewToolbar
                            search={search}
                            setSearch={setSearch}
                            course={course}
                            setCourse={setCourse}
                            sort={sort}
                            setSort={setSort}
                            courses={data?.courses || []}
                        />


                        <ReviewsList
                            reviews={data?.reviews || []}
                            search={search}
                            course={course}
                            sort={sort}
                            onReply={handleReply}
                            replyLoading={replyLoading}
                            replyError={replyError}
                            onLoadMore={handleLoadMore}
                            loadingMore={loadingMore}
                            hasMore={data?.has_more || false}
                        />

                    </div>

                </section>

            </main>
        </div>
    )
}

export default MentorReviews