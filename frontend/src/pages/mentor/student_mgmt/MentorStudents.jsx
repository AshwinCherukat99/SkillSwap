import React,{useMemo,useState,useEffect} from 'react'
import MentorStudentsHeader from '../../../components/mentor/student_mgmt/MentorStudentsHeader'
import StudentStats from '../../../components/mentor/student_mgmt/StudentStats'
import StudentGrid from '../../../components/mentor/student_mgmt/StudentGrid'
import mentorApi from '../../../services/mentorApi'

import './MentorStudents.css'

const MentorStudents=()=>{
    const [students,setStudents]=useState([])
    const [courses,setCourses]=useState([])
    const [search,setSearch]=useState("")
    const [selectedCourse,setSelectedCourse]=useState('all')
    const [selectedStatus,setSelectedStatus]=useState('all')
    const [stats,setStats]=useState({
        total_students:0,
        active_now:0,
        sessions_this_week:0,
        completed:0,
        average_rating:null,
        success_rate:null,
    })
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")     
    const fetchStudents=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await mentorApi.get('/mentors/students/')
            setStudents(response.data.students||[])
            if (response.data.stats){
                setStats(response.data.stats)
            }
        }catch(err){
            console.error('failed to fetch mentor students:',err)
            setError(err.response?.data?.detail||'failed to load students, please try again')
        }finally{
            setLoading(false)
        }
    }
    const fetchCourses=async ()=>{
        try{
            const response=await mentorApi.get('/courses/mentor/management/')
            const mentorCourses=response.data.courses||[]
            setCourses(mentorCourses)
        }catch(err){
            console.error('failed to fetch mentor courses:',err)
        }
    }
    useEffect(()=>{
        fetchStudents()
        fetchCourses()
    },[])
    const filteredStudents=useMemo(()=>{
        return students.filter((student)=>{
            const studentName=student.full_name||''
            const matchesSearch=studentName.toLowerCase().includes(search.trim().toLowerCase())
            const matchesCourse=selectedCourse==='all'||String(courses.id)===String(selectedCourse)
            const status=student.completed_at!==null?'completed':'active'
            const matchesStatus=selectedStatus==='all'||status===selectedStatus
            return (matchesSearch&&matchesCourse&&matchesStatus)
        }).map((student)=>({
            ...student,
            status:student.completed_at!==null?'completed':'active',
            selectedEnrollment:student,
            enrollment_id:student.id,
        }))
    },[
        students,
        search,
        selectedCourse,
        selectedStatus,
    ])
    return (
    <div className="mentor-students-page">
      <div className="container-fluid py-4">

        {/* Header + Filters */}
        <MentorStudentsHeader
          search={search}
          setSearch={setSearch}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          courses={courses}
        />

        {/* Statistics */}
        <StudentStats stats={stats} />

        {/* Error */}
        {error && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={fetchStudents}
            >
              Retry
            </button>
          </div>
        )}

        {/* Students */}
        <StudentGrid
          students={filteredStudents}
          loading={loading}
        />
      </div>
    </div>
    )
}    

export default MentorStudents