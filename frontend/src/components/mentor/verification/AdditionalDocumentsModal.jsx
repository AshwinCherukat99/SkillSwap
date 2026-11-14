import { useState } from "react";
import mentorApi from '../../../services/mentorApi'

const DODUMENT_TYPES=[
    "Identity Proof",
    "Degree Certificate",
    "Professional Certification",
    "Work Experience Proof",
    "Portfolio",
    "Other",
]

const MAX_FILE_SIZE=10*1024*1024

const AdditionalDocumentsModal=({
    message,
    onClose,
    onSuccess,
})=>{
    const [documents,setDocuments]=useState([
        {
            id:Date.now(),
            documentType:'',
            file:null,
        }
    ])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    const handleDocumentChange=(id,field,value)=>{
        setDocuments((previous)=>
        previous.map((item)=>
        item.id===id
    ?{...item,[field]:value}
:item))
    }
    const addDocument=()=>{
        setDocuments((previous)=>[
            ...previous,
            {
                id:Date.now()+Math.random(),
                doumentType:'',
                file:null,
            }
        ])
    }
    const removeDocument=(id)=>{
        setDocuments((previous)=>
        previous.filter((item)=>item.id!==id))
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError('')
        if (!documents.length){
            setError('please select at least one document')
            return
        }
        for (const item of documents){
            if (!item.documentType||!item.file){
                setError(
                    'please select a document type and file for each document'
                )
                return
            }
            const validTypes=[
                'application/pdf',
                'image/jpeg',
                'image/png',
            ]
            if (!validTypes.includes(item.file.type)){
                setError(
                    `${item.file.name}:only pdf,jpeg and png files are allowed`
                )
                return
            } 
            if (item.file_size>MAX_FILE_SIZE){
                setError(
                    `${item.file.name} exceeds 10 mb limit`
                )
                return
            }
        }
        try{
            setLoading(true)
            const formData=new FormData()
            documents.forEach((item)=>{
                formData.append('documents',item.file)        
                formData.append('document_types',item.documentType)
            })  
            await mentorApi.post(
                '/mentor/additional-documents/',
                formData
            )  
            await onSuccess()
        }catch(err){
            console.error('additional document submission failed:',err)
            setError(err.response?.data?.error||'failed to submit additional documents')
        }finally{
            setLoading(false)
        }
    }  
    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
                background: "rgba(0,0,0,0.6)",
                zIndex: 1060,
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div className="modal-content border-0 shadow">

                    <div className="modal-header">
                        <div>
                            <h5 className="modal-title fw-bold">
                                Additional Documents Required
                            </h5>
                            <p className="text-muted small mb-0 mt-1">
                                Complete your verification by submitting
                                the requested documents.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            disabled={loading}
                            onClick={onClose}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">

                            <div className="alert alert-warning">
                                <div className="fw-semibold mb-1">
                                    Message from Verification Team
                                </div>
                                <p className="mb-0">
                                    {message ||
                                        "Please submit additional documents to continue your verification."}
                                </p>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">
                                    Upload Documents
                                </h6>

                                <span className="badge bg-light text-dark">
                                    {documents.length} document(s)
                                </span>
                            </div>

                            {documents.map((item, index) => (
                                <div
                                    className="border rounded-3 p-3 mb-3"
                                    key={item.id}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <strong>
                                            Document {index + 1}
                                        </strong>

                                        {documents.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                disabled={loading}
                                                onClick={() =>
                                                    removeDocument(item.id)
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Document Type
                                        </label>

                                        <select
                                            className="form-select"
                                            value={item.documentType}
                                            disabled={loading}
                                            onChange={(e) =>
                                                handleDocumentChange(
                                                    item.id,
                                                    "documentType",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select document type
                                            </option>

                                            {DOCUMENT_TYPES.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">
                                            Select File
                                        </label>

                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            disabled={loading}
                                            onChange={(e) =>
                                                handleDocumentChange(
                                                    item.id,
                                                    "file",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />

                                        {item.file && (
                                            <small className="text-success mt-2 d-block">
                                                Selected: {item.file.name}
                                            </small>
                                        )}

                                        <small className="text-muted">
                                            PDF, JPG or PNG. Maximum 10 MB.
                                        </small>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                disabled={loading || documents.length >= 10}
                                onClick={addDocument}
                            >
                                + Add Another Document
                            </button>

                            {error && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    {error}
                                </div>
                            )}

                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                disabled={loading}
                                onClick={onClose}
                            >
                                Close
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Documents"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdditionalDocumentsModal