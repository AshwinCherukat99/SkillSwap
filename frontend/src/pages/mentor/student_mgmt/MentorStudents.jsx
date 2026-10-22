import React,{useMemo,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import MentorStudentsHeader from '../../../components/mentor/student_mgmt/MentorStudentsHeader'
import StudentStats from '../../../components/mentor/student_mgmt/StudentStats'
import StudentGrid from '../../../components/mentor/student_mgmt/StudentGrid'
import mentorApi from '../../../services/mentorApi'
import ScheduleCourseSessionModal from '../../../components/mentor/student_mgmt/ScheduleCourseSessionModal'

import './MentorStudents.css'

const MentorStudents=()=>{
    const navigate=useNavigate()
    const [students,setStudents]=useState([])
    const [courses,setCourses]=useState([])
    const [search,setSearch]=useState("")
    const [showScheduleModal,setShowScheduleModal]=useState(false)
    const [selectedStudent,setSelectedStudent]=useState(null)
    const [selectedCourse,setSelectedCourse]=useState('all')
    const [selectedStatus,setSelectedStatus]=useState('all')
    const [openingChatFor,setOpeningChatFor]=useState(null)
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
    const handleScheduleSession=(student)=>{
        setSelectedStudent(student)
        setShowScheduleModal(true)
    }
    const handleCloseScheduleModal=()=>{
        setShowScheduleModal(false)
        setSelectedStudent(null)
    }
    const groupedStudents=useMemo(()=>{
        const grouped={}
        students.forEach((enrollment)=>{
            const studentId=enrollment.student_id
            if (!grouped[studentId]){
                grouped[studentId]={
                    student_id:studentId,
                    full_name:enrollment.full_name,
                    username:enrollment.username,
                    profile_image:enrollment.profile_image,
                    courses:[],
                    enrollments:[],
                }
            }
            grouped[studentId].courses.push({
                enrollment_id:enrollment.id,
                course_id:enrollment.course_id,
                course_title:enrollment.course_title,
                progress:enrollment.progress??0,
                enrolled_at:enrollment.enrolled_at,
                completed_at:enrollment.completed_at,
                status:enrollment.completed_at!==null?'completed':'active',
            })
            grouped[studentId].enrollments.push({
                id:enrollment.id,
                course_id:enrollment.course_id,
                course_title:enrollment.course_title,
                progress:enrollment.progress??0,
                enrolled_at:enrollment.enrolled_at,
                completed_at:enrollment.completed_at,
            })
        })
        return Object.values(grouped)
    },[students])
    const filteredStudents=useMemo(()=>{
        return groupedStudents.filter((student)=>{
            const studentName=student.full_name||''
            const matchesSearch=studentName.toLowerCase().includes(search.trim().toLowerCase())
            const matchesCourse=selectedCourse==='all'||student.courses.some((course)=>String(course.course_id)===String(selectedCourse)) 
            const isCompleted=student.courses.length>0 && student.courses.every(
                (course)=>course.completed_at!=null
            )
            const status=isCompleted?'completed':'active'
            const matchesStatus=selectedStatus==='all'||status===selectedStatus
            return (matchesSearch&&matchesCourse&&matchesStatus)
        }).map((student)=>{
            const isCompleted=student.courses.length>0 && student.courses.every(
                (course)=>course.completed_at!=null
            ) 
            return {
                ...student,
                status:isCompleted?'completed':'active'
            }
        })
    },[
        groupedStudents,
        search,
        selectedCourse,
        selectedStatus,
    ])
    const handleMessageStudent=async (student)=>{
        try{
            setOpeningChatFor(student.student_id)
            setError('')
            const response=await mentorApi.post(
                '/chat/mentor/direct-chat/start/',
                {
                    user_id:student.student_id
                }
            )
            const conversationId=response.data.id
            navigate(`/mentor/direct-chat/?conversation=${conversationId}`)
        }catch(err){
            console.error('failed to open student chat:',err)
            setError(err.response?.data?.detail||'unable to open conversation')
        }finally{
            setOpeningChatFor(null)
        }
    }
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
          onScheduleSession={handleScheduleSession}
          onMessage={handleMessageStudent}
        />
      </div>
      <ScheduleCourseSessionModal
      show={showScheduleModal}
      onClose={handleCloseScheduleModal}
      student={selectedStudent}
      onScheduled={fetchStudents}/>
    </div>
    )
}    

export default MentorStudents