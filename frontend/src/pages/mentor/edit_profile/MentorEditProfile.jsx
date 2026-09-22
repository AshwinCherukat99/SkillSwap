import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import mentorApi from '../../../services/mentorApi'

import MentorProfileHeader from '../../../components/mentor/profile/MentorProfileHeader'
import PersonalInformation from '../../../components/mentor/profile/PersonalInformation'
import ProfessionalInformation from '../../../components/mentor/profile/ProfessionalInformation'
import TeachingNiche from '../../../components/mentor/profile/TeachingNiche'

import './MentorEditProfile.css'

function MentorEditProfile(){
    const navigate=useNavigate()
    const [mentor,setMentor]=useState(null)
    const [formData,setFormData]=useState({
        full_name:"",
        username: "",
        phone_number: "",
        email: "",
        experience_years: "",
        current_profession: "",
        organization: "",
        professional_summary: "",
        teaching_niche: "",
        profile_image: null,
        profile_image_preview: null,
    })
    const [loading,setLoading]=useState(true)
    const [saving,setSaving]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")
    const [hasChanges,setHasChanges]=useState(false)
    useEffect(()=>{
        const fetchProfile=async ()=>{
            try{
                setLoading(true)
                setError("")
                const response=await mentorApi.get(
                    "/mentors/dashboard/"
                )
                const data=response.data
                const mentorData=data.mentor
                setMentor(mentorData)
                setFormData({
                    full_name: mentorData.full_name || "",
                    username: mentorData.username || "",
                    phone_number: mentorData.phone_number || "",
                    email: mentorData.email || "",
                    experience_years:
                        mentorData.experience_years ?? "",
                    current_profession:
                        mentorData.current_profession || "",
                    organization:
                        mentorData.organization || "",
                    professional_summary:
                        mentorData.professional_summary || "",
                    teaching_niche:
                        mentorData.teaching_niche || "",
                    profile_image:
                        mentorData.profile_image || null,
                    profile_image_preview: null,
                })
            }catch(error){
                console.error('mentor profile fetch error:',error)
                setError(
                    error.response?.data?.error||
                    'unable to load mentor profile'
                )
            }finally{
                setLoading(false)
            }
        }
            fetchProfile()
    },[])
    const handleChange=(event)=>{
        const {name,value}=event.target
        setFormData((previous)=>({
            ...previous,
            [name]:value,
        }))
        setHasChanges(true)
        setSuccess("")
    }
    const handlePhotoChange=(event)=>{
        const file=event.target.files?.[0]
        if (!file){
            return
        }
        if (file.size>1024*1024){
            setError(
                'profile photo must be smaller than 1 MB'
            )
            return
        }
        const allowedTypes=[
            'image/jpeg',
            'image/png',
            'image/webp',
        ]
        if (!allowedTypes.includes(file.type)){
            setError('only jpeg, png and webp images are allowed')
            return
        }
        const previewUrl=URL.createObjectURL(file)
        setFormData((previous)=>({
            ...previous,
            profile_image:file,
            profile_image_preview:previewUrl
        }))
        setHasChanges(true)
        setError("")
        setSuccess("")
    }
    const handleRemovePhoto=()=>{
        const confirmed=window.confirm(
            'are you sure you want to remove your profile photo?'
        )
        if (!confirmed){
            return
        }
        setFormData((previous)=>({
            ...previous,
            profile_image:null,
            profile_image_preview:null,
            remove_profile_image:true
        }))
        setHasChanges(true)
        setError("")
    }
    const handleSave=async ()=>{
        try{
            setSaving(true)
            setError("")
            setSuccess("")
            const payload=new FormData()
            payload.append(
                'full_name',
                formData.full_name
            )
            payload.append(
                'username',
                formData.username
            )
            payload.append(
                'phone_number',
                formData.phone_number
            )
            payload.append(
                'teaching_niche',
                formData.teaching_niche
            )
            if (formData.profile_image instanceof File){
                payload.append('profile_image',formData.profile_image)
            }
            if (formData.remove_profile_image){
                payload.append('remove_profile_image',
                    'true'
                )
            }
            const response=await mentorApi.patch(
                '/mentors/profile/',
                payload,
                {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                }
            )
            const updatedMentor=response.data.mentor
            setMentor(updatedMentor)
            setFormData((previous)=>({
                ...previous,
                ...updatedMentor,
                profile_image:updatedMentor.profile_image,
                profile_image_preview:null,
                remove_profile_image:false,
            }))
            setHasChanges(false)
            setSuccess(
                'profile updated successfully'
            )
        }catch(err){
            console.error(
                'mentor profile update error:',
                err
            )
            setError(
                err.response?.data?.error||
                err.response?.data?.detail||
                'unable to update your profile'
            )
        }finally{
            setSaving(false)
    }
}
const handleCancel=()=>{
    if (hasChanges){
        const confirmed=window.confirm(
            'discard your unsaved changes?'
        )
        if (!confirmed){
            return
        }
    }
    navigate('/mentor/dashboard/')
}
if (loading){
    return (
        <div className="container py-5">

                <div className="d-flex justify-content-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                </div>

            </div>
    )
}
    if (!mentor){
        <div className="container py-5">

                <div className="alert alert-danger">
                    {error ||
                        "Mentor information unavailable."}
                </div>

            </div>
    }
    return (
        <div className="mentor-edit-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="container py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <button
                            type="button"
                            className="btn btn-link text-primary p-0 text-decoration-none"
                            onClick={() =>
                                navigate("/mentor/dashboard/")
                            }
                        >
                            <span className="material-symbols-outlined align-middle me-1">
                                arrow_back
                            </span>

                            Back to Mentor Profile
                        </button>

                        <h1 className="display-6 fw-bold mt-3 mb-2">
                            Edit Profile
                        </h1>

                        <p className="text-muted mb-0">
                            Update your public mentor presentation
                            and account details.
                        </p>

                    </div>

                    <div className="badge bg-light text-secondary p-2">
                        {hasChanges ? (
                            <>
                                <span className="status-dot bg-primary" />
                                Unsaved Changes
                            </>
                        ) : (
                            <>
                                <span className="status-dot bg-success" />
                                All changes synced
                            </>
                        )}
                    </div>

                </div>

                {/* =========================
                    ALERTS
                ========================= */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* =========================
                    PROFILE HEADER
                ========================= */}

                <MentorProfileHeader
                    mentor={mentor}
                    formData={formData}
                    onPhotoChange={handlePhotoChange}
                    onRemovePhoto={handleRemovePhoto}
                />

                {/* =========================
                    MAIN GRID
                ========================= */}

                <div className="row g-4">

                    {/* LEFT */}
                    <div className="col-lg-8">

                        <PersonalInformation
                            formData={formData}
                            onChange={handleChange}
                        />

                        <ProfessionalInformation
                            formData={formData}
                        />

                        <TeachingNiche
                            value={formData.teaching_niche}
                            onChange={handleChange}
                        />

                    </div>

                </div>

            </div>

            {/* =========================
                BOTTOM ACTION BAR
            ========================= */}

            <div className="mentor-edit-action-bar">

                <div className="container">

                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">

                        <div className="small text-muted">

                            {hasChanges
                                ? "You have unsaved changes."
                                : "Profile changes saved & live."}

                        </div>

                        <div className="d-flex gap-2">

                            <button
                                type="button"
                                className="btn btn-light px-4"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                            >

                                {saving ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined align-middle me-2">
                                            check_circle
                                        </span>

                                        Save Changes
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default MentorEditProfile