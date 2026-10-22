import { useCallback,useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";

import mentorApi from '../../../services/mentorApi'

import StudentProfileHeader from "../../../components/mentor/student_profile/StudentProfileHeader";
import CourseProgressSummary from "../../../components/mentor/student_profile/CourseProgressSummary";
import CourseAccordion from "../../../components/mentor/student_profile/CourseAccordion";
import UnlockLessonModal from "../../../components/mentor/student_profile/UnlockLessonModal";

import './MentorStudentProfile.css'

function MentorStudentProfile(){
    const {enrollmentId}=useParams()
    const navigate=useNavigate()
    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [notice,setNotice]=useState('')
    const [selectedLesson,setSelectedLesson]=useState(null)
    const [unlocking,setUnlocking]=useState(false) 
    const loadProfile=useCallback(async ()=>{
        setLoading(true)
        setError('')
        try{
            const response=await mentorApi.get(
                `/courses/mentor/enrollments/${enrollmentId}/profile/`
            )
            setData(response.data)
        }catch(err){
            setError(
                err.response?.data?.detail||
                err.response?.data?.message||
                'unable to load student profile'
            )
        }finally{
            setLoading(false)
        }
    },[enrollmentId])
    useEffect(()=>{
        loadProfile()
    },[loadProfile])
    async function confirmUnlock(){
        if (!selectedLesson?.lesson||!selectedLesson?.course?.id||!selectedLesson?.enrollment?.id){
            return
        }
        setUnlocking(true)
        setNotice('')
        try{
            await mentorApi.post(
                `/courses/mentor/${selectedLesson.course.id}/enrollments/${selectedLesson.enrollment.id}/lessons/${selectedLesson.lesson.id}/unlock/`
            )
            setSelectedLesson(null)
            setNotice('lesson unlocked successfully')
            await loadProfile()
        }catch(err){
            setNotice(
                err.response?.data?.detail||
                err.response?.data?.message||
                'unable to unlock lesson'
            )
        }finally{
            setUnlocking(false)
        }
    }
    if (loading){
        return (
            <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading"
        />
        <p className="mt-3 text-secondary">
          Loading student profile...
        </p>
      </div>
        )
    }
    if (error||!data){
        return (
            <div className="container py-5">
        <button
          className="btn btn-link mb-3"
          onClick={() => navigate(-1)}
        >
          ← Back to Students
        </button>

        <div className="alert alert-danger">
          {error || "Student profile not found."}
        </div>

        <button className="btn btn-primary" onClick={loadProfile}>
          Try again
        </button>
      </div>
        )
    }
    return (
        <main className="mentor-profile-page">
      <div className="container-fluid mentor-profile-container py-4 py-lg-5">
        <button
          className="btn btn-link text-decoration-none px-0 mb-3"
          onClick={() => navigate(-1)}
        >
          ← Back to Students
        </button>

        {notice && (
          <div className="alert alert-info alert-dismissible">
            {notice}
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotice("")}
              aria-label="Dismiss"
            />
          </div>
        )}

        <StudentProfileHeader
    student={data.student}
    enrollment={data.courses?.[0]?.enrollment}
/>

<section className="mt-4">
    <div className="mb-3">
        <div className="small text-uppercase fw-bold text-primary">
            Learning management
        </div>

        <h2 className="h4 fw-bold mb-1">
            Courses Enrolled with You
        </h2>

        <p className="text-secondary">
            Unlock lessons individually when you feel this student is ready.
        </p>
    </div>

    {data.courses?.length > 0 ? (
        data.courses.map((item) => (
            <div key={item.enrollment_id} className="mb-4">
                <CourseProgressSummary
                    course={item.course}
                    enrollment={item.enrollment}
                />

                <CourseAccordion
                    course={item.course}
                    modules={item.modules || []}
                    onUnlock={(lesson) =>
                        setSelectedLesson({
                            lesson,
                            course: item.course,
                            enrollment: item.enrollment,
                        })
                    }
                />
            </div>
        ))
    ) : (
        <div className="alert alert-info">
            This student has no active course enrollments with you.
        </div>
    )}
</section>
      </div>

      <UnlockLessonModal
        lesson={selectedLesson?.lesson}
        student={data.student}
        course={selectedLesson?.course}
        busy={unlocking}
        onCancel={() => {
          if (!unlocking) setSelectedLesson(null);
        }}
        onConfirm={confirmUnlock}
      />
    </main>
    )
}

export default MentorStudentProfile