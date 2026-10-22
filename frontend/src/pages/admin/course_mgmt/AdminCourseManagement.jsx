import React,{useState,useEffect} from "react";
import {useSearchParams} from 'react-router-dom'

import adminApi from '../../../services/adminApi'

import CourseStats from "../../../components/admin/course_mgmt/CourseStats";
import CourseToolbar from "../../../components/admin/course_mgmt/CourseToolbar";
import CourseTable from "../../../components/admin/course_mgmt/CourseTable";
import CourseDetailsModal from "../../../components/admin/course_mgmt/CourseDetailsModal";
import RejectCourseModal from "../../../components/admin/course_mgmt/RejectCourseModal";

const AdminCourseManagement=()=>{
    const [searchParams]=useSearchParams()
    const [courses,setCourses]=useState([])
    const [stats,setStats]=useState({
        total_courses:0,
        pending_review:0,
        published:0,
        drafts:0,
        rejected:0,
    })
    const [search,setSearch]=useState(searchParams.get('search')||'')
    const [statusFilter,setStatusFilter]=useState('')
    const [loading,setLoading]=useState(true)
    const [actionLoading,setActionLoading]=useState(false)
    const [error,setError]=useState('')
    const [selectedCourse,setSelectedCourse]=useState(null)
    const [rejectCourse,setRejectCourse]=useState(null)
    const fetchCourses=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                '/admin/courses/',
                {
                    params:{
                        search,
                        status:statusFilter,
                    }
                }
            )
            setCourses(response.data.courses||[])
            setStats(response.data.stats||[])
        }catch(error){
            console.error('failed to fetch courses:',error)
            setError(error.response?.data?.detail||'failed to load courses')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        const timer=setTimeout(
            fetchCourses,
            300
        )
        return ()=>clearTimeout(timer)
    },[search,statusFilter])
    const handleView=async (course)=>{
        try{
            const response=await adminApi.get(
                `/admin/courses/${course.id}/`
            )
            setSelectedCourse(response.data)
        }catch(error){
            console.error('failed to load course:',error)
        }
    }
    const handleApprove=async (course)=>{
        const confirmed=window.confirm(
            `approve "${course.title}" and publish it?`
        )
        if (!confirmed) return
        try{
            setActionLoading(true)
            await adminApi.post(
                `/admin/courses/${course.id}/approve/`
            )
            setSelectedCourse(null)
            await fetchCourses()
        }catch(error){
            console.error('failed to approve course:',error)
            alert(error.response?.data?.error||'failed to approve course')
        }finally{
            setActionLoading(false)
        }
    }
    const handleReject=(course)=>{
        setSelectedCourse(null)
        setRejectCourse(course)
    }
    const submitRejection=async (reason)=>{
        if (!rejectCourse) return
        try{
            setActionLoading(true)
            await adminApi.post(
                `/admin/courses/${rejectCourse.id}/reject/`,
                reason
            )
            setRejectCourse(null)
            await fetchCourses()
        }catch(error){
            console.error('failed to reject course:',error)
            alert(error.response?.data?.error||'failed to reject course')
        }finally{
            setActionLoading(false)
        }
    }
    return (
        <div className="admin-course-management">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Course Management
                    </h2>

                    <p className="text-muted mb-0">
                        Review, manage and publish mentor courses.
                    </p>

                </div>

            </div>


            {/* Statistics */}

            <CourseStats
                stats={stats}
            />


            {/* Toolbar */}

            <CourseToolbar
                search={search}
                setSearch={setSearch}
                status={statusFilter}
                setStatus={setStatusFilter}
            />


            {/* Error */}

            {error && (

                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                </div>

            )}


            {/* Courses */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="fw-bold mb-0">
                                Courses
                            </h5>

                            <small className="text-muted">
                                {courses.length} course
                                {courses.length !== 1
                                    ? "s"
                                    : ""}
                            </small>

                        </div>

                        {actionLoading && (
                            <div className="spinner-border spinner-border-sm text-primary" />
                        )}

                    </div>

                </div>


                <div className="card-body p-0">

                    {loading ? (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                            />

                            <p className="text-muted mt-3 mb-0">
                                Loading courses...
                            </p>

                        </div>

                    ) : (

                        <CourseTable
                            courses={courses}
                            onView={handleView}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />

                    )}

                </div>

            </div>


            {/* Course Details */}

            {selectedCourse && (

                <CourseDetailsModal
                    course={selectedCourse}
                    onClose={() =>
                        setSelectedCourse(null)
                    }
                    onApprove={handleApprove}
                    onReject={handleReject}
                />

            )}


            {/* Reject */}

            {rejectCourse && (

                <RejectCourseModal
                    course={rejectCourse}
                    onClose={() =>
                        setRejectCourse(null)
                    }
                    onSubmit={submitRejection}
                    loading={actionLoading}
                />

            )}

        </div>
    )
}

export default AdminCourseManagement