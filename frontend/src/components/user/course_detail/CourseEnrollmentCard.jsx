import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

import paymentApi from '../../../services/paymentApi'

import { loadRazorpay } from '../../../utils/loadRazorpay'

function CourseEnrollmentCard({
    course,
    isEnrolled,
}){
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const handleEnroll=async ()=>{
        try{
            setLoading(true)
            const razorPayLoaded=await loadRazorpay()
            if (!razorPayLoaded){
                alert('unable to load razorpay. please check your internet connection')
                setLoading(false)
                return
            }
            console.log('razorapay after loading:',window.razorPay)
            const response=await paymentApi.createCourseOrder(course.id)
            const data=response.data
            console.log('payment order created:',data)
            const options={
                key:data.razorpay_key_id,
                amount:Math.round(Number(data.amount)*100),
                currency:data.currency||'INR',
                name:'SkillSwap',
                description:course.title,
                order_id:data.razorpay_order_id,
                prefill:{
                    name:'',
                    email:'',
                    contact:'',
                },
                notes:{
                    course_id:String(course.id),
                    payment_id:String(data.payment_id),
                },
                theme:{
                    color:'#0d6efed'
                },
                handler:async function(paymentResponse){
                    try{
                        console.log('razorpay payment response:',paymentResponse)   
                        const verifyResponse=await paymentApi.verifyCoursePayment({
                            razorpay_order_id:paymentResponse.razorpay_order_id,
                            razorpay_payment_id:paymentResponse.razorpay_payment_id,
                            razorpay_signature:paymentResponse.razorpay_signature,
                        })
                        console.log('payment verified:',verifyResponse.data)
                        alert('payment successfull! you have enrolled in the course. have a fun time learning:)')
                        navigate(`/courses/${course.id}`)
                    }catch(err){
                        console.error('payment verification failed:',err)
                        alert(err.response?.data?.detail||'payment verification failed')
                    }finally{
                        setLoading(false)
                    }
                },
                modal:{
                    ondismiss:function(){
                        console.log('razorpay checkout closed')
                        setLoading(false)
                    }
                },
            }
            console.log("Razorpay:", window.Razorpay)
            console.log("Razorpay type:", typeof window.Razorpay)
            const razorpay=new window.Razorpay(
                options
            )
            razorpay.open()
        }catch(error){
            console.error('unable to create payment order:',error)
            alert(error.response?.data?.detail||'unable to start payment')
        }finally{
            setLoading(false)
        }
    }
    const handleContinue=()=>{
        const firstLesson=course.modules?.[0]?.lessons?.[0]
        if (firstLesson){
            navigate(
                `/courses/${course.id}/lessons/${firstLesson.id}`
            )
        }
    }
    const formatDuration = (minutes) => {
        if (!minutes) return "—";

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (!hours) {
            return `${mins} minutes`;
        }

        return mins
            ? `${hours}h ${mins}m`
            : `${hours} hours`;
    };
    const mentor=course.mentor||{}
    return (
        <aside className="course-enrollment-card">

            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    {/* Price */}
                    <div className="mb-4">

                        <div className="small text-uppercase fw-bold text-muted">
                            Course Tuition
                        </div>

                        <div className="d-flex align-items-baseline gap-2 mt-1">

                            <span className="display-6 fw-bold">
                                {Number(course.price) === 0
                                    ? "Free"
                                    : `₹${course.price}`}
                            </span>

                        </div>

                    </div>

                    {/* Main CTA */}
                    {isEnrolled ? (
                        <button
                            type="button"
                            className="btn btn-success w-100 py-3 fw-bold mb-2"
                            onClick={handleContinue}
                        >
                            <i className="bi bi-play-circle me-2"></i>
                            Continue Course
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary w-100 py-3 fw-bold mb-2"
                            onClick={handleEnroll}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Enrolling...
                                </>
                            ) : (
                                <>
                                    Enroll Now
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </>
                            )}
                        </button>
                    )}

                    

                    {/* Highlights */}
                    <div className="border-top mt-4 pt-4">

                        <div className="course-benefit">
                            <i className="bi bi-award text-primary"></i>
                            <span>
                                Certificate of Completion included
                            </span>
                        </div>

                        <div className="course-benefit">
                            <i className="bi bi-person-video3 text-primary"></i>
                            <span>
                                Learn from a verified mentor
                            </span>
                        </div>

                        <div className="course-benefit">
                            <i className="bi bi-infinity text-primary"></i>
                            <span>
                                Lifetime course access
                            </span>
                        </div>

                    </div>

                    {/* Specifications */}
                    <div className="border-top mt-4 pt-4">

                        <div className="small text-uppercase fw-bold text-muted mb-3">
                            Specifications
                        </div>

                        <div className="course-spec-row">
                            <span>
                                <i className="bi bi-bar-chart me-2"></i>
                                Level
                            </span>

                            <strong>
                                {course.level}
                            </strong>
                        </div>

                        <div className="course-spec-row">
                            <span>
                                <i className="bi bi-clock me-2"></i>
                                Duration
                            </span>

                            <strong>
                                {formatDuration(
                                    course.estimated_duration
                                )}
                            </strong>
                        </div>

                        <div className="course-spec-row">
                            <span>
                                <i className="bi bi-folder me-2"></i>
                                Category
                            </span>

                            <strong>
                                {course.category?.name ||
                                    course.category}
                            </strong>
                        </div>

                        <div className="course-spec-row">
                            <span>
                                <i className="bi bi-person me-2"></i>
                                Mentor
                            </span>

                            <strong>
                                @{mentor.username}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

            {/* Question card */}
            <div className="card border-0 shadow-sm mt-3">

                <div className="card-body p-3">

                    <div className="d-flex align-items-center gap-3">

                        <div className="course-help-icon">
                            <i className="bi bi-chat-dots"></i>
                        </div>

                        <div>
                            <div className="small fw-bold">
                                Have a question?
                            </div>

                            <button
                                type="button"
                                className="btn btn-link p-0 small text-decoration-none"
                            >
                                Message mentor →
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </aside>
    )
}

export default CourseEnrollmentCard