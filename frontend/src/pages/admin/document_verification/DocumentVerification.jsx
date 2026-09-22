import React,{useEffect,useState} from 'react'

import {useNavigate,useParams} from 'react-router-dom'

import {ArrowLeft,Bell,Grid2X2,Moon} from 'lucide-react'

import adminApi from '../../../services/adminApi'

import './DocumentVerification.css'

import MentorSummary from '../../../components/admin/document_verification/MentorSummary'
import VerificationChecklist from '../../../components/admin/document_verification/VerificationChecklist'
import VerificationActions from '../../../components/admin/document_verification/VerificationActions'
import DocumentGallery from '../../../components/admin/document_verification/DocumentGallery'
import DocumentViewer from '../../../components/admin/document_verification/DocumentViewer'
import ActivityTimeline from '../../../components/admin/document_verification/ActivityTimeline'

const DocumentVerification=()=>{
    const {mentorId}=useParams()
    const navigate=useNavigate()
    const [mentor,setMentor]=useState(null)
    const [verification,setVerification]=useState(null)
    const [documents,setDocuments]=useState([])
    const [selectedDocument,setSelectedDocument]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [actionLoading,setActionLoading]=useState(false)
    const fetchVerification=async ()=>{
        try{
            setLoading(true)
        setError('')
        const response=await adminApi.get(
            `/admin/mentors/${mentorId}/verification/`
        )
        setMentor(response.data.mentor)
        setVerification(response.data.verification)
        setDocuments(response.data.documents||[])
        if (response.data.documents?.length>0){
            setSelectedDocument(response.data.documents[0])
        }
        }catch(error){
            console.error('failed to fetch mentor verification:',error)
            setError(error.response?.data?.error||error.response.data?.detail||'failed to load mentor verification')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchVerification()
    },[mentorId])
    const handleApprove=async ()=>{
        try{
            setActionLoading(true)
            await adminApi.post(
                `/admin/mentors/${mentorId}/verification/approve/`
            )
            await fetchVerification()
        }catch(error){
            console.error('failed to approve mentor:',error)
            setError(error.response?.data?.error||'failed to approve mentor')
        }finally{
            setActionLoading(false)
        }
    }
    const handleRequestInfo=async (message)=>{
        try{
            setActionLoading(true)
            await adminApi.post(
                `/admin/mentors/${mentorId}/verification/request-info`,
                {
                    message,
                }
            )
            await fetchVerification()
        }catch(error){
            console.log('failed to request mentor information:',error)
            setError(error.response?.data?.error||'failed to request additional information')
        }finally{
            setActionLoading(false)
        }
    }
    const handleReject=async (rejectionReason)=>{
        try{
            setActionLoading(true)
            await adminApi.post(
                `/admin/mentors/${mentorId}/verification/reject/`,
                {
                    rejection_reason:rejectionReason
                }
            )
            await fetchVerification()
        }catch(error){
            console.error('failed to reject mentor:',error)
            setError(error.response?.data?.detail||'failed to reject mentor')
        }finally{
            setActionLoading(false)
        }
    }
    if (loading){
        return (
            <div className="container-fluid py-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading mentor verification...
                </p>
            </div>
        )
    }
    if (error&&!mentor){
        <div className="container-fluid py-5">
                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
    }
    return (
        <div className="mentor-verification-page min-vh-100">

            {/* Top navigation */}
            <header className="mentor-verification-topbar bg-white border-bottom sticky-top">
                <div className="container-fluid px-4">

                    <div className="d-flex align-items-center justify-content-between py-2">

                        <div className="d-flex align-items-center gap-3">

                            <button
                                className="btn btn-light rounded-circle"
                                onClick={() =>
                                    navigate('/admin/dashboard')
                                }
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <div className="small text-muted">
                                <span>Dashboard</span>

                                <span className="mx-2">
                                    /
                                </span>

                                <span>Verification</span>

                                <span className="mx-2">
                                    /
                                </span>

                                <strong className="text-primary">
                                    {mentor?.username}
                                </strong>
                            </div>

                        </div>

                        <div className="d-flex align-items-center gap-2">

                            <button className="btn btn-light rounded-circle">
                                <Bell size={18} />
                            </button>

                            <button className="btn btn-light rounded-circle">
                                <Grid2X2 size={18} />
                            </button>

                            <button className="btn btn-light rounded-circle">
                                <Moon size={18} />
                            </button>

                        </div>

                    </div>

                </div>
            </header>


            {/* Main content */}
            <main className="container-fluid px-4 py-4">

                <div className="verification-container mx-auto">

                    {/* Page heading */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">

                        <div>
                            <h1 className="fw-bold mb-2">
                                Mentor Verification
                            </h1>

                            <p className="text-muted mb-0">
                                Review submitted documents and verify
                                qualifications for mentor applicants.
                            </p>
                        </div>

                    </div>


                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}


                    <div className="row g-4">

                        {/* LEFT COLUMN */}
                        <div className="col-xl-4">

                            <div className="d-flex flex-column gap-4">

                                <MentorSummary
                                    mentor={mentor}
                                    verification={verification}
                                />

                                <VerificationChecklist
                                    verification={verification}
                                />

                                <VerificationActions
                                    mentor={mentor}
                                    verification={verification}
                                    loading={actionLoading}
                                    onApprove={handleApprove}
                                    onRequestInfo={handleRequestInfo}
                                    onReject={handleReject}
                                />

                            </div>

                        </div>


                        {/* RIGHT COLUMN */}
                        <div className="col-xl-8">

                            <div className="d-flex flex-column gap-4">

                                <DocumentGallery
                                    documents={documents}
                                    selectedDocument={selectedDocument}
                                    onSelectDocument={
                                        setSelectedDocument
                                    }
                                />

                                <DocumentViewer
                                    document={selectedDocument}
                                />

                            </div>

                        </div>

                    </div>


                    <ActivityTimeline
                        verification={verification}
                        documents={documents}
                    />

                </div>

            </main>

        </div>
    )
}

export default DocumentVerification