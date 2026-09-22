import React,{useEffect,useState,useMemo} from 'react'

import mentorApi from '../../../services/mentorApi'

import MentorCourseHeader from '../../../components/mentor/course_mgmt/MentorCourseHeader'
import CourseStats from '../../../components/mentor/course_mgmt/CourseStats'
import CourseGrid from '../../../components/mentor/course_mgmt/CoureGrid'
import EnrollmentPerformance from '../../../components/mentor/course_mgmt/EnrollmentPerformance'

import './MentorCourseManagement.css'

const MentorCourseManagement=()=>{
    const [courses,setCourses]=useState([])
    const [stats,setStats]=useState({
        total_courses:0,
        published:0,
        drafts:0,
        enrollments:0,
        average_rating:null,
        completion_rate:null,
    })
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [searchTerm,setSearchTerm]=useState("")
    useEffect(()=>{
        fetchCourses()
    },[])
    const fetchCourses=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await mentorApi.get(
                '/courses/mentor/management/'
            )
            setCourses(
                response.data.courses||[]
            )
            setStats(
                response.data.stats||{}
            )
        }catch(error){
            console.error('failed to load mentor courses:',error)
            setError(error.response?.data?.error||'unable to load your courses')
        }finally{
            setLoading(false)
        }
    }
    const filteredCourses=useMemo(()=>{
        if (!searchTerm.trim()){
            return courses
        } 
        const search=searchTerm.toLowerCase()
        return courses.filter((course)=>{
            course.title?.toLowerCase().includes(search)||
            course.category?.toLowerCase().includes(search)||
            course.description?.toLowerCase().includes(search)
        },[courses,searchTerm])
    })
    return (
        <div className="mentor-course-page">

            {/* Header/Search */}
            <MentorCourseHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />


            {/* Error */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}


            {/* Statistics */}
            <CourseStats
                stats={stats}
            />


            {/* Main content */}
            <div className="row g-4">

                {/* Courses */}
                <div className="col-12 col-lg-8">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h4 className="mentor-section-title mb-0">
                            My Courses
                        </h4>

                        {!loading && (
                            <span className="course-result-count">
                                {filteredCourses.length} course
                                {filteredCourses.length !== 1
                                    ? "s"
                                    : ""}
                            </span>
                        )}

                    </div>

                    <CourseGrid
                        courses={filteredCourses}
                        loading={loading}
                        searchTerm={searchTerm}
                    />

                </div>


                {/* Right side */}
                <div className="col-12 col-lg-4">

                    <EnrollmentPerformance
                        data={[]}
                    />

                    {/* AI Insights intentionally excluded */}

                    {/* Curriculum Flow intentionally excluded */}

                </div>

            </div>

        </div>
    )
}

export default MentorCourseManagement