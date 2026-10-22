import React,{useEffect,useState} from 'react'
import {Link,useParams,useNavigate,useLocation} from 'react-router-dom'

import ScoreOverview from '../../../components/user/assessment_result/ScoreOverview'
import AIsummary from '../../../components/user/assessment_result/AISummary'
import QuestionReview from '../../../components/user/assessment_result/QuestionReview'

import './AssessmentResult.css'

import api from '../../../services/api'

function getErrorMessage(error){
    return (
        error.response?.data?.detail||
        error.response?.data?.error||
        error.response?.data?.message||
        'something went wrong. please try again'
    )
}

function AssessmentResult(){
    const {courseId,assessmentId}=useParams()
    const location=useLocation()
    const navigate=useNavigate()
    const [assessment,setAssessment]=useState(
      location.state?.assessment||null
    )
    const [result,setResult]=useState(
      location.state?.result||null
    )
    const [loading,setLoading]=useState(true)
    const [retaking,setRetaking]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        let cancelled=false
        async function loadResult(){
            try{
                setLoading(true)
                setError('')
                const response=await api.get(
                  `/courses/assessments/${assessmentId}/result/`
                )
                if (cancelled) return
                setAssessment(response.data)
                setResult({
                  ...response.data.result,
                  certificate_id:response.data.certificate?.certificate_id??null,
                  certificate_url:response.data.certificate?.certificate_url??null,
                })
            }catch(err){
              console.error('failed to load assessment result:',err.response?.data||err)
                if (!cancelled) setError(getErrorMessage(err))
        }finally{
            if (!cancelled) setLoading(false)
        }
        }
        loadResult()
        return ()=>{
            cancelled=true
        }
    },[assessmentId])
    const handleRetake=async ()=>{
        if (!result||result.passed){
          return
        }
        try{
            setRetaking(true)
            const response=await api.post(
              `/courses/${courseId}/assessment/start/`
            )
            navigate(`/assessments/${response.data.id}/take/`)
        }catch(err){
            console.error(getErrorMessage(err))
        }finally{
            setRetaking(false)
        }
    }
    if (loading){
      return (
        <div className="assessment-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mt-3 mb-0">
            Loading your assessment results...
          </p>
        </div>
      </div>
      )
    }
    if (error||!result){
        return (
            <div className="assessment-page">
        <div className="container py-5">
          <div className="alert alert-danger">
            {error || 'Assessment result not found.'}
          </div>

          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2" />
            Go Back
          </button>
        </div>
      </div>
        )
    }
    const title=result.assessment_title||result.course_title||'Assessment'
    const mentorName=result.mentor_name||result.mentor?.full_name
    return (
        <div className="assessment-page">
      <header className="assessment-topbar">
        <div className="container-fluid px-3 px-lg-4">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <Link to="/feed/" className="brand-logo">
              <span className="brand-mark">
                <i className="bi bi-diagram-3-fill" />
              </span>
              <span>
                Skill<span>Swap</span>
              </span>
            </Link>

            <div className="d-none d-md-block course-heading">
              <strong>{title}</strong>
              {mentorName && <small>Mentor: {mentorName}</small>}
            </div>

            <Link
              to="/my-courses/"
              className="btn btn-light border btn-sm"
            >
              My Courses
            </Link>
          </div>
        </div>
      </header>

      <main className="container assessment-container">
        <nav className="breadcrumb small mb-4">
          <Link to="/my-learning/" className="breadcrumb-item">
            My Learning
          </Link>
          <Link to="/my-courses/" className="breadcrumb-item">
            My Courses
          </Link>
          <span className="breadcrumb-item active">
            Assessment Results
          </span>
        </nav>

        <section className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 mb-5">
          <div>
            <div className="d-flex align-items-center flex-wrap gap-3 mb-2">
              <h1 className="page-title mb-0">Assessment Results</h1>
              <span className="badge badge-passed">
                <i className="bi bi-check-circle me-1" />
                Assessment Completed
              </span>
            </div>

            <p className="text-secondary mb-0">
              Here's how you performed in{' '}
              <strong className="text-dark">{title}</strong>
              {mentorName && <> • Mentored by {mentorName}</>}
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link
              to={result.course_url || '/my-courses/'}
              className="btn btn-light border"
            >
              <i className="bi bi-arrow-left me-2" />
              Back to Course
            </Link>

            {!result.passed && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleRetake}
                disabled={retaking}
              >
                {retaking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-repeat me-2" />
                    Retake Assessment
                    {result.attempts_remaining != null &&
                      ` (${result.attempts_remaining} left)`}
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        <div className="d-flex flex-column gap-5">
          <ScoreOverview result={result} />

          <AIsummary
            result={result}
            onRecommendationClick={(items) => {
              const firstUrl = items.find((item) => item?.url)?.url;
              if (firstUrl) navigate(firstUrl);
            }}
          />

          <QuestionReview
            questions={assessment?.questions || []}
            result={result}
          />

          <section className="final-action-banner">
            <div className="d-flex align-items-center gap-3">
              <span className="certificate-icon">
                <i className="bi bi-award" />
              </span>

              <div>
                <h2 className="h4 fw-bold mb-1">
                  {result.passed
                    ? 'Congratulations on Passing!'
                    : 'Keep Moving Forward'}
                </h2>
                <p className="mb-0">
                  {result.passed
                    ? 'Continue learning and build on your progress.'
                    : 'Review your feedback and strengthen your understanding before your next attempt.'}
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {result.passed && result.certificate_url && (
                <button
                type='button'
                className='btn btn-light'
                onClick={()=>{
                  navigate(
                    `/certificates/?certificateId=${result.certificate_id}`
                  )
                }}>
                  <i className="bi bi-patch-check me-2" />
                  View Certificate
                </button>
              )}

              <Link
                to={result.course_url || '/my-courses/'}
                className="btn btn-success"
              >
                Continue Learning
                <i className="bi bi-arrow-right ms-2" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="assessment-footer">
        SkillSwap Learner Portal
      </footer>
    </div>
    )
}

export default AssessmentResult