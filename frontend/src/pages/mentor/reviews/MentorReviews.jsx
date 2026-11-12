import {useState,useEffect,useCallback} from 'react'
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
    const [rating,setRating]=useState('all')
    const [sort,setSort]=useState('newest')
    const [months,setMonths]=useState(6)
    const [replyLoading,setReplyLoading]=useState(null)
    const [replyError,setReplyError]=useState("")
    const fetchReviews=useCallback(async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await mentorApi.get(
                '/mentors/reviews/',
                {
                    params:{
                        search:search,
                        course:course,
                        rating:rating,
                        sort:sort,
                        months:months
                    }
                }
            )   
            console.log("MENTOR REVIEWS RESPONSE:", response.data)
            setData(response.data)
        }catch(err){
            console.error('failed to fetch mentor reviews:',err)  
            setError(err.response?.data?.detail||'unable to load reviews')
        }finally{
            setLoading(false)
        }
    },[search,course,rating,sort,months])
    useEffect(()=>{
        fetchReviews()
    },[fetchReviews])
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
                    mentor_reply:message.trim()
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
    if (loading && !data){
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
    if (error && !data){
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
    const stats=data?.stats||[]
    const ratingDistribution=data?.rating_distribution||[]
    const monthlyTrends=data?.monthly_trends||[]
    const reviews=data?.reviews||[]
    const courses=data?.courses||[]
    const hiddenReviews=data?.hidden_reviews||[]
    return (
        <div className="mentor-reviews-page">

            <ReviewsHeader mentor={data?.mentor||{}} />


            <main className="mentor-reviews-content">

                {/* Rating Summary + Monthly Trends */}
                <section className="row g-4 mb-4">

                    <div className="col-12 col-lg-8">
                        <RatingSummary
                            rating={stats.overall_rating||0}     
                            totalReviews={stats.total_reviews||0}
                            ratingDistribution={ratingDistribution}
                        />
                    </div>

                    <div className="col-12 col-lg-4">
                        <MonthlyTrends
                            trends={monthlyTrends}
                            growth={stats.growth||0}
                            months={months}
                            setMonths={setMonths}
                        />
                    </div>

                </section>


                {/* KPI Cards */}
                <ReviewStats
                    stats={stats}
                    ratingDistribution={ratingDistribution}
                />


                {/* Reviews + Achievements */}
                <section className="row g-4 mt-1">

                    <div className="col-12 col-lg-8">

                        <ReviewToolbar
                            search={search}
                            setSearch={setSearch}
                            course={course}
                            setCourse={setCourse}
                            rating={rating}
                            setRating={setRating}
                            sort={sort}
                            setSort={setSort}
                            courses={courses}
                        />

                        {error&&(
                            <div className='alert alert-danger mt-3'>
                                {error}
                            </div>
                        )}

                        {loading&&(
                            <div className='text-center py-3'>
                                <div className='spinner-border spinner-border-sm text-primary'/>
                            </div>
                        )}

                        <ReviewsList
                            reviews={reviews}
                            onReply={handleReply}
                            replyLoading={replyLoading}
                            replyError={replyError}
                        />

                    </div>

                </section>

            </main>
        </div>
    )
}

export default MentorReviews