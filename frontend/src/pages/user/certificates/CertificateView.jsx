import { useEffect,useState } from "react";
import {useParams,useNavigate} from 'react-router-dom'

import './CertificateView.css'

import { API_BASE_URL } from "../../../config";

const CertificateView=()=>{
    const {certificateId}=useParams()
    const navigate=useNavigate()
    const [pdfUrl,setPdfUrl]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        let objectUrl
        const fetchCertificate=async ()=>{
            try{
                setLoading(true)
                setError('')
                const accessToken=localStorage.getItem('access_token')
                if (!accessToken){
                    throw new Error('please log in to view certificate')
                }
                const response=await fetch(
                    `${API_BASE_URL}/certificates/${certificateId}/view/`,
                    {
                        method:'GET',
                        headers:{
                            Authorization:`Bearer ${accessToken}`
                        }
                    }
                )
                if (!response.ok){
                    if (response.status===401){
                        throw new Error('your session has expired, please log in again')
                    }
                    if (response.status===403||response.status===404){
                        throw new Error('certificate not found or you do not have permisssion to view it')
                    }
                    if (response.status===400){
                        throw new Error('this certificate is no longer valid')
                    }
                    throw new Error('unable to load certificate')
                }
                const blob=await response.blob()
                if (blob.type!=='application/pdf'){
                    throw new Error('the server did not return a valid pdf')
                }
                objectUrl=URL.createObjectURL(blob)
                setPdfUrl(objectUrl)
            }catch(error){
                setError(error.message||'Something went wrong')
            }finally{
                setLoading(false)
            }
        }
        fetchCertificate()
        return ()=>{
            if (objectUrl){
                URL.revokeObjectURL(objectUrl)
            }
        }
    },[certificateId])
    const handleDownload=()=>{
        if (!pdfUrl) return 
        const link=document.createElement('a')
        link.href=pdfUrl
        link.download=`SkillSwap-Certificate-${certificateId}.pdf`  
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
    return (
        <div className="certificate-view-page">
      <div className="container-fluid px-lg-5 py-4">

        {/* Page Header */}
        <div className="certificate-view-header">

          <div>
            <h4 className="mb-1">View Certificate</h4>

            <p className="text-muted mb-0">
              Your course completion certificate
            </p>
          </div>

          <div className="certificate-view-actions">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              <i className="bi bi-download me-2"></i>
              Download Certificate
            </button>

          </div>
        </div>

        {/* PDF Viewer */}
        <div className="certificate-viewer-container">

          {loading && (
            <div className="certificate-view-state">
              <div
                className="spinner-border text-primary"
                role="status"
              />

              <p className="mt-3 mb-0">
                Loading your certificate...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="certificate-view-state">

              <i className="bi bi-file-earmark-pdf certificate-error-icon"></i>

              <h5 className="mt-3">
                Certificate unavailable
              </h5>

              <p className="text-muted">
                {error}
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>

            </div>
          )}

          {!loading && !error && pdfUrl && (
            <iframe
              src={pdfUrl}
              title="SkillSwap Certificate"
              className="certificate-pdf-frame"
            />
          )}

        </div>

        {/* Footer */}
        <div className="certificate-view-footer">
          <i className="bi bi-shield-check me-2"></i>
          Issued by SkillSwap Learning Platform
        </div>

      </div>
    </div>
    )
}

export default CertificateView