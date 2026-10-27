import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './edit_profile.css'

import { BACKEND_ORIGIN } from '../../../config'

function EditProfile(){
    const navigate=useNavigate()
    const [profile,setProfile]=useState({
        full_name:"",
        username:"",
        email:"",
        phone_number:"",
        location:"",
        bio:"",
        profile_image:null,
    })
    const [selectedImage,setSelectedImage]=useState(null)
    const [previewImage,setPreviewImage]=useState(null)
    const [loading,setLoading]=useState(true)
    const [saving,setSaving]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")
    const getAccessToken=()=>{
        return localStorage.getItem(
            'access_token'
        )
    }
    const getImageUrl=(image)=>{
        if (!image){
            return null
        }
        if (/^https?:\/\//i.test(url)) {
        return url;
    }
        return `${BACKEND_ORIGIN}${image.startsWith("/")?"":"/"}${image}`
    }
    const fetchProfile=async ()=>{
        const accessToken=getAccessToken()
        if (!accessToken){
            navigate('/login/')
            return
        }
        try{
            setLoading(true)
            const response=await fetch(
                `${API_BASE_URL}/auth/profile/`,
                {
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                }
            )
            const data=await response.json()
            console.log('profile response:',response.status,data) 
            if (!response.ok){
                throw new Error(
                    data.detail||
                    data.error||
                    'unable to load profile'
                )
            }
            setProfile({
                full_name:data.full_name||"",
                username:data.username||"",
                email:data.email||"",
                phone_number:data.phone_number||"",
                location:data.location||"",
                bio:data.bio||"",
                profile_image:data.profile_image||null,
            })
            if (data.profile_image){
                setPreviewImage(
                    getImageUrl(
                        data.profile_image
                    )
                )
            }
        }catch(err){
            console.error('profile fetch error:',err)
            setError(
                err.message||
                'unable to load profile'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchProfile()
    },[])
    const handleChange=(event)=>{
        const {name,value}=event.target
        setProfile((currentProfile)=>({
            ...currentProfile,
            [name]:value,
        }))
    }
    const handleImageChange=(event)=>{
        const file=event.target.files[0]
        if (!file){
            return
        }
        const allowedTypes=[
            "image/jpeg",
            "image/png",
            "image/webp",
        ]
        if (!allowedTypes.includes(file.type)){
            setError(
                'only jpeg, png and webp images are allowed'
            )
            return
        }
        const maxSize=5*1024*1024
        if (file.size>maxSize){
            setError(
                'image size must not exceed 5 mb'
            )
            return
        }
        setError("")
        setSelectedImage(file)
        const imageUrl=URL.createObjectURL(file)
        setPreviewImage(imageUrl)
    }
    const updateProfileDetails=async (accessToken)=>{
        const response=await fetch(
            `${API_BASE_URL}/auth/profile/`,
            {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${accessToken}`
                },
                body:JSON.stringify({
                    full_name:profile.full_name,
                    username:profile.username,
                    phone_number:profile.phone_number,
                    location:profile.location,
                    bio:profile.bio,
                }),
            }
        )
        const data=await response.json()
        console.log('profile update response:',response.status,data)
        if (!response.ok){
            throw new Error(
                data.detail||
                data.error||
                data.username?.[0]||
                'unable to update profile'
            )
        }
        return data.user
    }
    const updateProfileImage=async (accessToken)=>{
        if (!selectedImage){
            return null
        }
        const formData=new FormData()
        formData.append('profile_image',selectedImage)
        const response=await fetch(
            `${API_BASE_URL}/auth/profile/image/`,
            {
                method:'PUT',
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                },
                body:formData,
            }
        )
        const data=await response.json()
        console.log('profile image response:',response.status,data)
        if (!response.ok){
            throw new Error(
                data.detail||
                data.error||
                data.profile_image?.[0]||
                'unable to update profile image'
            )
        }
        return data.profile_image
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError("")
        setSuccess("")
        const accessToken=getAccessToken()
        if (!accessToken){
            navigate('/login/')
            return
        }
        try{
            setSaving(true)
            const updatedUser=await updateProfileDetails(accessToken) 
            let updatedImage=null
            if (selectedImage){
                updatedImage=await updateProfileImage(accessToken)
            }
            setProfile((current)=>({
                ...current,
                ...updatedUser,
                profile_image:updatedImage||updatedUser.profile_image||current.profile_image,
            }))
            const storedUser=localStorage.getItem('user')
            if (storedUser){
                const currentUser=JSON.parse(storedUser)
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...currentUser,
                        ...updatedUser,
                        profile_image:updatedImage||updatedUser.profile_image,
                    })
                )
            }
            setSelectedImage(null)
            setSuccess('profile updated successfully')
            alert('profile has been updated successfully')
            setTimeout(()=>{
                navigate('/profile/')
            },1000)
        }catch(err){
            console.error(
                'profile update error:',
                err
            )
            setError(
                err.message||
                'unable to update profile'
            )
        }finally{
            setSaving(false)
        }
    }
    if (loading){
        return (
            <div
                className="
                    edit-profile-loading
                "
            >

                <div
                    className="
                        spinner-border
                        text-primary
                    "
                    role="status"
                />

            </div>
        )
    }
    return (
        <div
            className="
                edit-profile-page
            "
        >

            <div className="container py-5">


                {/* HEADER */}

                <div
                    className="
                        edit-profile-header
                        mb-4
                    "
                >

                    <div>

                        <h2>

                            Edit Profile

                        </h2>

                        <p>

                            Manage your personal
                            information and profile.

                        </p>

                    </div>


                    <button
                        type="button"
                        className="
                            btn
                            btn-outline-secondary
                        "
                        onClick={() =>
                            navigate("/profile/")
                        }
                    >

                        <i
                            className="
                                bi
                                bi-arrow-left
                                me-2
                            "
                        />

                        Back to Profile

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        className="
                            alert
                            alert-danger
                        "
                    >

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div
                        className="
                            alert
                            alert-success
                        "
                    >

                        {success}

                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    <div className="row g-4">


                        {/* ======================
                            LEFT PROFILE CARD
                        ====================== */}

                        <div
                            className="
                                col-lg-4
                            "
                        >

                            <div
                                className="
                                    card
                                    edit-profile-card
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        card-body
                                        text-center
                                        p-4
                                    "
                                >

                                    <h5
                                        className="
                                            section-title
                                            mb-4
                                        "
                                    >

                                        Profile Picture

                                    </h5>


                                    {/* IMAGE */}

                                    <div
                                        className="
                                            profile-image-wrapper
                                        "
                                    >

                                        {previewImage ? (

                                            <img
                                                src={
                                                    previewImage
                                                }
                                                alt="Profile"
                                                className="
                                                    edit-profile-image
                                                "
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    edit-profile-placeholder
                                                "
                                            >

                                                <i
                                                    className="
                                                        bi
                                                        bi-person
                                                    "
                                                />

                                            </div>

                                        )}

                                    </div>


                                    {/* UPLOAD */}

                                    <label
                                        className="
                                            btn
                                            btn-primary
                                            mt-3
                                            me-2
                                        "
                                    >

                                        <i
                                            className="
                                                bi
                                                bi-upload
                                                me-2
                                            "
                                        />

                                        Upload Image


                                        <input
                                            type="file"
                                            accept="
                                                image/jpeg,
                                                image/png,
                                                image/webp
                                            "
                                            hidden
                                            onChange={
                                                handleImageChange
                                            }
                                        />

                                    </label>


                                    <p
                                        className="
                                            text-muted
                                            small
                                            mt-3
                                        "
                                    >

                                        JPEG, PNG or WEBP.
                                        Maximum size 5 MB.

                                    </p>


                                    <hr />


                                    <h5
                                        className="
                                            fw-bold
                                            mb-1
                                        "
                                    >

                                        {
                                            profile.full_name ||
                                            "SkillSwap User"
                                        }

                                    </h5>


                                    <p
                                        className="
                                            text-muted
                                        "
                                    >

                                        @
                                        {
                                            profile.username ||
                                            "username"
                                        }

                                    </p>


                                </div>

                            </div>

                        </div>


                        {/* ======================
                            RIGHT SIDE
                        ====================== */}

                        <div
                            className="
                                col-lg-8
                            "
                        >


                            {/* PERSONAL INFO */}

                            <div
                                className="
                                    card
                                    edit-profile-card
                                    shadow-sm
                                    mb-4
                                "
                            >

                                <div
                                    className="
                                        card-body
                                        p-4
                                    "
                                >

                                    <h4
                                        className="
                                            section-title
                                            mb-4
                                        "
                                    >

                                        <i
                                            className="
                                                bi
                                                bi-person-circle
                                                me-2
                                            "
                                        />

                                        Personal Information

                                    </h4>


                                    <div className="row g-3">


                                        {/* FULL NAME */}

                                        <div className="col-md-6">

                                            <label
                                                className="
                                                    form-label
                                                "
                                            >

                                                Full Name

                                            </label>


                                            <input
                                                type="text"
                                                name="full_name"
                                                className="
                                                    form-control
                                                "
                                                value={
                                                    profile.full_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* USERNAME */}

                                        <div className="col-md-6">

                                            <label
                                                className="
                                                    form-label
                                                "
                                            >

                                                Username

                                            </label>


                                            <input
                                                type="text"
                                                name="username"
                                                className="
                                                    form-control
                                                "
                                                value={
                                                    profile.username
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* EMAIL */}

                                        <div className="col-md-6">

                                            <label
                                                className="
                                                    form-label
                                                "
                                            >

                                                Email Address

                                            </label>


                                            <input
                                                type="email"
                                                className="
                                                    form-control
                                                    bg-light
                                                "
                                                value={
                                                    profile.email
                                                }
                                                disabled
                                            />

                                            <div
                                                className="
                                                    form-text
                                                "
                                            >

                                                Email cannot
                                                be changed.

                                            </div>

                                        </div>


                                        {/* PHONE */}

                                        <div className="col-md-6">

                                            <label
                                                className="
                                                    form-label
                                                "
                                            >

                                                Phone Number

                                            </label>


                                            <input
                                                type="text"
                                                name="phone_number"
                                                className="
                                                    form-control
                                                "
                                                value={
                                                    profile.phone_number
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                        {/* LOCATION */}

                                        <div className="col-12">

                                            <label
                                                className="
                                                    form-label
                                                "
                                            >

                                                Location

                                            </label>


                                            <input
                                                type="text"
                                                name="location"
                                                className="
                                                    form-control
                                                "
                                                placeholder="
                                                    Enter your location
                                                "
                                                value={
                                                    profile.location
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                    </div>

                                </div>

                            </div>


                            {/* ABOUT ME */}

                            <div
                                className="
                                    card
                                    edit-profile-card
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        card-body
                                        p-4
                                    "
                                >

                                    <h4
                                        className="
                                            section-title
                                            mb-4
                                        "
                                    >

                                        <i
                                            className="
                                                bi
                                                bi-file-person
                                                me-2
                                            "
                                        />

                                        About Me

                                    </h4>


                                    <label
                                        className="
                                            form-label
                                        "
                                    >

                                        Bio

                                    </label>


                                    <textarea
                                        name="bio"
                                        className="
                                            form-control
                                        "
                                        rows="6"
                                        maxLength="500"
                                        placeholder="
                                            Tell people about yourself...
                                        "
                                        value={
                                            profile.bio
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    <div
                                        className="
                                            text-end
                                            small
                                            text-muted
                                            mt-2
                                        "
                                    >

                                        {
                                            profile.bio.length
                                        }
                                        /500

                                    </div>


                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div
                                className="
                                    d-flex
                                    justify-content-end
                                    gap-3
                                    mt-4
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        btn
                                        btn-outline-secondary
                                        px-4
                                    "
                                    disabled={
                                        saving
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/profile/"
                                        )
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="
                                        btn
                                        btn-primary
                                        px-4
                                    "
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving ? (

                                        <>
                                            <span
                                                className="
                                                    spinner-border
                                                    spinner-border-sm
                                                    me-2
                                                "
                                            />

                                            Saving...

                                        </>

                                    ) : (

                                        <>
                                            <i
                                                className="
                                                    bi
                                                    bi-check-circle
                                                    me-2
                                                "
                                            />

                                            Save Changes

                                        </>

                                    )}

                                </button>

                            </div>


                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditProfile