import React,{useState,useRef} from 'react'

import {ZoomIn,ZoomOut,RotateCw,Maximize,FileText} from 'lucide-react'

import { BACKEND_ORIGIN } from '../../../config'

const DocumentViewer=({document:documentData})=>{
    const [zoom,setZoom]=useState(100)
    const [rotation,setRotate]=useState(0)
    const viewerRef=useRef(null)
    if (!documentData){
        return (
            <section className="document-viewer">

                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">

                    <FileText size={48} />

                    <p className="mt-3 mb-0">
                        Select a document to preview it.
                    </p>

                </div>

            </section>
        )
    }
    const documentUrl=documentData.document?documentData.document.startsWith('http')?documentData.document:`${BACKEND_ORIGIN}${documentData.document}`:documentData.external_url
    console.log('document url:',documentUrl)
    const handleZoomIn=()=>{
        setZoom((current)=>
        Math.min(current+10,200))
    }
    const handleZoomOut=()=>{
        setZoom((current)=>
        Math.max(current-10,50))
    }
    const handleRotate=()=>{
        setRotate((current)=>
        current+90)
    }
    const handleFullScreen=()=>{
        if (viewerRef.current?.requestFullScreen){
            viewerRef.current.requestFullScreen()
        }
    }
    if (!documentUrl){
        return (
            <section className="document-viewer">

                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">

                    <FileText size={48} />

                    <p className="mt-3 mb-0">
                        No preview available.
                    </p>

                </div>

            </section>
        )
    }
    return (
        <section
            ref={viewerRef}
            className="document-viewer"
        >

            {/* Toolbar */}
            <div className="document-viewer-toolbar">

                <div className="small fw-semibold text-truncate">
                    {documentData.document_type||'Document'}
                </div>


                <div className="d-flex align-items-center gap-1">

                    <button
                        className="btn btn-sm btn-light"
                        title="Zoom Out"
                        onClick={handleZoomOut}
                    >
                        <ZoomOut size={16} />
                    </button>


                    <span className="small px-2">
                        {zoom}%
                    </span>


                    <button
                        className="btn btn-sm btn-light"
                        title="Zoom In"
                        onClick={handleZoomIn}
                    >
                        <ZoomIn size={16} />
                    </button>


                    <button
                        className="btn btn-sm btn-light"
                        title="Rotate"
                        onClick={handleRotate}
                    >
                        <RotateCw size={16} />
                    </button>


                    <button
                        className="btn btn-sm btn-light"
                        title="Fullscreen"
                        onClick={handleFullScreen}
                    >
                        <Maximize size={16} />
                    </button>

                </div>

            </div>


            {/* Document */}
            <div className="document-viewer-canvas">

                {documentData.document ? (

                    <div
                        className="document-image-wrapper"
                        style={{
                            transform: `
                                scale(${zoom / 100})
                                rotate(${rotation}deg)
                            `,
                        }}
                    >
                        <iframe
                            src={documentUrl}
                            title={documentData.document_type||'Document Preview'}
                            className="document-frame"
                        />
                    </div>

                ) : (

                    <div className="text-center">

                        <FileText
                            size={50}
                            className="text-muted mb-3"
                        />

                        <h5>
                            External Document
                        </h5>

                        <a
                            href={documentData.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Open Document
                        </a>

                    </div>

                )}

            </div>

        </section>
    )
}

export default DocumentViewer