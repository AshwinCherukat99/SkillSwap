import {useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom' 
import {useSelector} from 'react-redux'

import './profile.css'

const API_BASE_URL = "http://127.0.0.1:8000";

function Profile(){
    const navigate=useNavigate() 
    const accessToken=useSelector(
        (state)=>state.auth.accessToken
    )
    const [profile,setProfile]=useState(null)
    const [loading,setLoading]=useState(true) 
    const [error,setError]=useState("")
    const [skillsOffer, setSkillsOffer] = useState([]);
    const [skillsWant, setSkillsWant] = useState([]);
    const getMediaUrl=(url)=>{
        if (!url){
            return ""
        }
        if (
            url.startsWith('http://')||
            url.startsWith('https://')
        ){
            return url
        }
        return `${API_BASE_URL}${url}`
    }
    const fetchProfile=async ()=>{
        if (!accessToken){
            navigate('/login/')
            return
        }
        try{ 
            console.log('access token:',accessToken)
            const response=await fetch(
                `${API_BASE_URL}/api/auth/profile/`,
                {
                    method:'GET',
                    headers:{
                        Authorization: 
                        `Bearer ${accessToken}`,
                        "Content-Type":"application/json",
                    }
                }
            )
            const data=await response.json() 
            console.log(
                'Profile response:',
                response.status,
                data
            )
            if (!response.ok){
                throw new Error(
                    data.detail||
                    data.error||
                    'unable to load profile'
                )
            }
            setProfile(data)
        }catch(err){
            console.error(
                'profile fetch error:',
                err
            )
            setError(
                err.message||
                'unable to load your profile'
            )
        }
    }
    const fetchSkills=async ()=>{
        if (!accessToken){
            return 
        }
        try{
            const headers={
                Authorization:`Bearer ${accessToken}`,
                'Content-Type':'application/json',
            }  
            const [offerResponse,wantResponse,]=await Promise.all([
                fetch(
                    `${API_BASE_URL}/api/skills/offer/`,
                    {
                        method:'GET',
                        headers,
                    }
                ),
                fetch(
                    `${API_BASE_URL}/api/skills/want/`,
                    {
                        method:'GET',
                        headers,
                    }
                ),
            ])
            const offerData=await offerResponse.json()
            const wantData=await wantResponse.json() 
            console.log(
                'offer skills:',
                offerResponse.status,
                offerData
            )
            console.log(
                'want skills:',
                wantResponse.status,
                wantData
            )
            if (!offerResponse.ok){
                throw new Error(
                    offerData.detail||
                    offerData.error||
                    'unable to load teaching skills'
                )
            }
            if (!wantResponse.ok){
                throw new Error(
                    wantData.detail||
                    wantData.error||
                    'unable to load learning skills'
                )
            }
            setSkillsOffer(
                Array.isArray(offerData)?offerData:offerData.results||[]
            )
            setSkillsWant(
                Array.isArray(wantData)?wantData:wantData.results||[]
            )
        }catch(err){
            console.error('skills fetch error:',err)
            setError((current)=>current||err.message||'unable to load skills')
        }
    }
    useEffect(()=>{
        if (!accessToken){
            navigate('/login/')
            return
        }
        const loadProfile=async ()=>{
            setLoading(true)
            setError("")
            await Promise.all([
                fetchProfile(),
                fetchSkills(),
            ])
            setLoading(false)
        }
        loadProfile()
    },[])
    const formatJoinedDate=(date)=>{
        if (!date){
            return 'recently joined'
        }
        return `joined ${new Date(
            date
        ).toLocaleDateString(
            'en-US',
            {
                month:"long",
                year:"numeric",
            }
        )}`
    }
    const profileImage=getMediaUrl(
        profile?.profile_image
    )
    const displayName=profile?.full_name||profile?.username||'SkillSwap User'
    if (loading){
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-on-surface-variant">
                        Loading your profile...
                    </p>
                </div>
            </div>
        )
    }
    return (
    <div className="profile-page">

        {/* ==========================================
            TOP NAVIGATION
        =========================================== */}

        <nav className="profile-top-nav navbar fixed-top">
            <div className="container-fluid px-3 px-md-4 px-lg-5">

                <div className="d-flex align-items-center gap-4">

                    <Link
                        to="/feed/"
                        className="navbar-brand fw-bold text-primary mb-0"
                    >
                        SkillSwap
                    </Link>

                    <div className="d-none d-md-flex align-items-center gap-4">

                        <Link
                            to="/feed/"
                            className="text-decoration-none text-secondary"
                        >
                            Feed
                        </Link>

                        <Link
                            to="#"
                            className="text-decoration-none text-secondary"
                        >
                            Network
                        </Link>

                        <Link
                            to="#"
                            className="text-decoration-none text-secondary"
                        >
                            Projects
                        </Link>

                        <Link
                            to="#"
                            className="text-decoration-none text-secondary"
                        >
                            Sessions
                        </Link>

                    </div>

                </div>

                <div className="d-flex align-items-center gap-2">

                    <button
                        type="button"
                        className="btn btn-link text-secondary p-2"
                    >
                        <span className="material-symbols-outlined">
                            notifications
                        </span>
                    </button>

                    <button
                        type="button"
                        className="btn btn-link text-secondary p-2"
                    >
                        <span className="material-symbols-outlined">
                            mail
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile/")
                        }
                        className="btn p-0 profile-nav-avatar"
                    >
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt={displayName}
                            />
                        ) : (
                            <div className="profile-avatar-fallback">
                                {displayName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        )}
                    </button>

                </div>

            </div>
        </nav>


        {/* ==========================================
            SIDEBAR
        =========================================== */}

        <aside className="d-none d-md-flex profile-sidebar">

            <div className="d-flex align-items-center gap-3 px-2 mb-4">

                <div className="profile-sidebar-avatar">

                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={displayName}
                        />
                    ) : (
                        <div className="profile-avatar-fallback">
                            {displayName
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                </div>

                <div className="min-w-0">

                    <p className="fw-semibold text-primary mb-0 text-truncate">
                        {displayName}
                    </p>

                    <p className="small text-secondary mb-0 text-truncate">
                        @{profile?.username || "username"}
                    </p>

                </div>

            </div>


            <nav className="nav flex-column gap-1">

                <Link
                    to="/feed/"
                    className="nav-link profile-sidebar-link"
                >
                    <span className="material-symbols-outlined">
                        home
                    </span>
                    <span>Home</span>
                </Link>

                <Link
                    to="/skills/want/"
                    className="nav-link profile-sidebar-link"
                >
                    <span className="material-symbols-outlined">
                        school
                    </span>
                    <span>My Skills</span>
                </Link>

                <Link
                    to="#"
                    className="nav-link profile-sidebar-link"
                >
                    <span className="material-symbols-outlined">
                        groups
                    </span>
                    <span>Mentorship</span>
                </Link>

                <Link
                    to="#"
                    className="nav-link profile-sidebar-link"
                >
                    <span className="material-symbols-outlined">
                        diversity_3
                    </span>
                    <span>Community</span>
                </Link>

                <Link
                    to="/profile/"
                    className="nav-link profile-sidebar-link active"
                >
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontVariationSettings:
                                "'FILL' 1",
                        }}
                    >
                        person
                    </span>
                    <span>Profile</span>
                </Link>

            </nav>


            

        </aside>


        {/* ==========================================
            MAIN CONTENT
        =========================================== */}

        <main className="profile-main container-fluid">

            {error && (
                <div className="alert alert-danger profile-error mb-4">
                    {error}
                </div>
            )}


            {/* ==========================================
                HERO
            =========================================== */}

            <header className="profile-hero mb-5">

                <div className="profile-cover glass-panel">

                    <div className="profile-cover-glow profile-cover-glow-one" />
                    <div className="profile-cover-glow profile-cover-glow-two" />

                </div>


                <div className="profile-hero-content row align-items-end g-4">

                    {/* PROFILE IMAGE */}

                    <div className="col-auto">

                        <div className="profile-avatar">

                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={displayName}
                                />
                            ) : (
                                <div className="profile-avatar-fallback">
                                    {displayName
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                        </div>

                    </div>


                    {/* PROFILE DETAILS */}

                    <div className="col">

                        <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-center gap-2 mb-2">

                            <h1 className="profile-name mb-0">
                                {displayName}
                            </h1>

                            <span className="profile-username">
                                @{profile?.username || "username"}
                            </span>

                            {profile?.role && (
                                <span className="profile-role-badge">
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>

                                    {profile.role === "USER"
                                        ? "SKILLSWAP USER"
                                        : profile.role}
                                </span>
                            )}

                        </div>


                        <div className="profile-meta mb-3 justify-content-center justify-content-lg-start">

                            {profile?.location && (
                                <div className="profile-meta-item">

                                    <span className="material-symbols-outlined">
                                        location_on
                                    </span>

                                    <span>
                                        {profile.location}
                                    </span>

                                </div>
                            )}

                            <div className="profile-meta-item">

                                <span className="material-symbols-outlined">
                                    calendar_today
                                </span>

                                <span>
                                    {formatJoinedDate(
                                        profile?.date_joined
                                    )}
                                </span>

                            </div>

                        </div>


                        <p className="profile-bio mb-0 text-center text-lg-start">
                            {profile?.bio ||
                                "This user has not added a bio yet."}
                        </p>

                    </div>


                    

                </div>

            </header>


            {/* ==========================================
                CONTENT GRID
            =========================================== */}

            <div className="row g-4">

                {/* ======================================
                    MAIN COLUMN
                ======================================= */}

                <div className="col-12 col-lg-8">

                    <div className="d-flex flex-column gap-4">


                        {/* ==================================
                            STATISTICS
                        =================================== */}

                        <div className="row g-3">

                            <div className="col-6 col-md-3">

                                <div className="profile-stat-card h-100">

                                    <p className="profile-stat-label">
                                        Skills Teaching
                                    </p>

                                    <p className="profile-stat-value mb-0">
                                        {profile?.skills_teaching??0}
                                    </p>

                                </div>

                            </div>


                            <div className="col-6 col-md-3">

                                <div className="profile-stat-card h-100">

                                    <p className="profile-stat-label">
                                        Skills Learning
                                    </p>

                                    <p className="profile-stat-value mb-0 text-success">
                                        {profile?.skills_learning??0}
                                    </p>

                                </div>

                            </div>


                            <div className="col-6 col-md-3">

                                <div className="profile-stat-card h-100">

                                    <p className="profile-stat-label">
                                        Average Rating
                                    </p>

                                    <p className="profile-stat-value mb-0">

                                        {profile?.average_rating !==
                                        null &&
                                        profile?.average_rating !==
                                        undefined
                                            ? Number(
                                                  profile.average_rating
                                              ).toFixed(1)
                                            : "—"}

                                    </p>

                                </div>

                            </div>


                            <div className="col-6 col-md-3">

                                <div className="profile-stat-card h-100">

                                    <p className="profile-stat-label">
                                        Sessions
                                    </p>

                                    <p className="profile-stat-value mb-0 text-success">
                                        {profile?.session_count ??
                                            "—"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            ABOUT ME
                        =================================== */}

                        <section className="profile-info-card p-4 p-md-5">

                            <div className="profile-section-header">

                                <h2 className="profile-section-title mb-0">

                                    <span className="material-symbols-outlined">
                                        account_circle
                                    </span>

                                    About Me

                                </h2>

                                <button
                                    type="button"
                                    className="profile-section-edit"
                                    onClick={() =>
                                        navigate(
                                            "/profile/edit/"
                                        )
                                    }
                                >
                                    Edit
                                </button>

                            </div>


                            <div className="profile-info-grid">

                                <div className="profile-info-item">

                                    <p className="profile-info-label">
                                        Full Name
                                    </p>

                                    <p className="profile-info-value">
                                        {profile?.full_name ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="profile-info-item">

                                    <p className="profile-info-label">
                                        Username
                                    </p>

                                    <p className="profile-info-value">
                                        @{profile?.username ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="profile-info-item">

                                    <p className="profile-info-label">
                                        Email
                                    </p>

                                    <p className="profile-info-value">
                                        {profile?.email ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="profile-info-item">

                                    <p className="profile-info-label">
                                        Phone Number
                                    </p>

                                    <p className="profile-info-value">
                                        {profile?.phone_number ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="profile-info-item full-width">

                                    <p className="profile-info-label">
                                        Location
                                    </p>

                                    <p className="profile-info-value">
                                        {profile?.location ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="profile-info-item full-width">

                                    <p className="profile-info-label">
                                        Bio
                                    </p>

                                    <p className="profile-info-value">
                                        {profile?.bio ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>

                        </section>


                    </div>

                </div>


                {/* ======================================
                    SIDEBAR COLUMN
                ======================================= */}

                <div className="col-12 col-lg-4">

                    <div className="d-flex flex-column gap-4">


                        {/* ==================================
                            PROFILE OVERVIEW
                        =================================== */}

                        <div className="profile-sidebar-card p-4 p-md-5 text-center">

                            <div className="profile-overview-icon">

                                <span className="material-symbols-outlined">
                                    person
                                </span>

                            </div>

                            <h4 className="profile-sidebar-title">
                                Profile Overview
                            </h4>

                            <p className="profile-sidebar-text mb-4">
                                Keep your profile updated so the community can learn more about you.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/profile/edit/"
                                    )
                                }
                                className="btn btn-primary w-100 fw-bold"
                            >
                                Edit Profile
                            </button>

                        </div>


                        {/* ==================================
                            CONTACT INFORMATION
                        =================================== */}

                        <div className="profile-sidebar-card p-4">

                            <h4 className="profile-sidebar-title d-flex align-items-center gap-2 mb-4">

                                <span className="material-symbols-outlined text-primary">
                                    contact_page
                                </span>

                                Contact Information

                            </h4>


                            <div className="profile-contact-list">

                                <div className="profile-contact-item">

                                    <span className="material-symbols-outlined profile-contact-icon">
                                        mail
                                    </span>

                                    <div>

                                        <p className="profile-contact-label">
                                            Email
                                        </p>

                                        <p className="profile-contact-value">
                                            {profile?.email ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                </div>


                                <div className="profile-contact-item">

                                    <span className="material-symbols-outlined profile-contact-icon">
                                        phone
                                    </span>

                                    <div>

                                        <p className="profile-contact-label">
                                            Phone
                                        </p>

                                        <p className="profile-contact-value">
                                            {profile?.phone_number ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                </div>


                                <div className="profile-contact-item">

                                    <span className="material-symbols-outlined profile-contact-icon">
                                        location_on
                                    </span>

                                    <div>

                                        <p className="profile-contact-label">
                                            Location
                                        </p>

                                        <p className="profile-contact-value">
                                            {profile?.location ||
                                                "Not provided"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                    </div>

                </div>

            </div>

        </main>

    </div>
);
    }

export default Profile