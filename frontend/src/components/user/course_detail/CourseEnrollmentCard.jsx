import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

function CourseEnrollmentCard({
    course,
    isEnrolled,
}){
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const handleEnroll=async ()=>{
        try{
            setLoading(true)
            const response=await api.post(
                `/courses/${course.id}/enroll/`
            )
            console.log('enrolled:',response.data)
            alert(JSON.stringify(response['message']))
            navigate(`/courses/${course.id}`)
            window.location.reload()
        }catch(error){
            console.error(
                'enrollment failed',
                error
            )
            alert(
                error.response?.data?.error||
                'unable to enroll in this course'
            )
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