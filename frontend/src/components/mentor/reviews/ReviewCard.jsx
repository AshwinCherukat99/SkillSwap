import {useState,useCallback,useEffect} from 'react'

import ReportModal from '../../../pages/report_modal/ReportModal'
import mentorApi from '../../../services/mentorApi'

const ReviewCard=({review,onReply,replyLoading})=>{
    const [reportTarget,setReportTarget]=useState(null)
    const [reportToast,setReportToast]=useState('')
    const [message,setMessage]=useState("")
    const [expanded,setExpanded]=useState(false)
    const profileImage=review?.reviewer_image?review.reviewer_image.startsWith('http')?review.reviewer_image:`http://127.0.0.1:8000${review.reviewer_image}`:null
    const person=review.reviewer
    const handleCloseReport=useCallback(()=>{
        setReportTarget(null)
    },[])
    const handleReportSuccess=(message)=>{
        setReportToast(message)
    }
    const onReportUser = () => {
  const reportedUserId = person?.id ?? review?.reviewer_id;

  if (reportedUserId == null) {
    console.error("Review data:", review);
    alert("Unable to identify the reviewer. Check the review API response.");
    return;
  }

  setReportTarget({
    type: "USER",
    id: reportedUserId,
    reportedUserId,
  });
};

const onReportReview = () => {
  const reportedUserId = person?.id ?? review?.reviewer_id;

  if (review?.id == null || reportedUserId == null) {
    console.error("Review data:", review);
    alert("Unable to identify the review or its author.");
    return;
  }

  setReportTarget({
    type: "REVIEW",
    id: review.id,
    reportedUserId,
  });
};
    useEffect(()=>{
        if (!reportToast) return
        const timeout=setTimeout(()=>{
            setReportToast('')
        },4000)
        return ()=>clearTimeout(timeout)
    },[reportToast])
    const getInitials=()=>{
        const name=review?.reviewer_name||review?.reviewer_username||'Student'
        return name.split(' ').map((word)=>word[0]).join('').slice(0,2).toUpperCase()
    }
    const formatDate=(date)=>{
        if (!date){
            return ''
        }
        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day:'numeric',
                month:'short',
                year:'numeric',
            }
        )
    }
    const renderStars=(rating)=>{
        return (
            <div className="review-stars">

                {[1, 2, 3, 4, 5].map((star) => (

                    <i
                        key={star}
                        className={
                            star <= rating
                                ? "bi bi-star-fill"
                                : "bi bi-star"
                        }
                    ></i>

                ))}

            </div>
        )
    }
    const handleReply=()=>{
        if (!message.trim()){
            return 
        }
        onReply(
            review.id,
            message
        ) 
        setMessage('')
    }
    return (
        <div className="glass-card review-item">

            <div className="p-4 p-md-5">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
  {/* Reviewer details */}
  <div className="d-flex gap-3">
    {profileImage ? (
      <img
        src={profileImage}
        alt={review.reviewer_name}
        className="review-avatar"
      />
    ) : (
      <div className="review-avatar review-avatar-fallback">
        {getInitials()}
      </div>
    )}

    <div>
      <h5 className="mb-0 fw-bold">
        {review.reviewer_name}
      </h5>

      {review.is_verified && (
        <span className="verified-badge">
          <i className="bi bi-patch-check-fill"></i>
          Verified
        </span>
      )}

      <p className="review-meta mb-0">
        {review.course_title}
        {" • "}
        {formatDate(review.created_at)}
      </p>
    </div>
  </div>

  {/* Top-right controls */}
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

        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={onReportReview}
          >
            <i class="bi bi-file-earmark-text"></i>
            Report Review
          </button>
        </li>
      </ul>
    </div>
    {renderStars(Number(review.rating || 0))}
  </div>
</div>


                {/* Review text */}
                <div className="mb-3">

                    <p
                        className={
                            expanded
                                ? "review-comment"
                                : "review-comment review-comment-collapsed"
                        }
                    >
                        {review.review}
                    </p>


                    {review.review?.length > 250 && (

                        <button
                            type="button"
                            className="read-more-btn"
                            onClick={() =>
                                setExpanded(!expanded)
                            }
                        >
                            {expanded
                                ? "Show Less"
                                : "Read More"}
                        </button>

                    )}

                </div>


                {/* Tags */}
                {review.tags?.length > 0 && (

                    <div className="d-flex flex-wrap gap-2">

                        {review.tags.map((tag) => (

                            <span
                                className="review-tag"
                                key={tag}
                            >
                                #{tag}
                            </span>

                        ))}

                    </div>

                )}

            </div>


            {/* Existing Reply */}
            {review.reply && (

                <div className="mentor-reply">

                    <div className="d-flex gap-3">

                        <div className="mentor-reply-avatar">
                            M
                        </div>


                        <div className="flex-grow-1">

                            <div className="d-flex justify-content-between gap-3">

                                <p className="mentor-reply-name mb-1">
                                    You (Mentor)
                                </p>

                                <span className="review-meta">
                                    {formatDate(
                                        review.reply.created_at
                                    )}
                                </span>

                            </div>


                            <p className="mentor-reply-message mb-0">
                                "{review.reply.message}"
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* Reply Input */}
            {!review.reply && (

                <div className="reply-box">

                    <textarea
                        className="form-control reply-textarea"
                        placeholder={`Write a reply to ${review.student_name}...`}
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        maxLength={1000}
                    />


                    <div className="d-flex justify-content-end mt-2">

                        <button
                            type="button"
                            className="btn btn-primary reply-button"
                            onClick={handleReply}
                            disabled={
                                !message.trim() ||
                                replyLoading === review.id
                            }
                        >

                            {replyLoading === review.id ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    ></span>

                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send me-2"></i>

                                    Send Reply
                                </>
                            )}

                        </button>

                    </div>

                </div>

            )}

            {reportTarget&&(
                <ReportModal
                target={reportTarget}
                apiClient={mentorApi}
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

export default ReviewCard