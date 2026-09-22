import React from 'react'

import {FileText,ExternalLink,Eye} from 'lucide-react'

const DocumentCard=({
    document,
    selected,
    onClick,
})=>{
    const getStatus=()=>{
        if (document.status==='APPROVED'){
            return {
                text:'Verified',
                className:'text-success',
            }
        }
        if (document.status==='REJECTED'){
            return {
                text:'Rejected',
                className:'text-danger',
            }
        }
        return {
            text:'Needs Review',
            className:'text-warning',
        }
    }
    const status=getStatus()
    const documentUrl=document.document||document.external_url
    return (
        <div
            className={
                `document-card ${
                    selected
                        ? 'document-card-selected'
                        : ''
                }`
            }
            onClick={onClick}
        >

            <div className="document-preview">

                {document.document ? (
                    <img
                        src={document.document}
                        alt={document.document_type}
                    />
                ) : (
                    <FileText
                        size={36}
                        className="text-muted"
                    />
                )}

            </div>


            <h4
                className="h6 fw-semibold text-truncate mb-1"
                title={document.document_type}
            >
                {document.document_type}
            </h4>


            <p className="small text-muted mb-2">
                Uploaded{' '}
                {document.uploaded_at
                    ? new Date(
                        document.uploaded_at
                    ).toLocaleDateString()
                    : '-'}
            </p>


            <div
                className={`small fw-semibold ${status.className}`}
            >
                {status.text}
            </div>


            {document.external_url && (
                <a
                    href={document.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="small text-primary d-inline-flex align-items-center gap-1 mt-2"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    Open Link
                    <ExternalLink size={13} />
                </a>
            )}

        </div>
    )
}

export default DocumentCard