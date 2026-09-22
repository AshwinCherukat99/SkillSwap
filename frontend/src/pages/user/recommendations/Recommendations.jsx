import {useEffect,useState,useMemo} from 'react' 
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

import './Recommendations.css' 

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'http://127.0.0.1:8000'

function Recommendations(){
    const navigate=useNavigate()
    const accessToken=useSelector(
        (state)=>state.auth.accessToken
    )
    const [recommendations,setRecommendations]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")  

    const getHeaders=()=>{
        return {
            Authorization:`Bearer ${accessToken}`,
            "Content-Type":"application/json",
        }
    }

    const loadRecommendations=async ()=>{
        if (!accessToken){
            navigate('/login/',{
                replace:true,
            })
            return
        }
        try{
            setLoading(true)
            setError("")
            const response=await fetch(
                `${API_BASE_URL}/api/auth/recommendations/`,
                {
                    method:'GET',
                    headers:getHeaders(),
                }
            )
            const data=await response.json()
            console.log(
                'recommendations response:',
                response.status,
                data
            )
            if (!response.ok){
                throw new Error(
                    data.detail ||
                        data.error ||
                        data.message ||
                        'unable to load recommendations'
                )
            }
            const results=Array.isArray(data)?data:(data.recommendations||data.results||[])
            setRecommendations(results)
        }catch(err){
            console.error('recommendations error:',err)
            setError(err.message||'unable to load recommendations')
        }finally{
            setLoading(false)
        }
    }
    useEffect(
        ()=>{
            loadRecommendations()
        },
    [])
    const getUser=(recommendation)=>{
        return (
            recommendation.user||
            recommendation.recommended_user||
            recommendation
        )
    }
    const getMatchPercentage=(recommendation)=>{
        let score=recommendation.match_score??recommendation.score??0
        if (score<=1){
            score=score*100
        }
        return Math.round(score)
    }
    const getSkills=(recommendation)=>{
        return (
            recommendation.matched_skills||recommendation.matching_skills||recommendation.skills||recommendation.mutual_skills||[]
        )
    }
    const getSkillName=(skill)=>{
        if (typeof skill==='string'){
            return skill
        } 
        return (
            skill.name||
            skill.skill_name||
            skill.skill?.name||
            'Skill'
        )
    }
    const getProfileImage=(user)=>{
        const image=user.profile
        if (!image){
            return null
        }
        if (image.startsWith('http')){
            return image
        }
        return `${API_BASE_URL}${image}`
    }
    const perfectMatches=recommendations.filter(
        (recommendation)=>{
            return (
                getMatchPercentage(recommendation)>=90
            )
        }
    ).length
    const mutualSkillMatches=recommendations.filter(
        (recommendation)=>{
            const mutual_skills=recommendation.mutual_skills||recommendation.matching_skills||[]
            return (mutual_skills.length>0)
        }
    ).length
    const displayedRecommendations=useMemo(()=>{
        return [...recommendations].sort(
            (a,b)=>getMatchPercentage(b)-getMatchPercentage(a)
        )
    },[recommendations])
    const handleRequestSession=(user)=>{
        navigate(`/sessions/request/${user.id}`)
    }
    const handleMessage=(user)=>{
        navigate(`/messages/?user=${user.id}`)
    }
    const handleViewProfile=(user)=>{
        navigate(`/profile/${user.id}/`)
    }
    return (
            <div className="recommendations-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div
                className="recommendations-header"
            >

                <div>

                    <div className="ai-badge">

                        <i
                            className="bi bi-stars"
                        />

                        AI POWERED MATCHING

                    </div>


                    <h1>

                        Recommended for You

                    </h1>


                    <p>

                        Discover users whose skills
                        match your learning goals
                        and who may benefit from
                        the skills you offer.

                    </p>

                </div>


                <button
                    className="btn recommendations-refresh-btn"
                    onClick={
                        loadRecommendations
                    }
                >

                    <i className="bi bi-arrow-clockwise me-2" />

                    Refresh

                </button>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {

                error && (

                    <div
                        className="alert alert-danger"
                    >

                        {error}

                    </div>

                )

            }


            {/* ==========================================
                STATS
            ========================================== */}

            <div
                className="row g-4 mb-5"
            >


                {/* PERFECT MATCHES */}

                <div
                    className="col-md-6"
                >

                    <div
                        className="recommendation-stat-card"
                    >

                        <div
                            className="recommendation-stat-icon"
                        >

                            <i
                                className="bi bi-stars"
                            />

                        </div>


                        <div>

                            <div
                                className="recommendation-stat-label"
                            >

                                PERFECT MATCHES

                            </div>


                            <div
                                className="recommendation-stat-number"
                            >

                                {
                                    perfectMatches
                                }

                            </div>

                        </div>

                    </div>

                </div>


                {/* MUTUAL SKILL MATCHES */}

                <div
                    className="col-md-6"
                >

                    <div
                        className="recommendation-stat-card"
                    >

                        <div
                            className="recommendation-stat-icon mutual-icon"
                        >

                            <i
                                className="bi bi-arrow-left-right"
                            />

                        </div>


                        <div>

                            <div
                                className="recommendation-stat-label"
                            >

                                MUTUAL SKILL MATCHES

                            </div>


                            <div
                                className="recommendation-stat-number"
                            >

                                {
                                    mutualSkillMatches
                                }

                            </div>

                        </div>

                    </div>

                </div>


            </div>


            {/* ==========================================
                LOADING
            ========================================== */}

            {

                loading && (

                    <div
                        className="recommendations-loading"
                    >

                        <div
                            className="spinner-border text-primary"
                        />

                        <p>

                            Finding your best
                            skill matches...

                        </p>

                    </div>

                )

            }


            {/* ==========================================
                EMPTY STATE
            ========================================== */}

            {

                !loading &&

                displayedRecommendations.length ===
                0 && (

                    <div
                        className="recommendations-empty"
                    >

                        <i
                            className="bi bi-people"
                        />

                        <h4>

                            No recommendations found

                        </h4>


                        <p>

                            Try updating your
                            skills you teach and
                            skills you want to
                            learn.

                        </p>

                    </div>

                )

            }


            {/* ==========================================
                USER CARDS
            ========================================== */}

            <div
                className="row g-4"
            >

                {

                    !loading &&

                    displayedRecommendations.map(
                        (
                            recommendation
                        ) => {

                            const user =
                                getUser(
                                    recommendation
                                );


                            const matchPercentage =
                                getMatchPercentage(
                                    recommendation
                                );


                            const skills =
                                getSkills(
                                    recommendation
                                );


                            const profileImage =
                                getProfileImage(
                                    user
                                );


                            const averageRating =
                                user.average_rating ??
                                recommendation.average_rating ??
                                0;


                            const completedSessions =
                                user.completed_sessions ??
                                recommendation.completed_sessions ??
                                0;


                            const reason =
                                recommendation.reason ||
                                recommendation.match_reason ||
                                "You have compatible teaching and learning skills.";


                            return (

                                <div

                                    className="col-md-6 col-xl-4"

                                    key={
                                        recommendation.id ||
                                        user.id
                                    }

                                >

                                    <div
                                        className="recommendation-user-card"
                                    >


                                        {/* CARD TOP */}

                                        <div
                                            className="recommendation-card-top"
                                        >


                                            <div
                                                className="recommendation-avatar-wrapper"
                                            >

                                                {

                                                    profileImage ? (

                                                        <img

                                                            src={
                                                                profileImage
                                                            }

                                                            alt={
                                                                user.full_name ||
                                                                user.username
                                                            }

                                                            className="recommendation-avatar"

                                                        />

                                                    ) : (

                                                        <div
                                                            className="recommendation-avatar-placeholder"
                                                        >

                                                            <i
                                                                className="bi bi-person"
                                                            />

                                                        </div>

                                                    )

                                                }

                                            </div>


                                            <span
                                                className="match-badge"
                                            >

                                                {
                                                    matchPercentage
                                                }%

                                                {" "}

                                                Match

                                            </span>

                                        </div>


                                        {/* NAME */}

                                        <h3
                                            className="recommendation-name"
                                        >

                                            {

                                                user.full_name ||

                                                user.username ||

                                                "SkillSwap User"

                                            }

                                        </h3>


                                        {/* USERNAME */}

                                        {

                                            user.username && (

                                                <p
                                                    className="recommendation-username"
                                                >

                                                    @
                                                    {
                                                        user.username
                                                    }

                                                </p>

                                            )

                                        }


                                        {/* MATCH REASON */}

                                        <div
                                            className="match-reason"
                                        >

                                            <div
                                                className="match-reason-title"
                                            >

                                                WHY THIS MATCH?

                                            </div>


                                            <p>

                                                {reason}

                                            </p>

                                        </div>


                                        {/* SKILLS */}

                                        {

                                            skills.length >
                                            0 && (

                                                <div
                                                    className="matched-skills"
                                                >

                                                    {

                                                        skills
                                                            .slice(
                                                                0,
                                                                4
                                                            )
                                                            .map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => (

                                                                    <span

                                                                        className="skill-badge"

                                                                        key={
                                                                            skill.id ||
                                                                            index
                                                                        }

                                                                    >

                                                                        {
                                                                            getSkillName(
                                                                                skill
                                                                            )
                                                                        }

                                                                    </span>

                                                                )
                                                            )

                                                    }

                                                </div>

                                            )

                                        }


                                        {/* RATING + SESSIONS */}

                                        <div
                                            className="recommendation-card-stats"
                                        >

                                            <div
                                                className="rating-stat"
                                            >

                                                <i
                                                    className="bi bi-star-fill"
                                                />

                                                <span>

                                                    {
                                                        Number(
                                                            averageRating
                                                        ).toFixed(
                                                            1
                                                        )
                                                    }

                                                </span>

                                            </div>


                                            <div
                                                className="sessions-stat"
                                            >

                                                <i
                                                    className="bi bi-check-circle"
                                                />

                                                <span>

                                                    {
                                                        completedSessions
                                                    }

                                                    {" "}

                                                    Completed Sessions

                                                </span>

                                            </div>

                                        </div>


                                        {/* ACTION BUTTONS */}

                                        <div
                                            className="recommendation-actions"
                                        >

                                            <button

                                                className="btn btn-primary request-session-btn"

                                                onClick={
                                                    () =>

                                                        handleRequestSession(
                                                            user
                                                        )
                                                }

                                            >

                                                Request Session

                                            </button>


                                            <div
                                                className="row g-2"
                                            >

                                                <div
                                                    className="col-6"
                                                >

                                                    <button

                                                        className="btn btn-outline-secondary w-100"

                                                        onClick={
                                                            () =>

                                                                handleMessage(
                                                                    user
                                                                )
                                                        }

                                                    >

                                                        <i
                                                            className="bi bi-chat-dots me-2"
                                                        />

                                                        Message

                                                    </button>

                                                </div>


                                                <div
                                                    className="col-6"
                                                >

                                                    <button

                                                        className="btn btn-outline-secondary w-100"

                                                        onClick={
                                                            () =>

                                                                handleViewProfile(
                                                                    user
                                                                )
                                                        }

                                                    >

                                                        View Profile

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )

                }

            </div>

        </div>
    )
}

export default Recommendations