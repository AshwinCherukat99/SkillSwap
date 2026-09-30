import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../../../services/api'

import ContinueLearning from '../../../components/user/courses/ContinueLearning'
import CourseHeader from '../../../components/user/courses/CourseHeader'
import RecommendedCourses from '../../../components/user/courses/RecommendedCourses'
import BestSellingCourses from '../../../components/user/courses/BestSellingCourses'

import './Courses.css'

function Courses(){
    const navigate=useNavigate()
    const [courses,setCourses]=useState([])
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        fetchCourses()
    },[])
    const fetchCourses=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.get('/courses/')
            setCourses(response.data)
        }catch(error){
            console.error('error fetching courses:',error)
            setError(error.response?.data?.detail||'failed to load courses')
        }finally{
            setLoading(false)
        }
    }
    const filteredCourses=courses.filter((course)=>{
        const searchText=search.toLowerCase()
        return (
            course.title?.toLowerCase().includes(searchText)||
            course.category_name?.toLowerCase().includes(searchText)||
            course.mentor_name?.toLowerCase().includes(searchText)
        )
    })
    const continueCourses=filteredCourses.filter(
        (course)=>course.progress!==null && course.progress!==undefined
    )         
    const discoveryCourses=filteredCourses.filter(
        (course)=>course.progress===null || course.progress===undefined
    )
    const recommendedCourses=discoveryCourses.slice(0,4)
    const bestSellingCourses=[...discoveryCourses].sort(
        (a,b)=>(b.student_count||0)-(a.student_count||0)
    ).slice(0,4)
    const handleViewCourse=(courseId)=>{
        navigate(`/courses/${courseId}`)
    }
    const handleContinueCourse=(courseId)=>{
        navigate(`/courses/${courseId}`)
    }
    return (
        <div className="courses-page">

            <main className="container-fluid courses-container">

                <CourseHeader
                    search={search}
                    setSearch={setSearch}
                />

                {loading && (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="mt-3 text-muted">
                            Loading courses...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <ContinueLearning
                            courses={continueCourses}
                            onContinue={handleContinueCourse}
                        />

                        <RecommendedCourses
                            courses={recommendedCourses}
                            onViewCourse={handleViewCourse}
                        />

                        <BestSellingCourses
                            courses={bestSellingCourses}
                            onViewCourses={handleViewCourse}
                        />
                    </>
                )}

            </main>

        </div>
    )
}

export default Courses