import { useState } from "react";
import mentorApi from '../../../services/mentorApi'

const DOCUMENT_CATEGORIES = [
    { value: "IDENTITY", label: "Identity" },
    { value: "EDUCATION", label: "Education" },
    { value: "CERTIFICATION", label: "Certification" },
    { value: "PORTFOLIO", label: "Portfolio" },
    { value: "OTHER", label: "Other" },
];

const MAX_FILE_SIZE=10*1024*1024

const AdditionalDocumentsModal=({
    message,
    onClose,
    onSuccess,
})=>{
    const [documents,setDocuments]=useState([
        {
            id:Date.now(),
            category:'',
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
                category:'',
                documentType:'',
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
        for (const item of documents) {
    if (
        !item.category ||
        !item.documentType.trim() ||
        !item.file
    ) {
        setError(
            "Please select a category, enter a document type, and select a file for each document."
        );
        return;
    }

    const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];

    if (!validTypes.includes(item.file.type)) {
        setError(
            `${item.file.name}: Only PDF, JPEG and PNG files are allowed.`
        );
        return;
    }

    if (item.file.size > MAX_FILE_SIZE) {
        setError(
            `${item.file.name} exceeds the 10 MB limit.`
        );
        return;
    }
}
        try{
            setLoading(true)
            const formData=new FormData()
            documents.forEach((item)=>{
                formData.append('documents',item.file)        
                formData.append("categories", item.category)
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
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1060,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
    }}
>
    <div
        className="modal-dialog modal-lg"
        style={{
            width: "100%",
            maxWidth: "800px",
            margin: 0,
            maxHeight: "calc(100vh - 32px)",
        }}
    >
        <div
            className="modal-content border-0 shadow"
            style={{
                maxHeight: "calc(100vh - 32px)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >

                    <div className="modal-header"
                    style={{ flexShrink: 0 }}>
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

                    <form onSubmit={handleSubmit}
                    style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "hidden",
    }}>

                        <div className="modal-body"
                        style={{
        flex: "1 1 auto",
        minHeight: 0,
        overflowY: "auto",
    }}>

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

                                    {/* DOCUMENT CATEGORY */}
<div className="mb-3">
    <label className="form-label">
        Document Category
    </label>

    <select
        className="form-select"
        value={item.category}
        disabled={loading}
        required
        onChange={(e) =>
            handleDocumentChange(
                item.id,
                "category",
                e.target.value
            )
        }
    >
        <option value="">Select category</option>

        {DOCUMENT_CATEGORIES.map((category) => (
            <option
                key={category.value}
                value={category.value}
            >
                {category.label}
            </option>
        ))}
    </select>
</div>

{/* DOCUMENT TYPE */}
<div className="mb-3">
    <label className="form-label">
        Document Type
    </label>

    <input
        type="text"
        className="form-control"
        placeholder="e.g. Bachelor's Degree Certificate"
        value={item.documentType}
        maxLength={100}
        disabled={loading}
        required
        onChange={(e) =>
            handleDocumentChange(
                item.id,
                "documentType",
                e.target.value
            )
        }
    />
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

                        <div className="modal-footer"
                        style={{
        flexShrink: 0,
        background: "#fff",
        borderTop: "1px solid #dee2e6",
    }}>
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