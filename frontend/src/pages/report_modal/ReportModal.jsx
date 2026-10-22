import {createPortal} from 'react-dom'
import { useEffect,useState } from "react";

import './ReportModal.css'

const REPORT_TYPES=[
    { value: "HARASSMENT", label: "Harassment" },
    { value: "SPAM", label: "Spam" },
    {
        value: "INAPPROPRIATE_CONTENT",
        label: "Inappropriate Content",
    },
    { value: "ABUSE", label: "Abuse" },
    { value: "FRAUD", label: "Fraud" },
    { value: "IMPERSONATION", label: "Impersonation" },
    { value: "OTHER", label: "Other" },
]

const TARGET_LABELS={
    USER: "User",
    MENTOR: "Mentor",
    POST: "Post",
    SESSION: "Session",
    MESSAGE: "Message",
    REVIEW: "Review",
}

function ReportModal({
    target,
    apiClient,
    onClose,
    onSuccess
}){
    const [step,setStep]=useState(1)
    const [reportType,setReportType]=useState('')
    const [description,setDescription]=useState('')
    const [submitting,setSubmitting]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        if (!target) return
        const handleEscape=(event)=>{
            if (event.key==='Escape' && !submitting){
                onClose()
            }
        }
        document.addEventListener('keydown',handleEscape)
        return ()=>
            document.removeEventListener('keydown',handleEscape)
    },[target,submitting,onClose])
    useEffect(() => {
  console.log("ReportModal MOUNTED");

  return () => {
    console.log("ReportModal UNMOUNTED");
  };
}, []);
    if (!target) return null
    const targetLabel=TARGET_LABELS[target.type]
    const handleSubmit=async ()=>{
        if (!reportType){
            setError('please select a report type')
            return
        }
        if (!description.trim()){
            setError('please describe the issue')
            return
        }
        if (!targetLabel||target.id==null){
            setError('invalid report target')
            return
        }
        if (!apiClient?.post){
            setError('report api client is not configured')
            return
        }
        const reportedUserId=target.reportedUserId
        const reportedMentorId=target.reportedMentorId
        if (
            (reportedUserId!=null&&reportedMentorId!=null)||
            (reportedUserId==null&&reportedMentorId==null)
        ){
            setError('unable to identify user or mentor associated with this report')
            return
        }
        const payload={
            ...(reportedUserId!=null
                ?{reported_user:reportedUserId}:{reported_mentor:reportedMentorId}
            ),
            target_type:target.type,
            target_id:target.id,
            report_type:reportType,
            description:description.trim(),
        }
        setSubmitting(true)
        setError('')
        try{
            await apiClient.post(
                '/reports/create/',
                payload
            )
            onClose()
            onSuccess?.(
                `${targetLabel} report submitted successfully. Our admin team will review it`
            )
        }catch(err){
            console.error('report submission failed:',err)
            const data=err.response?.data
            const message=
            data?.detail||
            data?.non_field_errors?.[0]||
            Object.values(data||{}).flat().find((value)=>typeof value==='string')||
            'unable to submit your report. pls try again'
            setError(message)
        }finally{
            setSubmitting(false)
        }
    }
    return createPortal(
        <div
            className="report-modal-backdrop"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !submitting
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="report-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-modal-title"
            >
                <div className="report-modal-header">
                    <div>
                        <span className="report-modal-icon">
                            <i className="bi bi-exclamation-circle" />
                        </span>

                        <h5 id="report-modal-title">
                            Report {targetLabel}
                        </h5>

                        <p>Step {step} of 2</p>
                    </div>

                    <button
                        type="button"
                        className="report-modal-close"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="report-progress">
                    {[1, 2].map((number) => (
                        <div
                            key={number}
                            className={`report-progress-step ${
                                step >= number ? "active" : ""
                            }`}
                        />
                    ))}
                </div>

                <div className="report-modal-body">
                    {step === 1 ? (
                        <>
                            <h6>Why are you reporting this?</h6>

                            <p className="report-help-text">
                                Select the reason that best describes
                                the issue.
                            </p>

                            <div className="report-type-list">
                                {REPORT_TYPES.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`report-type-option ${
                                            reportType === type.value
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value={type.value}
                                            checked={
                                                reportType === type.value
                                            }
                                            onChange={() => {
                                                setReportType(type.value);
                                                setError("");
                                            }}
                                        />

                                        <span>{type.label}</span>

                                        {reportType === type.value && (
                                            <i className="bi bi-check-circle-fill ms-auto" />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h6>Tell us what happened</h6>

                            <p className="report-help-text">
                                Describe the issue so our moderation
                                team can review it.
                            </p>

                            <textarea
                                className="form-control report-description"
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe the issue..."
                                value={description}
                                onChange={(event) => {
                                    setDescription(event.target.value);
                                    setError("");
                                }}
                            />

                            <div className="report-character-count">
                                {description.length}/2000
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="report-error" role="alert">
                            <i className="bi bi-exclamation-triangle me-2" />
                            {error}
                        </div>
                    )}
                </div>

                <div className="report-modal-footer">
                    {step === 1 ? (
                        <>
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={!reportType}
                                onClick={() => {
                                    setError("");
                                    setStep(2);
                                }}
                            >
                                Continue
                                <i className="bi bi-arrow-right ms-2" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn-light"
                                disabled={submitting}
                                onClick={() => {
                                    setError("");
                                    setStep(1);
                                }}
                            >
                                <i className="bi bi-arrow-left me-2" />
                                Back
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                disabled={
                                    submitting || !description.trim()
                                }
                                onClick={handleSubmit}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Report
                                        <i className="bi bi-send ms-2" />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ReportModal