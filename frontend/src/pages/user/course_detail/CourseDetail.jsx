import {useEffect,useState} from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import api from '../../../services/api'

import CourseHero from '../../../components/user/course_detail/CourseHero'
import CourseLoading from '../../../components/user/course_detail/CourseLoading'
import CourseStats from '../../../components/user/course_detail/CourseStats'
import CourseAbout from '../../../components/user/course_detail/CourseAbout'
import CourseCurriculum from '../../../components/user/course_detail/CourseCurriculum'
import CourseEnrollmentCard from '../../../components/user/course_detail/CourseEnrollmentCard'

function CourseDetail(){
    const {courseId}=useParams()
    const navigate=useNavigate()
    const [course,setCourse]=useState(null)
    const [isEnrolled,setIsEnrolled]=useState(false)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        const fetchCourse=async ()=>{
            try{
                setLoading(true)
                setError('')
                const response=await api.get(
                    `/courses/${courseId}`
                )
                const data=response.data
                setCourse(data.course||data)
                setIsEnrolled(data.is_enrolled===true)
            }catch(error){
                console.error('failed to load course:',error)
                if (error.response?.status===404){
                    setError('course not found')
                }else{
                    setError('unable to load course details')
                }
            }finally{
                setLoading(false)
            }
        }
        if (courseId){
            fetchCourse()
        }
    },[courseId])
    const handleBack=()=>{
        navigate('/courses')
    }
    if (loading){
        return <CourseLoading/>
    }
    if (error){
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-circle-fill fs-4 me-3"></i>

                        <div>
                            <h5 className="mb-1">
                                Unable to load course
                            </h5>

                            <p className="mb-0">
                                {error}
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-outline-danger mt-3"
                        onClick={handleBack}
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        )
    }
    if (!course){
        return null
    }
    return (
        <div className="course-detail-page">

            <main className="container py-4">

                {/* Breadcrumb */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">

                    <div className="d-flex align-items-center gap-2 small text-muted">

                        <button
                            className="btn btn-link p-0 text-decoration-none fw-semibold"
                            onClick={handleBack}
                        >
                            <i className="bi bi-mortarboard me-1"></i>
                            Courses
                        </button>

                        <span>/</span>

                        <span>
                            {course.category?.name ||
                                course.category}
                        </span>

                        <span>/</span>

                        <span className="text-dark fw-semibold text-truncate course-breadcrumb-title">
                            {course.title}
                        </span>

                    </div>

                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleBack}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Back to Courses
                    </button>

                </div>

                {/* Hero */}
                <CourseHero
                    course={course}
                />

                {/* Stats */}
                <CourseStats
                    course={course}
                />

                {/* Main content */}
                <div className="row g-4 align-items-start mt-1">

                    {/* Left */}
                    <div className="col-12 col-lg-8">

                        <CourseAbout
                            course={course}
                        />

                        <CourseCurriculum
                            course={course}
                            isEnrolled={isEnrolled}
                        />

                    </div>

                    {/* Right */}
                    <div className="col-12 col-lg-4">

                        <CourseEnrollmentCard
                            course={course}
                            isEnrolled={isEnrolled}
                        />

                    </div>

                </div>

            </main>

            

        </div>
    )
}

export default CourseDetail