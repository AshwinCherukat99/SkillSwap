import React,{useCallback,useEffect,useState} from "react";   
import {Link,useNavigate,useParams} from 'react-router-dom'

import MentorOverview from "../../../components/admin/mentor_profile/MentorOverview";
import MentorMetrics from "../../../components/admin/mentor_profile/MetricCard";
import ProfessionalInformation from "../../../components/admin/mentor_profile/ProfessionalInformation";

import adminApi from '../../../services/adminApi'

import './AdminMentorProfile.css'

const AdminMentorProfile=()=>{
    const {mentorId}=useParams()
    const navigate=useNavigate()
    const [mentor,setMentor]=useState(null)
    const [reviews,setReviews]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const loadMentor=useCallback(async ()=>{
        setLoading(true)
        setError('')
        try{
            const response=await adminApi.get(`/admin/mentors/${mentorId}/`) 
            setMentor(response.data.mentor)
            setReviews(response.data.reviews??[])
        }catch(err){
            if (err.respone?.status===400){
                setError('mentor not found')
            }else if(err.response?.status===401){
                setError('your admin session has expired. please log in again')
            }else if(err.response?.status===403){
                setError('you do not have permission to view this mentor')
            }else{
                setError(
                    err.response?.data?.detaeil||
                    'unable to load mentor profile, please try again'
                )
            }
        }finally{
            setLoading(false)
        }
    },[mentorId])
    useEffect(()=>{
        loadMentor()
    },[loadMentor])
    if (loading){
        return (
            <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading mentor profile...</span>
        </div>
        <p className="text-secondary mt-3">Loading mentor profile...</p>
      </div>
        )
    }
    if (error&&!mentor){
        return (
            <div className="container-fluid py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadMentor}
        >
          Retry
        </button>

        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate('/admin/mentor-management/')}
        >
          Back to mentor management
        </button>
      </div>
        )
    }
    if (!mentor) return null
    return (
        <div className="admin-mentor-page container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard/">Admin Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin/mentor-management/">Mentor Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Mentor Profile
              </li>
            </ol>
          </nav>

          <h1 className="h3 fw-bold mb-2">Mentor Profile</h1>

          <p className="text-secondary mb-0">
            View mentor credentials, account status, and performance metrics.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/mentor-management')}
        >
          <i className="bi bi-arrow-left me-2" />
          Back to Mentor Management
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss error"
            onClick={() => setError('')}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible" role="status">
          {success}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss message"
            onClick={() => setSuccess('')}
          />
        </div>
      )}

      <MentorOverview
        mentor={mentor}
      />

      <MentorMetrics mentor={mentor} />

      <ProfessionalInformation mentor={mentor} />

      <section className="card border-0 shadow-sm rounded-4 mb-4">
  <div className="card-body p-4">
    <h2 className="h5 fw-bold mb-3">Reviews Received</h2>

    <p className="text-secondary">
      {reviews.length} visible reviews
    </p>

    {reviews.length === 0 ? (
      <p className="text-secondary mb-0">
        No visible reviews found.
      </p>
    ) : (
      <div className="d-flex flex-column gap-3">
        {reviews.map((review) => (
          <article
            className="border rounded-3 p-3"
            key={review.id}
          >
            <div className="d-flex justify-content-between gap-3">
              <strong>
                {review.reviewer_full_name ||
                  review.reviewer_username}
              </strong>

              <span className="text-warning text-nowrap">
                {'★'.repeat(
                  Math.min(5, Math.max(0, Number(review.rating) || 0))
                )}
                <span className="text-secondary ms-1">
                  {review.rating}/5
                </span>
              </span>
            </div>

            <p className="mt-2 mb-2">
              {review.review || 'No written feedback.'}
            </p>

            <small className="text-secondary">
              {new Date(review.created_at).toLocaleString()}
            </small>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

    </div>
    )
}

export default AdminMentorProfile