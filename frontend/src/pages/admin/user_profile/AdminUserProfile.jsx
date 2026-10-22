import React,{useCallback,useEffect,useState} from "react";
import { Link,useParams } from "react-router-dom";

import adminApi from "../../../services/adminApi";

import './AdminUserProfile.css'
import UserProfileOverview from "../../../components/admin/user_profile/UserProfileOverview";
import UserEngagementStats from "../../../components/admin/user_profile/UserEngagementStats";
import PersonalInformation from "../../../components/admin/user_profile/PersonalInformation";

const AdminUserProfile=()=>{
    const {userId}=useParams()
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [notice,setNotice]=useState('')
    const loadUser=useCallback(async ()=>{
        if (!userId || userId==='undefined'){
            setError('user id is missing from url')
            setLoading(false)
            return
        }
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                `/admin/users/${userId}/`
            )
            setUser(response.data)
        }catch(err){
            setError(
                err.response?.data?.detail||'unable to load this user profile'
            )
        }finally{
            setLoading(false)
        }
    },[userId])
    useEffect(()=>{
        loadUser()
    },[loadUser]) 
    if (loading){
        return (
            <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-secondary mt-3 mb-0">Loading user profile...</p>
      </div>
        )
    }
    if (error && !user){
        return (
            <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/admin/user-management/" className="btn btn-outline-secondary">
          Back to User Management
        </Link>
      </div>
        )
    }
    if (!user) return null
    return (
        <main className="container-fluid bg-body-tertiary min-vh-100 py-4 py-lg-5">
      <div className="user-profile-container mx-auto">
        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard/">Admin Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin/user-management/">
                    User Management
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Profile
                </li>
              </ol>
            </nav>

            <h1 className="h2 fw-bold mb-2">User Profile</h1>
            <p className="text-secondary mb-0">
              View account information and engagement statistics.
            </p>
          </div>

          <div>
            <Link
              to="/admin/user-management/"
              className="btn btn-light border"
            >
              <i className="bi bi-arrow-left me-2" />
              Back to User Management
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {notice && <div className="alert alert-success">{notice}</div>}

        <div className="d-flex flex-column gap-4">
          <UserProfileOverview
            user={user}
          />

          <UserEngagementStats user={user} />

          <PersonalInformation user={user} />
        </div>
      </div>
    </main>
    )
}

export default AdminUserProfile