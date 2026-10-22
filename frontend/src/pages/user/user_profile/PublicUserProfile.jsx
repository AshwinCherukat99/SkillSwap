import React,{useEffect,useState,useCallback} from "react";
import { Link,useParams } from "react-router-dom"; 

import api from "../../../services/api";

import './PublicUserProfile.css'
import ProfileOverview from "../../../components/user/user_profile/ProfileOverview";
import UserStats from "../../../components/user/user_profile/UserStats";
import PersonalInformation from "../../../components/user/user_profile/PersonalInformation";
import UserBadges from "../../../components/user/user_profile/UserBadges";

const PublicUserProfile=()=>{
    const {userId}=useParams()
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const loadProfile=useCallback(async ()=>{
        if (!userId||userId==='undefined'){
            setError('a valid user id is required')
            setLoading(false)
            return 
        }
        try{
            setLoading(true)
            setError('')
            const response=await api.get(
                `/auth/${userId}/profile/`
            )
            setUser(response.data)
        }catch(err){
            setUser(null)
            setError(
                err.response?.status===404?'this profile does not exist or is unavailable':
                err.response?.data?.detail||'unable to load this profile, pls try again later'
            )
        }finally{
            setLoading(false)
        }
    },[userId])
    useEffect(()=>{
        loadProfile()
    },[loadProfile])
    const handleMessage = (profileUser) => {
    // Connect this to your existing chat route/API.
    console.info("Open conversation with user:", profileUser.id);
  };

  const handleAddFriend = (profileUser) => {
    // Connect this to your existing friendship request API.
    console.info("Send friend request to user:", profileUser.id);
  };

  const handleReport = (profileUser) => {
    // Connect this to your report-submission API.
    console.info("Report user:", profileUser.id);
  };
  return (
    <>

      <main className="ss-public-page">
        <div className="container-fluid ss-public-container">
          <div className="mb-4">
            <Link
              to="/community/"
              className="text-decoration-none fw-semibold"
            >
              <i className="bi bi-arrow-left me-2" />
              Back to Community
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary mt-3">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning">
              <h2 className="h5">Profile unavailable</h2>
              <p className="mb-3">{error}</p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={loadProfile}
              >
                Try again
              </button>
            </div>
          ) : user ? (
            <>
              <div className="mb-4">
                <span className="small text-uppercase text-secondary fw-semibold">
                  Public member profile
                </span>
                <h1 className="h2 fw-bold mt-1">
                  {user.full_name || user.username}
                </h1>
                <p className="text-secondary">
                  Explore this member's learning journey and achievements.
                </p>
              </div>

              <div className="d-flex flex-column gap-4">
                <ProfileOverview
                  user={user}
                  onAddFriend={handleAddFriend}
                  onMessage={handleMessage}
                  onReport={handleReport}
                />

                <UserStats user={user} />

                <div className="row g-4">
                  <div className="col-12 col-lg-7">
                    <PersonalInformation user={user} />
                  </div>

                  <div className="col-12 col-lg-5">
                    <UserBadges badges={user.badges || []} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  )
}

export default PublicUserProfile