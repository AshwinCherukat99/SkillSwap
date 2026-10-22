import React,{useEffect,useState,useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

function CertificateCard({certificate,isSelected=False}){
    const navigate=useNavigate()
    const [downloading,setDownloading]=useState(false)
    const cardRef=useRef(null)
    useEffect(()=>{
        if (isSelected){
            cardRef.current?.scrollIntoView({
                behaviour:'smooth',
                block:'center',
            })
        }
    },[isSelected])
    const handleViewCertificate=()=>{
        navigate(`/certificates/${certificate.certificate_id}`)
    }
    const handleDownloadCertificate=async ()=>{
        if (!certificate.is_valid||downloading) return
        try{
            setDownloading(true)
            const response=await api.get(
                `/certificates/${certificate.certificate_id}/download/`,
                {
                    responseType:'blob'
                }
            )
            const blob=new Blob(
                [response.data],
                {type:'application/pdf'}
            )
            const url=window.URL.createObjectURL(blob)
            const link=document.createElement('a')
            link.href=url
            link.download=`SkillSwap-Certificate-${certificate.certificate_number}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }catch(err){
            console.error('certificate download failed-',err)
            alert('unablet to download certificate. please try again')
        }finally{
            setDownloading(false)
        }
    }
    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    return (
        <div ref={cardRef} className={`card h-100 border-0 shadow-sm certificate-card ${
    isSelected ? 'certificate-card-selected' : ''
  }`}>
            <div className="card h-100 border-0 shadow-sm certificate-card">

                {/* Certificate Preview */}
                <div className="certificate-preview position-relative">

                    <div className="certificate-preview-content text-center">

                        <div className="mb-2">
                            <i className="bi bi-award fs-1 text-primary"></i>
                        </div>

                        <small className="text-uppercase text-muted fw-semibold">
                            Certificate of Completion
                        </small>

                        <h5 className="fw-bold mt-2 mb-1">
                            {certificate.course_title}
                        </h5>

                        <small className="text-muted">
                            SkillSwap
                        </small>

                    </div>

                    {/* Valid Badge */}
                    {certificate.is_valid && (
                        <span className="badge bg-success position-absolute top-0 end-0 m-3">
                            <i className="bi bi-check-circle me-1"></i>
                            Valid
                        </span>
                    )}

                    {!certificate.is_valid && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-3">
                            Invalid
                        </span>
                    )}
                </div>

                {/* Card Body */}
                <div className="card-body p-4">

                    {/* Course */}
                    <h5 className="fw-semibold mb-2">
                        {certificate.course_title}
                    </h5>

                    {/* Category */}
                    {certificate.course_category && (
                        <span className="badge bg-light text-dark border mb-3">
                            {certificate.course_category}
                        </span>
                    )}

                    {/* Certificate Information */}
                    <div className="certificate-card-info">

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">
                                Certificate No.
                            </span>

                            <span className="small fw-semibold text-end">
                                {certificate.certificate_number}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">
                                Score
                            </span>

                            <span className="small fw-semibold">
                                {certificate.score}/10.00
                            </span>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span className="text-muted small">
                                Issued
                            </span>

                            <span className="small fw-semibold">
                                {formatDate(certificate.issued_at)}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Footer */}
<div className="card-footer bg-white border-0 px-4 pb-4">
    <div className="d-flex gap-2 flex-column flex-md-row">
        <button
            type="button"
            className="btn btn-outline-primary flex-fill"
            onClick={handleViewCertificate}
        >
            <i className="bi bi-eye me-2"></i>
            View Certificate
        </button>

        <button
            type="button"
            className="btn btn-primary flex-fill"
            onClick={handleDownloadCertificate}
            disabled={!certificate.is_valid || downloading}
        >
            {downloading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating PDF...
                </>
            ) : (
                <>
                    <i className="bi bi-download me-2"></i>
                    Download Certificate
                </>
            )}
        </button>
    </div>
</div>

            </div>
        </div>
    )
}

export default CertificateCard