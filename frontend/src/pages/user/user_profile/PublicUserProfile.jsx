import React,{useEffect,useState,useCallback} from "react";
import { useNavigate,Link,useParams } from "react-router-dom"; 

import api from "../../../services/api";

import './PublicUserProfile.css'
import ProfileOverview from "../../../components/user/user_profile/ProfileOverview";
import UserStats from "../../../components/user/user_profile/UserStats";
import PersonalInformation from "../../../components/user/user_profile/PersonalInformation";
import UserBadges from "../../../components/user/user_profile/UserBadges";

import ReportModal from "../../report_modal/ReportModal";

const PublicUserProfile=()=>{
    const navigate=useNavigate()
    const {userId}=useParams()
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [friendshipStatus,setFriendshipStatus]=useState('NONE')
    const [friendLoading,setFriendLoading]=useState(false)
    const [friendMessage,setFriendMessage]=useState('')  
    const [reportTarget,setReportTarget]=useState(null)
    const [reportSuccess,setReportSuccess]=useState('')
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
    const handleMessage = async (profileUser) => {
      try{
        const response=await api.post(
          '/chat/conversations/direct/',
          {
            user_id:profileUser.id
          }
        )
        const conversationId=response.data.id
        navigate(`/direct-chat/?conversation=${conversationId}`)
      }catch(err){
        console.error('failed to open conversation:',err)
        setError(err.response?.data?.detail||'unable to open conversation')
      }
  };

  const handleAddFriend = async (profileUser) => {
    if (!profileUser.id||friendLoading) return
    try{
      setFriendLoading(true)
      setFriendMessage('')
      const response=await api.post(
        '/auth/friends/add/',
        {
          receiver_id:profileUser.id
        }
      )
      setFriendshipStatus('PENDING_SENT')
      setFriendMessage(response.data.message||'friend request sent successfully')
    }catch(err){
      console.error('failed to send friend request:',err) 
      setFriendMessage(
        err.response?.data?.detail||
        err.response?.data?.message||
        err.response?.data?.receiver?.[0]||
        'unable to send friend request, please try again'
      )
    }finally{
      setFriendLoading(false)
    }
  };

  const handleReport = (profileUser) => {
    setReportSuccess('')
    setReportTarget({
      type:'USER',
      id:profileUser.id,
      reportedUserId:profileUser.id,
      reportedMentorId:null
    })
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
                {reportSuccess&&(
                  <div
        className="alert alert-success alert-dismissible fade show"
        role="alert"
    >
        <i className="bi bi-check-circle me-2" />
        {reportSuccess}

        <button
            type="button"
            className="btn-close"
            onClick={() => setReportSuccess("")}
            aria-label="Close"
        />
    </div>
                )}
                <ProfileOverview
                  user={user}
                  onAddFriend={handleAddFriend}
                  onMessage={handleMessage}
                  onReport={handleReport}
                  friendshipStatus={friendshipStatus}
                  friendLoading={friendLoading}
                  friendMessage={friendMessage}
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
        {reportTarget&&(
          <ReportModal
          target={reportTarget}
          apiClient={api}
          onClose={()=>setReportTarget(null)}
          onSuccess={(message)=>{
            setReportTarget(null)
            setReportSuccess(message)
          }}
          />
        )}
      </main>
    </>
  )
}

export default PublicUserProfile