import React,{useRef} from 'react'

function MentorProfileHeader({
    mentor,
    formData,
    onPhotoChange,
    onRemovePhoto
}){
    const fileInputRef=useRef(null)
    const handlePhotoButtonClick=()=>{
        fileInputRef.current?.click()
    }
    const profile_image=formData.profile_image_preview||mentor?.profile_image||'/default-mentor.png'
    return (
        <section className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div className="card-body p-4 p-lg-5">

                <div className="row align-items-center g-4">

                    {/* Profile photo */}
                    <div className="col-auto">
                        <div className="position-relative">

                            <img
                                src={profile_image}
                                alt={mentor?.full_name || "Mentor"}
                                className="mentor-edit-avatar"
                            />

                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-circle photo-camera-button"
                                onClick={handlePhotoButtonClick}
                                title="Change profile photo"
                            >
                                <span className="material-symbols-outlined">
                                    photo_camera
                                </span>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="d-none"
                                onChange={onPhotoChange}
                            />
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="col">

                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">

                            <h2 className="h4 mb-0">
                                {formData.full_name || "Your Name"}
                            </h2>

                            {mentor?.is_verified && (
                                <span className="badge rounded-pill bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                                    <span className="material-symbols-outlined verified-icon">
                                        verified
                                    </span>
                                    Verified Mentor
                                </span>
                            )}

                        </div>

                        <div className="text-muted small">

                            <span className="text-primary">
                                @{formData.username || "username"}
                            </span>

                            {formData.current_profession && (
                                <>
                                    <span className="mx-2">•</span>

                                    <span>
                                        {formData.current_profession}
                                    </span>
                                </>
                            )}

                        </div>

                        <p className="text-muted small mt-2 mb-0">
                            Recommended: Square JPG, PNG or WebP • Max 1MB
                        </p>

                    </div>

                    {/* Photo buttons */}
                    <div className="col-12 col-md-auto">

                        <div className="d-flex gap-2">

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handlePhotoButtonClick}
                            >
                                Change Photo
                            </button>

                            <button
                                type="button"
                                className="btn btn-light text-danger"
                                onClick={onRemovePhoto}
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default MentorProfileHeader