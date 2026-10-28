import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './my_skills.css'
import { API_BASE_URL } from '../../../config'

function MySkills() {
    const navigate = useNavigate()
    const [skillsWantCount, setSkillsWantCount] = useState(0)
    const [skillsOfferCount, setSkillsOfferCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const getAccessToken = () => {
        return (
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token')
        )
    }

    const fetchSkills = async () => {
        const accessToken = getAccessToken()
        if (!accessToken) {
            navigate('/login/')
            return 
        }

        try {
            setLoading(true)
            setError("")
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }

            const [wantResponse, offerResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/skills/want/`, { method: 'GET', headers }),
                fetch(`${API_BASE_URL}/skills/offer/`, { method: 'GET', headers }),
            ])

            const wantData = await wantResponse.json()
            const offerData = await offerResponse.json()

            if (!wantResponse.ok) {
                throw new Error(wantData.detail || wantData.error || 'Unable to load wanted skills')
            }
            if (!offerResponse.ok) {
                throw new Error(offerData.detail || offerData.error || 'Unable to load offered skills.')
            }

            const wantedSkills = Array.isArray(wantData) ? wantData : wantData.results || []
            const offeredSkills = Array.isArray(offerData) ? offerData : offerData.results || []

            setSkillsWantCount(wantedSkills.length)
            setSkillsOfferCount(offeredSkills.length)
        } catch (err) {
            console.error('My skills error:', err)
            setError(err.message || 'Unable to load your skills')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSkills()
    }, [])

    if (loading) {
        return (
            <div className="myskills-loading">
                <div className="myskills-spinner mb-3" />
                <p className="text-secondary fw-medium mb-0">Loading your skills...</p>
            </div>
        )
    }

    return (
        <div className="myskills-page">
            <main className="myskills-main container-fluid">
                <div className="myskills-content">

                    {/* ERROR BANNER */}
                    {error && (
                        <div className="alert alert-danger myskills-alert d-flex align-items-center gap-2 mb-3">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* COMPACT UNIFIED HEADER */}
                    <header className="myskills-header">
                        <div>
                            <h1 className="myskills-page-title">My Skills</h1>
                            <p className="myskills-page-subtitle">
                                Track the abilities you're learning and the knowledge you share.
                            </p>
                        </div>
                        <div className="myskills-overview-badge">
                            <div className="myskills-overview-pill">
                                <span className="pill-dot blue" />
                                <span><strong>{skillsWantCount}</strong> Learning</span>
                            </div>
                            <div className="myskills-overview-pill">
                                <span className="pill-dot green" />
                                <span><strong>{skillsOfferCount}</strong> Teaching</span>
                            </div>
                        </div>
                    </header>

                    {/* HERO CARDS SECTION */}
                    <div className="row g-3 g-lg-4">
                        {/* WANTED SKILLS CARD */}
                        <div className="col-12 col-md-6">
                            <div className="myskills-hero-card myskills-wanted-card">
                                <span className="myskills-hero-background-icon material-symbols-outlined">
                                    school
                                </span>

                                <div className="myskills-card-top">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="myskills-hero-icon">
                                                <span className="material-symbols-outlined">school</span>
                                            </div>
                                            <h2 className="myskills-hero-title mb-0">Wanted Skills</h2>
                                        </div>
                                        <span className="myskills-pill-status">Learner Track</span>
                                    </div>
                                    <p className="myskills-card-desc">
                                        Skills and topics you want to acquire or improve through mentorship.
                                    </p>
                                </div>

                                <div className="myskills-card-middle">
                                    <div className="myskills-stat-box">
                                        <span className="myskills-hero-number">{skillsWantCount}</span>
                                        <span className="myskills-hero-label">Skills In Progress</span>
                                    </div>
                                    <div className="myskills-stat-meta">
                                        <span className="meta-info">
                                            {skillsWantCount === 0 ? "No skills added yet" : "Active goals"}
                                        </span>
                                    </div>
                                </div>

                                <div className="myskills-card-bottom">
                                    <button
                                        type="button"
                                        className="btn myskills-btn myskills-btn-light"
                                        onClick={() => navigate("/my_skills/want/")}
                                    >
                                        <span>Explore Skills</span>
                                        <span className="material-symbols-outlined icon-slide">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* OFFERED SKILLS CARD */}
                        <div className="col-12 col-md-6">
                            <div className="myskills-hero-card myskills-offered-card">
                                <span className="myskills-hero-background-icon material-symbols-outlined">
                                    record_voice_over
                                </span>

                                <div className="myskills-card-top">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="myskills-hero-icon">
                                                <span className="material-symbols-outlined">record_voice_over</span>
                                            </div>
                                            <h2 className="myskills-hero-title mb-0">Offered Skills</h2>
                                        </div>
                                        <span className="myskills-pill-status">Mentor Track</span>
                                    </div>
                                    <p className="myskills-card-desc">
                                        Expertise you teach and sessions you share with the community.
                                    </p>
                                </div>

                                <div className="myskills-card-middle">
                                    <div className="myskills-stat-box">
                                        <span className="myskills-hero-number">{skillsOfferCount}</span>
                                        <span className="myskills-hero-label">Skills Teaching</span>
                                    </div>
                                    <div className="myskills-stat-meta">
                                        <span className="meta-info">
                                            {skillsOfferCount === 0 ? "Ready to share knowledge" : "Available to mentor"}
                                        </span>
                                    </div>
                                </div>

                                <div className="myskills-card-bottom">
                                    <button
                                        type="button"
                                        className="btn myskills-btn myskills-btn-green"
                                        onClick={() => navigate("/my_skills/offer/")}
                                    >
                                        <span>Manage Skills</span>
                                        <span className="material-symbols-outlined icon-slide">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="myskills-footer">
                <p className="mb-0">
                    © 2024 <strong>SkillSwap</strong>. Empowering the next generation of experts.
                </p>
            </footer>
        </div>
    )
}

export default MySkills