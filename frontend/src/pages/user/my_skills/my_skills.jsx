import {useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'

import './my_skills.css'

import { API_BASE_URL } from '../../../config'

function MySkills(){
    const navigate=useNavigate()
    const [skillsWantCount,setSkillsWantCount]=useState(0)
    const [skillsOfferCount,setSkillsOfferCount]=useState(0)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const getAccessToken=()=>{
        return (
            localStorage.getItem('access_token')||
            sessionStorage.getItem('access_token')
        )
    }
    const fetchSkills=async ()=>{
        const accessToken=getAccessToken()
        if (!accessToken){
            navigate('/login/')
            return 
        }
        try{
            setLoading(true)
            setError("")
            const headers={
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
            }
            const [wantResponse,offerResponse]=await Promise.all([
                fetch(
                    `${API_BASE_URL}/skills/want/`,
                    {
                        method:'GET',
                        headers,
                    }
                ),
                fetch(
                    `${API_BASE_URL}/skills/offer/`,
                    {
                        method:'GET',
                        headers,
                    }
                ),
            ])
            const wantData=await wantResponse.json()
            const offerData=await offerResponse.json()
            console.log('wanted skills response:',wantResponse.status,wantData)
            console.log('offered skills response:',offerResponse.status,offerData)
            if (!wantResponse.ok){
                throw new Error(
                    wantData.detail||
                    wantData.error||
                    'unable to load wanted skills'
                )
            }
            if (!offerResponse.ok) {
                throw new Error(
                    offerData.detail ||
                    offerData.error ||
                    "Unable to load offered skills."
                );
            }
            const wantedSkills=Array.isArray(wantData)?wantData:wantData.results||[]
            const offeredSkills=Array.isArray(offerData)?offerData:offerData.results||[]
            setSkillsWantCount(wantedSkills.length)
            setSkillsOfferCount(offeredSkills.length)
        }catch(err){
            console.error(
                'My skills error:',
                err
            )
            setError(
                err.message||
                'unable to load your skills'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchSkills()
    },[])
    if (loading){
        return (
            <div className="myskills-loading">
                <div className="text-center">
                    <div className="myskills-spinner mx-auto mb-3" />

                    <p className="text-secondary mb-0">
                        Loading your skills...
                    </p>
                </div>
            </div>
        )
    }
    return (
        <div className="myskills-page">

            
            {/* ==========================================
                MAIN CONTENT
            =========================================== */}

            <main className="myskills-main container-fluid">

                <div className="myskills-content">

                    {/* ERROR */}

                    {error && (
                        <div className="alert alert-danger myskills-alert">
                            {error}
                        </div>
                    )}


                    {/* ======================================
                        PAGE HEADER
                    ======================================= */}

                    <header className="mb-5">

                        <h1 className="myskills-page-title">
                            My Skills
                        </h1>

                        <p className="myskills-page-subtitle">
                            Manage the skills you want to master
                            and the knowledge you share with others.
                        </p>

                    </header>


                    {/* ======================================
                        SKILL JOURNEY
                    ======================================= */}

                    <section className="mb-5">

                        <div className="d-flex align-items-center justify-content-between mb-4">

                            <div>
                                <h2 className="myskills-section-title mb-1">
                                    Your Skill Journey
                                </h2>

                                <p className="text-secondary mb-0">
                                    Choose what you want to learn
                                    or what you want to share.
                                </p>
                            </div>

                        </div>


                        <div className="row g-4">


                            {/* ==============================
                                WANTED SKILLS
                            =============================== */}

                            <div className="col-12 col-xl-6">

                                <div className="myskills-hero-card myskills-wanted-card">

                                    <span className="myskills-hero-background-icon material-symbols-outlined">
                                        school
                                    </span>

                                    <div className="position-relative">

                                        <div className="d-flex align-items-center gap-3 mb-4">

                                            <div className="myskills-hero-icon">

                                                <span className="material-symbols-outlined">
                                                    school
                                                </span>

                                            </div>

                                            <h3 className="myskills-hero-title mb-0">
                                                Wanted Skills
                                            </h3>

                                        </div>


                                        <div className="row g-3 mb-4">

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    {skillsWantCount}
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Skills Learning
                                                </p>

                                            </div>

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    —
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Courses Completed
                                                </p>

                                            </div>

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    —
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Learning Goals
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="d-flex flex-wrap gap-2 position-relative">

                                        <button
                                            type="button"
                                            className="btn myskills-light-button"
                                            onClick={() =>
                                                navigate(
                                                    "/my_skills/want/"
                                                )
                                            }
                                        >
                                            Explore Skills
                                        </button>


                                    </div>

                                </div>

                            </div>


                            {/* ==============================
                                OFFERED SKILLS
                            =============================== */}

                            <div className="col-12 col-xl-6">

                                <div className="myskills-hero-card myskills-offered-card">

                                    <span className="myskills-hero-background-icon material-symbols-outlined">
                                        record_voice_over
                                    </span>

                                    <div className="position-relative">

                                        <div className="d-flex align-items-center gap-3 mb-4">

                                            <div className="myskills-hero-icon">

                                                <span className="material-symbols-outlined">
                                                    record_voice_over
                                                </span>

                                            </div>

                                            <h3 className="myskills-hero-title mb-0">
                                                Offered Skills
                                            </h3>

                                        </div>


                                        <div className="row g-3 mb-4">

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    —
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Students
                                                </p>

                                            </div>

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    {skillsOfferCount}
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Skills Teaching
                                                </p>

                                            </div>

                                            <div className="col-4">

                                                <p className="myskills-hero-number mb-1">
                                                    —
                                                </p>

                                                <p className="myskills-hero-label">
                                                    Average Rating
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="d-flex flex-wrap gap-2 position-relative">

                                        <button
                                            type="button"
                                            className="btn myskills-light-button myskills-light-button-green"
                                            onClick={() =>
                                                navigate(
                                                    "/my_skills/offer/"
                                                )
                                            }
                                        >
                                            Manage Skills
                                        </button>


                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>



                    {/* ======================================
                        RECENT ACTIVITY + ACHIEVEMENTS
                    ======================================= */}

                


                </div>

            </main>


            {/* ==========================================
                FOOTER
            =========================================== */}

            <footer className="myskills-footer">

                <p className="mb-0">
                    © 2024 SkillSwap. Empowering the
                    next generation of experts.
                </p>

            </footer>

        </div>
    )
}

export default MySkills