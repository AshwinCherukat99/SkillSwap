import { useEffect,useState } from "react";

import api from "../../../services/api";

const CreateStoryModal=({onClose,onCreated})=>{
    const [contentType,setContentType]=useState('IMAGE')
    const [media,setMedia]=useState(null)
    const [text,setText]=useState('')
    const [backgroundColor,setBackgroundColor]=useState('#3525cd')
    const [preview,setPreview]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    const colors=[
        "#3525cd",
        "#006c49",
        "#885500",
        "#64748b",
        "#191c1e",
    ]
    useEffect(()=>{
        if (!media){
            setPreview('')
            return
        }
        const objectUrl=URL.createObjectURL(media)
        setPreview(objectUrl)
        return ()=>URL.revokeObjectURL(objectUrl)
    },[media])
    const handleFileChange=(e)=>{
        const file=e.target.files?.[0]
        if (!file) return
        const isImage=file.type.startsWith('image/')
        const isVideo=file.type.startsWith('video/')
        if (!isImage&&!isVideo){
            setError('please select an image or video')
            return 
        }
        setContentType(isImage?'IMAGE':'VIDEO')
        setMedia(file)
        setError('')
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        setError('')
        if (contentType==='TEXT' && !text.trim()){
            setError('please enter some text for your story')
            return
        }
        if ((contentType==='IMAGE'||contentType==='VIDEO')&&!media){
            setError('please select a media file')          
            return
        }
        const formData=new FormData()
        formData.append('content_type',contentType)
        formData.append('text',text)
        formData.append('background_color',backgroundColor)
        if (media){
            formData.append('media',media)
        }
        try{
            setLoading(true)
            await api.post('/stories/',formData)
            onCreated()
        }catch(err){
            console.error('story creation failed:',err)
            const data=err.response?.data
            setError(
                data?.detail||
                data?.media?.[0]||
                data?.text?.[0]||
                data?.content_type?.[0]||
                'unable to publish your story'
            )
        }finally{
            setLoading(false)
        }
    }
    return (
        <div
            className="story-modal-backdrop"
            onClick={onClose}
        >
            <div
                className="story-create-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="story-modal-header">
                    <div className="d-flex align-items-center gap-3">
                        <div className="story-modal-icon">
                            <span className="material-symbols-outlined">
                                add_photo_alternate
                            </span>
                        </div>

                        <div>
                            <h5>Create New Story</h5>
                            <small>
                                Stories disappear automatically after 24 hours.
                            </small>
                        </div>
                    </div>

                    <button
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="story-modal-body">

                        {/* Preview */}
                        <div>
                            <label className="form-label fw-bold">
                                Story Canvas
                            </label>

                            <div
                                className="story-create-preview"
                                style={{
                                    backgroundColor:
                                        contentType === "TEXT"
                                            ? backgroundColor
                                            : "#191c1e",
                                }}
                            >
                                {preview && contentType === "IMAGE" && (
                                    <img src={preview} alt="Preview" />
                                )}

                                {preview && contentType === "VIDEO" && (
                                    <video
                                        src={preview}
                                        controls
                                    />
                                )}

                                {contentType === "TEXT" ? (
                                    <h4>{text || "Your story text appears here"}</h4>
                                ) : !preview ? (
                                    <div className="text-center">
                                        <span className="material-symbols-outlined display-4">
                                            cloud_upload
                                        </span>

                                        <p className="fw-bold mt-2">
                                            Upload a photo or video
                                        </p>

                                        <small>
                                            JPG, PNG, WEBP, MP4 or WEBM
                                        </small>
                                    </div>
                                ) : null}
                            </div>

                            <label className="btn btn-outline-primary w-100 mt-3">
                                <span className="material-symbols-outlined">
                                    upload_file
                                </span>
                                Browse Files

                                <input
                                    type="file"
                                    hidden
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <button
                                type="button"
                                className="btn btn-link btn-sm mt-2"
                                onClick={() => {
                                    setContentType("TEXT");
                                    setMedia(null);
                                }}
                            >
                                Create a text-only story instead
                            </button>
                        </div>

                        {/* Customization */}
                        <div>
                            <label className="form-label fw-bold">
                                Caption & Learning Note
                            </label>

                            <textarea
                                className="form-control story-caption-input"
                                rows="4"
                                placeholder="What did you learn or accomplish today?"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <div className="mt-4">
                                <label className="form-label fw-bold">
                                    Canvas Accent Color
                                </label>

                                <div className="story-color-picker">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            style={{
                                                backgroundColor: color,
                                                outline:
                                                    backgroundColor === color
                                                        ? "3px solid #c7c4d8"
                                                        : "none",
                                            }}
                                            onClick={() =>
                                                setBackgroundColor(color)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="form-label fw-bold">
                                    Story Type
                                </label>

                                <div className="d-flex gap-2">
                                    {["IMAGE", "VIDEO", "TEXT"].map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            className={`btn btn-sm ${
                                                contentType === type
                                                    ? "btn-primary"
                                                    : "btn-outline-secondary"
                                            }`}
                                            onClick={() => {
                                                setContentType(type);
                                                if (type === "TEXT") {
                                                    setMedia(null);
                                                }
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="story-expiry-note mt-4">
                                <span className="material-symbols-outlined">
                                    schedule
                                </span>
                                Your story will expire after 24 hours.
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mx-4 mb-0">
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="story-modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    Share Story
                                    <span className="material-symbols-outlined ms-2">
                                        rocket_launch
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default CreateStoryModal