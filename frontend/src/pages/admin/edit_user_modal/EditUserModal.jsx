import React,{useState,useEffect} from "react";

import adminApi from "../../../services/adminApi";

const EditUserModal=({user,onClose,onUpdated})=>{
    const [formData,setFormData]=useState({
        full_name:'',
        username:'',
        email:'',
        bio:'',
        location:'',
        phone_number:'',
    })
    const [profileImage,setProfileImage]=useState(null)
    const [imagePreview,setImagePreview]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        if (!user) return
        setFormData({
            full_name:user.full_name||'',
            username:user.username||'',
            email:user.email||'',
            bio:user.bio||'',
            location:user.location||'',
            phone_number:user.phone_number||'',
        })
        setImagePreview(user.profile_image||'')
        setProfileImage(null)
        setError('')
    },[user])
    const handleChange=(event)=>{
        const {name,value}=event.target
        setFormData((previous)=>({
            ...previous,
            [name]:value,
        }))
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setLoading(true)
        setError('')
        try{
            const payload=new FormData()
            Object.entries(formData).forEach(([key,value])=>{
                payload.append(key,value)
            })
            if (profileImage){
                payload.append('profile_image',profileImage)
            }
            const response=await adminApi.patch(
                `/admin/users/${user.id}/update/`,
                payload
            )
            onUpdated?.(response.data)
            onClose()
        }catch(err){
            console.error('failed to update user:',err)
            const data=err.response?.data
            const message=data?.detail||Object.values(data||{}).flat().find(
                (value)=>typeof value==='string'
            )||'failed to update user'
            setError(message)
        }finally{
            setLoading(false)
        }
    }
    if (!user) return null
    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 1055 }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <div>
                                <h5 className="modal-title fw-bold">
                                    Edit User
                                </h5>
                                <p className="text-muted small mb-0">
                                    Update user profile and account status.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body p-4">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <div className="text-center mb-4">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="User profile"
                                        className="rounded-circle mb-3"
                                        style={{
                                            width: 96,
                                            height: 96,
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{ width: 96, height: 96 }}
                                    >
                                        <i className="bi bi-person fs-1 text-muted" />
                                    </div>
                                )}

                                <div>
                                    <label className="btn btn-outline-primary btn-sm">
                                        <i className="bi bi-camera me-2" />
                                        Change Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(event) => {
                                                const file =
                                                    event.target.files?.[0];
                                                if (!file) return;

                                                setProfileImage(file);
                                                setImagePreview(
                                                    URL.createObjectURL(file)
                                                );
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        className="form-control"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Username
                                    </label>
                                    <input
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Phone Number
                                    </label>
                                    <input
                                        className="form-control"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Location
                                    </label>
                                    <input
                                        className="form-control"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Bio
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light border"
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2 me-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditUserModal