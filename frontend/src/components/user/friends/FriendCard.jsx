import React,{useState,useCallback,useEffect} from 'react'

import api from '../../../services/api'
import {MessageCircle,CalendarPlus,User,Users} from 'lucide-react'
import ReportModal from '../../../pages/report_modal/ReportModal'

const FriendCard=({
    friend,
    onProfile,
    onChat,
    onRequestSession
})=>{
    const [reportTarget,setReportTarget]=useState(null)
    const [reportToast,setReportToast]=useState('')
    const initials=friend.name?.split(' ').map(word=>word[0]).join('').slice(0,2).toUpperCase()
    const person=friend
    const handleCloseReport=useCallback(()=>{
        setReportTarget(null)
    })
    const handleReportSuccess=(message)=>{
        setReportToast(message)
    }
    const onReportUser=()=>{
        const reportedUserId=person?.id
        if (reportedUserId===null){
            console.error('friend data:',friend)
            alert('unable to identify the user. check the api response')
            return
        }
        setReportTarget({
            type:"USER",
            id:reportedUserId,
            reportedUserId,
        })
    }
    useEffect(()=>{
        if (!reportToast) return
        const timeout=setTimeout(()=>{
            setReportToast('')
        },4000)
        return ()=>clearTimeout(timeout)
    },[reportToast])
    return (
        <div className="card border-0 shadow-sm h-100 friend-card">

            <div className="card-body p-4 d-flex flex-column">

                <div className="d-flex flex-column align-items-end gap-3">

    <div className="dropdown">
      <button
        type="button"
        className="btn btn-light btn-sm rounded-pill d-flex align-items-center gap-1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-exclamation-circle"></i>
        <span>Report</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={onReportUser}
          >
            <i className="bi bi-person-exclamation text-danger"></i>
            Report User
          </button>
        </li>
      </ul>
    </div>
  </div>


                {/* Profile image */}
                <div className="text-center">

                    <div className="position-relative d-inline-block mb-3">

                        {friend.profile_image ? (
                            <img
                                src={friend.profile_image}
                                alt={friend.name}
                                className="rounded-circle friend-avatar"
                            />
                        ) : (
                            <div className="rounded-circle friend-avatar friend-avatar-placeholder">
                                {initials || 'U'}
                            </div>
                        )}

                        {/* Online indicator */}
                        <span
                            className={`position-absolute bottom-0 end-0 rounded-circle border border-2 border-white ${
                                friend.is_online
                                    ? 'bg-success'
                                    : 'bg-secondary'
                            }`}
                            style={{
                                width: '18px',
                                height: '18px'
                            }}
                        />
                    </div>

                    <h5 className="fw-semibold mb-1">
                        {friend.name}
                    </h5>

                    <p className="text-muted mb-3">
                        @{friend.username}
                    </p>

                </div>


                {/* Skills */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">

                    {friend.skills?.slice(0, 3).map((skill) => (
                        <span
                            key={skill.id}
                            className="badge bg-primary-subtle text-primary px-2 py-2"
                        >
                            {skill.name}
                        </span>
                    ))}

                </div>


                {/* Friend information */}
                <div className="border-top pt-3 mb-4">

                    <div className="d-flex justify-content-between text-muted small">

                        <span>
                            <Users size={15} className="me-1" />
                            {friend.mutual_friends || 0} Mutual
                        </span>

                        <span>
                            {friend.friends_since
                                ? `Friends since ${new Date(
                                    friend.friends_since
                                ).getFullYear()}`
                                : 'Friends'}
                        </span>

                    </div>

                </div>


                {/* Buttons */}
                <div className="mt-auto">

                    <div className="row g-2 mb-2">

                        <div className="col-6">

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => onProfile(friend)}
                            >
                                <User size={16} className="me-1" />
                                Profile
                            </button>

                        </div>

                        <div className="col-6">

                            <button
                                className="btn btn-light w-100"
                                onClick={() => onChat(friend)}
                            >
                                <MessageCircle size={16} className="me-1" />
                                Chat
                            </button>

                        </div>

                    </div>


                    <button
                        className="btn btn-success w-100"
                        onClick={() => onRequestSession(friend)}
                    >
                        <CalendarPlus size={17} className="me-1" />
                        Request Session
                    </button>

                </div>

            </div>

            {reportTarget&&(
                <ReportModal
                target={reportTarget}
                apiClient={api}
                onClose={handleCloseReport}
                onSuccess={handleReportSuccess}/>
            )}

            {reportToast&&(
                <div
        className="report-toast"
        role="status"
        aria-live="polite"
    >
        <i className="bi bi-check-circle-fill" />

        <span>{reportToast}</span>

        <button
            type="button"
            onClick={() => setReportToast("")}
            aria-label="Dismiss notification"
        >
            &times;
        </button>
    </div>
            )}


        </div>
    )
}

export default FriendCard