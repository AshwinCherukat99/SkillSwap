import React,{useEffect,useState} from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import { ArrowLeft,Edit3,BookOpen,Clock3,IndianRupee,Globe2 } from 'lucide-react'

import mentorApi from '../../../services/mentorApi'

import CourseHeader from '../../../components/mentor/course_detail/CourseHeader'
import CourseOverview from '../../../components/mentor/course_detail/CourseOverview'
import CourseStats from '../../../components/mentor/course_detail/CourseStats'
import ModuleList from '../../../components/mentor/course_detail/ModuleList'

import './CourseDetail.css'

const MentorCourseDetail=()=>{
    const {courseId}=useParams()
    const navigate=useNavigate()
    const [actionLoading,setActionLoading]=useState(false)
    const [successMessage,setSuccessMessage]=useState('')
    const [course,setCourse]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        const fetchCourse=async ()=>{
            try{
                setLoading(true)
                setError('')
                const response=await mentorApi.get(
                    `/courses/mentor/courses/${courseId}`
                )
                setCourse(response.data)
            }catch(error){
                console.error('failed to fetch course:',error)
                setError(error.response?.data?.detail||'failed to load course')
            }finally{
                setLoading(false)
            }
        }
        fetchCourse()
    },[courseId])
    const handleSubmitForReview=async ()=>{
        try{
            setActionLoading(true)
            setError('')
            setSuccessMessage('')
            const response=await mentorApi.post(
                `/courses/mentor/${courseId}/submit-review/`
            )
            setCourse((previous)=>({
                ...previous,
                status:response.data.course.status
            }))
            setSuccessMessage('course submitted for review successfully')
        }catch(err){
            console.error('failed to submit course for review:',err)
            setError(err.response?.data?.error||'failed to submit course for review')
        }finally{
            setActionLoading(false)
        }
    }
    if (loading){
        return (
            <div className="container-fluid py-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                />
                <p className="mt-3 text-muted">
                    Loading course...
                </p>
            </div>
        )
    }
    if (error){
        return (
            <div className="container-fluid py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/mentor/courses")
                    }
                >
                    Back to Courses
                </button>

            </div>
        )
    }
    if (!course){
        return null
    }
    return (
        <div className="course-detail-page bg-light min-vh-100">

            <main className="container-fluid px-4 py-4">

                {successMessage && (
        <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
        >
            <i className="bi bi-check-circle-fill me-2"></i>

            {successMessage}

            <button
                type="button"
                className="btn-close"
                onClick={() =>
                    setSuccessMessage('')
                }
            />
        </div>
    )}

    {error && (
        <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
        >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>

            {error}

            <button
                type="button"
                className="btn-close"
                onClick={() =>
                    setError('')
                }
            />
        </div>
    )}

                <CourseHeader
                    course={course}
                    onBack={() =>
                        navigate("/mentor/courses")
                    }
                    onEdit={() =>
                        navigate(
                            `/mentor/courses/${course.id}/edit`
                        )
                    }
                    onSubmitForReview={handleSubmitForReview}
                    submitLoading={actionLoading}
                />

                <CourseOverview
                    course={course}
                />

                <CourseStats
                    course={course}
                />

                <ModuleList
                    modules={course.modules}
                />

            </main>

        </div>
    )
}

export default MentorCourseDetail