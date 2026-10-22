import React,{useEffect,useState,useMemo, use} from 'react'
import mentorApi from '../../../services/mentorApi'

const DURATION_OPTIONS=[
    {value:15,label:'15 minutes'},
    {value:30,label:'30 minutes'},
    {value:45,label:'45 minutes'},
    {value:60,label:'1 hour'},
    {value:90,label:'1.5 hours'},
    {value:120,label:'2 hours'},
]
const ScheduleCourseSessionModal=({
    show,
    onClose,
    student,
    onScheduled,
})=>{
    const [selectedEnrollmentId,setSelectedEnrollmentId]=useState("")
    const [date,setDate]=useState("")
    const [time,setTime]=useState("")
    const [duration,setDuration]=useState(60)
    const [message,setMessage]=useState("")
    const [submitting,setSubmitting]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")
    useEffect(()=>{
        if (show && student){
            const firstEnrollment=student.enrollments?.[0]
            setSelectedEnrollmentId(
                firstEnrollment?String(firstEnrollment.id):""
            )
            setDate("")
            setTime("")
            setDuration(60)
            setMessage("")
            setError("")
            setSuccess("")
        }
    },[show,student])
    const selectedEnrollment=useMemo(()=>{
        if (!student?.enrollments){
            return null
        }
        return student.enrollments.find(
            (enrollment)=>String(enrollment.id)===String(selectedEnrollmentId)
        )||null
    },[student,selectedEnrollmentId])
    const minDate=new Date().toISOString().split("T")[0]
    const formattedDate=useMemo(()=>{
        if (!date){
            return '--'
        }
        const parsedDate=new Date(`${date}T00:00:00`)
        return parsedDate.toLocaleDateString('en-IN',{
            day:'2-digit',
            month:'short',
            year:'numeric',
        })
    },[date])
    const formattedTimeRange=useMemo(()=>{
        if (!time){
            return '--'
        }
        const [hours,minutes]=time.split(':').map(Number)
        const start=new Date()
        start.setHours(hours,minutes,0,0)
        const end=new Date(start.getTime()+duration*60*1000)
        const formatTime=(dateObject)=>
            dateObject.toLocaleTimeString('en-IN',{
                hour:'numeric',
                minute:'2-digit',
                hour12:true,
            })
        return `${formatTime(start)}-${formatTime(end)}`
    },[time,duration])
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError("")
        setSuccess("")
        if (!student){
            setError('student information is missing')
            return
        }
        if (!selectedEnrollmentId){
            setError('please select a course')
            return
        }
        if (!date){
            setError('please select a date')
            return
        }
        if (!time){
            setError('please select a time')
            return
        }
        if (!duration){
            setError('please select a duration')
            return
        }
        const scheduledDateTime=new Date(`${date}T${time}`)
        if (scheduledDateTime<=new Date()){
            setError('please select a future date and time')
            return
        }
        const scheduledStart=scheduledDateTime.toISOString()
        const payload={
            enrollment:Number(selectedEnrollmentId),
            scheduled_start:scheduledStart,
            duration_minutes:Number(duration),
            message:message.trim(),
        }
        try{
            setSubmitting(true)
            const response=await mentorApi.post(
                '/sessions/mentor/schedule/',
                payload
            )
            console.log('course session scheduled:',response.data)
            setSuccess('session scheduled successfully')
            setTimeout(()=>{
                if (onScheduled){
                    onScheduled(response.data)
                }
                onClose()
            },800)
        }catch(err){
            console.error('failed to schedule session:',err)
            const responseData=err.response?.data
            if (responseData){
                if (typeof responseData==='string'){
                    setError(responseData)
                }else if(responseData.detail){
                    setError(responseData.detail)
                }else if(responseData.non_field_errors){
                    setError(responseData.non_field_errors[0])
                }else{
                    const firstError=Object.values(responseData)[0]
                    if (Array.isArray(firstError)){
                        setError(firstError[0])
                    }else{
                        setError(String(firstError))
                    }
                }
            }else{
                setError('unable to schedule the session, please try again')
            }
        }finally{
            setSubmitting(false)
        }
    }
    if (!student){
        return null
    }
    return (
        <>
      {/* Backdrop */}
      {show && (
        <div
          className="modal-backdrop fade show"
          onClick={!submitting ? onClose : undefined}
        />
      )}

      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal={show ? "true" : undefined}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow rounded-4">

            {/* ---------------------------------------- */}
            {/* Header */}
            {/* ---------------------------------------- */}

            <div className="modal-header px-4 py-3">
              <div>
                <h5 className="modal-title fw-bold mb-1">
                  Schedule Session
                </h5>

                <p className="text-muted small mb-0">
                  Schedule a learning session with this student.
                </p>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
              />
            </div>

            {/* ---------------------------------------- */}
            {/* Body */}
            {/* ---------------------------------------- */}

            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-4">

                {/* Error */}
                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    {success}
                  </div>
                )}

                {/* ------------------------------------ */}
                {/* Student Information */}
                {/* ------------------------------------ */}

                <div className="card border-0 bg-light rounded-3 mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">

                      <div className="flex-shrink-0">
                        {student.profile_image ? (
                          <img
                            src={
                              student.profile_image.startsWith("http")
                                ? student.profile_image
                                : `http://127.0.0.1:8000${student.profile_image}`
                            }
                            alt={student.full_name}
                            className="rounded-circle"
                            width="52"
                            height="52"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: "52px",
                              height: "52px",
                            }}
                          >
                            {(student.full_name || "S")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div>
                        <h6 className="fw-semibold mb-1">
                          {student.full_name}
                        </h6>

                        {student.username && (
                          <div className="text-muted small">
                            @{student.username}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* ------------------------------------ */}
                {/* Course */}
                {/* ------------------------------------ */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Course
                  </label>

                  <select
                    className="form-select"
                    value={selectedEnrollmentId}
                    onChange={(event) =>
                      setSelectedEnrollmentId(event.target.value)
                    }
                    disabled={submitting}
                  >
                    <option value="">
                      Select a course
                    </option>

                    {student.enrollments?.map((enrollment) => (
                      <option
                        key={enrollment.id}
                        value={enrollment.id}
                      >
                        {enrollment.course_title}
                      </option>
                    ))}
                  </select>

                  {selectedEnrollment && (
                    <div className="d-flex justify-content-between mt-2 px-1">
                      <small className="text-muted">
                        Student enrolled:{" "}
                        {selectedEnrollment.enrolled_at
                          ? new Date(
                              selectedEnrollment.enrolled_at
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "--"}
                      </small>

                      <small className="text-primary fw-semibold">
                        Course progress:{" "}
                        {selectedEnrollment.progress ?? 0}%
                      </small>
                    </div>
                  )}
                </div>

                {/* ------------------------------------ */}
                {/* Date + Time */}
                {/* ------------------------------------ */}

                <div className="row g-3 mb-4">

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      min={minDate}
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                      disabled={submitting}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Time
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      value={time}
                      onChange={(event) =>
                        setTime(event.target.value)
                      }
                      disabled={submitting}
                    />
                  </div>

                </div>

                {/* ------------------------------------ */}
                {/* Duration */}
                {/* ------------------------------------ */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Duration
                  </label>

                  <select
                    className="form-select"
                    value={duration}
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                    disabled={submitting}
                  >
                    {DURATION_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ------------------------------------ */}
                {/* Session Summary */}
                {/* ------------------------------------ */}

                <div className="card border-0 bg-light rounded-3 mb-4">
                  <div className="card-body">

                    <h6 className="text-primary fw-bold text-uppercase small mb-3">
                      Session Summary
                    </h6>

                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">
                        Student
                      </span>

                      <span className="fw-semibold">
                        {student.full_name}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">
                        Course
                      </span>

                      <span className="fw-semibold text-end ms-3">
                        {selectedEnrollment?.course_title || "--"}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">
                        Date
                      </span>

                      <span className="fw-semibold">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between py-2">
                      <span className="text-muted">
                        Time
                      </span>

                      <span className="fw-semibold">
                        {formattedTimeRange}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between pt-2">
                      <span className="text-muted">
                        Duration
                      </span>

                      <span className="fw-semibold">
                        {duration} minutes
                      </span>
                    </div>

                  </div>
                </div>

                {/* ------------------------------------ */}
                {/* Message */}
                {/* ------------------------------------ */}

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">
                      Message to Student{" "}
                      <span className="text-muted fw-normal">
                        (Optional)
                      </span>
                    </label>

                    <small className="text-muted">
                      {message.length}/500
                    </small>
                  </div>

                  <textarea
                    className="form-control"
                    rows="3"
                    maxLength="500"
                    placeholder="e.g. Please review Module 3 before our session..."
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    disabled={submitting}
                  />

                  <small className="text-muted">
                    Add any information you'd like to communicate
                    to the student about this session.
                  </small>
                </div>

              </div>

              {/* -------------------------------------- */}
              {/* Footer */}
              {/* -------------------------------------- */}

              <div className="modal-footer d-block px-4 py-3">

                <div className="alert alert-info small mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  The student will be notified when the session is
                  scheduled.
                </div>

                <div className="d-flex justify-content-end gap-2">

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={
                      submitting ||
                      !selectedEnrollmentId ||
                      !date ||
                      !time
                    }
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-plus me-2"></i>
                        Schedule Session
                      </>
                    )}
                  </button>

                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
    )
}

export default ScheduleCourseSessionModal