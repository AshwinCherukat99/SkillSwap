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
    const [filters,setFilters]=useState({
        level:'',
        category:'',
        published:'',
        duration:'',
    })
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
    const categories=[
        ...new Map(
            courses
            .filter(course=>course.category_id&&course.category_name)
            .map(course=>[
                course.category_id,
                {
                    id:course.category_id,
                    name:course.category_name
                }
            ])
        ).values()
    ]
    const filteredCourses=courses.filter((course)=>{
        const searchText=search.toLowerCase()
        const matchesSearch=
            course.title?.toLowerCase().includes(searchText)||
            course.category_name?.toLowerCase().includes(searchText)||
            course.mentor_name?.toLowerCase().includes(searchText)
        const matchesLevel=!filters.level||course.level===filters.level
        const matchesCategory=!filters.category||
        String(course.category_id)===String(filters.category)
        let matchesPublished=true
        if (filters.published){
            const publishedDate=course.published_at?new Date(course.published_at):null
            const validPublishedDate=publishedDate&&!isNaN(publishedDate.getTime())
            const daysDifference=validPublishedDate?
            (Date.now()-publishedDate.getTime())/(1000*60*60*24):null
            if (filters.published==='7_DAYS'){
                matchesPublished=
                validPublishedDate&&
                daysDifference>=0&&
                daysDifference<=7
            }
            if (filters.published==='30_DAYS'){
                matchesPublished=
                validPublishedDate&&
                daysDifference>=0&&
                daysDifference<=30
            }
            if (filters.published==='OLDER'){
                matchesPublished=
                validPublishedDate&&
                daysDifference>30
            }
        }
        let matchesDuration=true
        const duration=Number(course.estimated_duration)
        if (filters.duration==='SHORT'){
            matchesDuration=duration<60
        }
        if (filters.duration==='MEDIUM'){
            matchesDuration=duration>=60&&duration<=180
        }
        if (filters.duration==='LONG'){
            matchesDuration=duration>180
        }
        return (
            matchesSearch&&
            matchesLevel&&
            matchesCategory&&
            matchesPublished&&
            matchesDuration
        )
    })
    const sortedCourses=[...filteredCourses]
    if (filters.published==='LATEST'){
        sortedCourses.sort(
            (a,b)=>
                new Date(b.published_at)-new Date(a.published_at)
        )
    }
    const continueCourses=sortedCourses.filter(
        (course)=>course.progress!==null && course.progress!==undefined
    )         
    const discoveryCourses=sortedCourses.filter(
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
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
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