import React from 'react'

import DocumentCard from './DocumentCard'

const DocumentGallery=({
    documents,
    selectedDocument,
    onSelectDocument,
})=>{
    return (
        <section className="card border-0 shadow-sm verification-card">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h3 className="h5 fw-bold mb-0">
                        Submitted Documents
                    </h3>

                    <span className="badge bg-light text-dark rounded-pill">
                        {documents.length} Items
                    </span>

                </div>


                {documents.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        No documents submitted.
                    </div>
                ) : (

                    <div className="row g-3">

                        {documents.map((document) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={document.id}
                            >

                                <DocumentCard
                                    document={document}
                                    selected={
                                        selectedDocument?.id ===
                                        document.id
                                    }
                                    onClick={() =>
                                        onSelectDocument(document)
                                    }
                                />

                            </div>
                        ))}

                    </div>

                )}

            </div>

        </section>
    )
}

export default DocumentGallery