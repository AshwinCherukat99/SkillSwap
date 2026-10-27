import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './Skills_Offer.css'

import { API_BASE_URL } from '../../../config'

function Skills_Offer(){
    const navigate=useNavigate()
    const [offerSkills,setOfferSkills]=useState([])
    const [allSkills,setAllSkills]=useState([])
    const [loading,setLoading]=useState(true)
    const [addingSkillId,setAddingSkillId]=useState(null)
    const [removingSkillId,setRemovingSkillId]=useState(null)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("") 
    const [searchTerm,setSearchTerm]=useState("")
    const getAccessToken=()=>{
        return (
            localStorage.getItem('access_token')||
            sessionStorage.getItem('access_token')
        )
    }
    const getHeaders=()=>{
        const accessToken=getAccessToken()
        return {
            Authorization:`Bearer ${accessToken}`,
            "Content-Type":"application/json",
        }
    }
    const normalizeData=(data)=>{
        if (Array.isArray(data)){
            return data
        }
        if (data?.results){
            return data.results
        }
        return []
    }
    const getSkillName=(item)=>{
        if (!item){
            return ""
        }
        if (typeof item.skill==='object'){
            return item.skill?.name||""
        }
        return (
            item.skill_name||
            item.name||
            'unnamed skill'
        )
    }
    const getSkillId=(item)=>{
        if (!item){
            return null
        }
        if (typeof item.skill==='object'){
            return item.skill?.id
        }
        return item.skill
    }
    const loadSkills=async ()=>{
        const accessToken=getAccessToken()
        if (!accessToken){
            navigate('/login/')
            return
        }
        try{
            setLoading(true)
            setError("")
            const [offerResponse,allSkillsResponse]=await Promise.all([
                fetch(
                    `${API_BASE_URL}/skills/offer/`,
                    {
                        method:'GET',
                        headers:getHeaders(),
                    }
                ),
                fetch(
                    `${API_BASE_URL}/skills/`,
                    {
                        method:'GET',
                        headers:getHeaders(),
                    }
                )
            ])
            const offerData=await offerResponse.json()
            const allSkillsData=await allSkillsResponse.json()
            console.log(
                'offer skills:',
                offerResponse.status,
                offerData
            )
            console.log(
    'first offer skill:',
    normalizeData(offerData)[0]
)
            console.log(
                'all skills:',
                allSkillsResponse.status,
                allSkillsData
            )
            if (!offerResponse.ok){
                throw new Error(
                    offerData.detail||
                    offerData.error||
                    'unable to load your teaching skills'
                )
            }
            if (!allSkillsResponse.ok){
                throw new Error(
                    allSkillsData.detail||
                    allSkillsData.error||
                    'unable to load available skills'
                )
            }
            setOfferSkills(
                normalizeData(offerData)
            )
            setAllSkills(
                normalizeData(allSkillsData)
            )
        }catch(err){
            console.error(
                'skills loading error:',
                err
            )
            setError(
                err.message||
                'unable to load skills'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        loadSkills()
    },[])
    const handleAddSkill=async (skillId)=>{
        try{
            setAddingSkillId(skillId)
        setError("")
        setSuccess("")
        const response=await fetch(
            `${API_BASE_URL}/skills/offer/`,
            {
                method:'POST',
                headers:getHeaders(),
                body:JSON.stringify({
                    skill_id:skillId,
                }),
            }
        )
        const data=await response.json()
        console.log('add skill response:',response.status,data)
        if (!response.ok){
            throw new Error(
                data.detail||
                data.error||
                data.skill?.[0]||
                'unable to add skill'
            )
        }
        setSuccess('skill added successfully') 
        await loadSkills()
        }catch(err){
            console.error(
                'add skill error:',
                err
            )
            setError(
                err.message||
                'unable to add skill'
            )
        }finally{
            setAddingSkillId(null)
        }
    }
    const handleRemoveSkill=async (userSkillId)=>{
        const confirmed=window.confirm('are you sure you want to remove this skill?')
        if (!confirmed){
            return
        }
        try{
            setRemovingSkillId(
                userSkillId
            )
            setError("") 
            setSuccess("")
            console.log("Skill id being removed:", userSkillId);
            const response=await fetch(
                `${API_BASE_URL}/api/skills/offer/${userSkillId}/`,
                {
                    method:'DELETE',
                    headers:{
                        Authorization:`Bearer ${getAccessToken()}`
                    },
                }
            )
            let data=null
            try{
                data=await response.json()
            }catch{

            }
            console.log('remove skill response:',response.status,data)
            if (!response.ok){
                throw new Error(
                    data?.detail||
                    data?.error||
                    'unable to remove skill'
                )
            }
            setSuccess('skill removed successfully')
            setOfferSkills(
                (currentSkills)=>(
                    currentSkills.filter(
                        (skill)=>{
                            skill.id!==userSkillId
                        }
                    )
                )
            )
        }catch(err){
            console.error('remove skill error:',err)
            setError(
                err.message||
                'unable to remove skill'
            )
        }finally{
            setRemovingSkillId(null)
        }
    }
    const offeredSkillIds=new Set(
        offerSkills.map(
        (item)=>getSkillId(item)
        )
    )
    const availableSkills=
    allSkills.filter(
        (skill)=>
            !offeredSkillIds.has(
                skill.id
            )
    )
    const filteredOfferSkills=
    offerSkills.filter(
        (item)=>getSkillName(item)?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredAvailableSkills=
    availableSkills.filter(
        (skill)=>
            skill.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (loading) {
        return (
            <div className="skills-offer-page d-flex justify-content-center align-items-center">
                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-muted">
                        Loading your teaching skills...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="skills-offer-page">

            <div className="container py-5">

                {/* HEADER */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                    <div>

                        <h1 className="skills-page-title">
                            Skills I Teach
                        </h1>

                        <p className="skills-page-subtitle mb-0">
                            Manage the skills and knowledge
                            you share with other users.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary skills-back-btn"
                        onClick={() =>
                            navigate("/my_skills/")
                        }
                    >

                        <i className="bi bi-arrow-left me-2" />

                        Back to My Skills

                    </button>

                </div>


                {/* ALERTS */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>

                )}

                {success && (

                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {success}
                    </div>

                )}


                {/* SEARCH */}

                <div className="skills-search-wrapper mb-5">

                    <i className="bi bi-search skills-search-icon" />

                    <input
                        type="text"
                        className="form-control skills-search-input"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* MY TEACHING SKILLS */}

                <section className="mb-5">

                    <div className="section-heading">

                        <div>

                            <h2>
                                My Teaching Skills
                            </h2>

                            <p>
                                Skills currently available
                                for you to offer.
                            </p>

                        </div>

                        <span className="skills-count-badge">
                            {
                                offerSkills.length
                            }{" "}
                            Skills
                        </span>

                    </div>


                    {filteredOfferSkills.length === 0 ? (

                        <div className="empty-skills-card">

                            <i className="bi bi-book fs-1 mb-3" />

                            <h4>
                                No teaching skills found
                            </h4>

                            <p className="mb-0">
                                Add skills from the
                                master skill list below.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {filteredOfferSkills.map(
                                (item) => (

                                    <div
                                        className="col-md-6 col-xl-4"
                                        key={item.id}
                                    >

                                        <div className="card skill-card h-100">

                                            <div className="card-body d-flex flex-column">

                                                <div className="d-flex align-items-center gap-3 mb-4">

                                                    <div className="skill-icon">

                                                        <i className="bi bi-lightbulb" />

                                                    </div>

                                                    <div>

                                                        <h4 className="mb-1">

                                                            {
                                                                getSkillName(
                                                                    item
                                                                )
                                                            }

                                                        </h4>

                                                        <span className="text-muted small">
                                                            Teaching Skill
                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="mt-auto">

                                                    <button
                                                        type="button"
                                                        className="btn remove-skill-btn w-100"
                                                        disabled={
                                                            removingSkillId ===
                                                            item.id
                                                        }
                                                        onClick={() =>
                                                            handleRemoveSkill(
                                                                item.skill.id
                                                            )
                                                        }
                                                    >

                                                        {removingSkillId ===
                                                        item.id ? (

                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" />

                                                                Removing...

                                                            </>

                                                        ) : (

                                                            <>
                                                                <i className="bi bi-trash me-2" />

                                                                Remove Skill
                                                            </>

                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* MASTER SKILL LIST */}

                <section className="master-skills-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Add New Skills
                            </h2>

                            <p>
                                Choose from the available
                                skills and add them to your
                                teaching profile.
                            </p>

                        </div>

                    </div>


                    {filteredAvailableSkills.length === 0 ? (

                        <div className="empty-skills-card">

                            <i className="bi bi-check-circle fs-1 mb-3" />

                            <h4>
                                No more skills available
                            </h4>

                            <p className="mb-0">
                                You have already added all
                                currently available skills.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {
                                filteredAvailableSkills.map(
                                    (skill) => (

                                        <div
                                            className="col-md-6 col-xl-4"
                                            key={skill.id}
                                        >

                                            <div className="card available-skill-card h-100">

                                                <div className="card-body d-flex flex-column">

                                                    <div className="d-flex align-items-center gap-3">

                                                        <div className="available-skill-icon">

                                                            <i className="bi bi-plus-lg" />

                                                        </div>

                                                        <div>

                                                            <h5 className="mb-1">

                                                                {
                                                                    skill.name
                                                                }

                                                            </h5>

                                                            <small className="text-muted">
                                                                Available to add
                                                            </small>

                                                        </div>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="btn add-skill-btn w-100 mt-4"
                                                        disabled={
                                                            addingSkillId ===
                                                            skill.id
                                                        }
                                                        onClick={() =>
                                                            handleAddSkill(
                                                                skill.id
                                                            )
                                                        }
                                                    >

                                                        {addingSkillId ===
                                                        skill.id ? (

                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" />

                                                                Adding...

                                                            </>

                                                        ) : (

                                                            <>
                                                                <i className="bi bi-plus-circle me-2" />

                                                                Add Skill
                                                            </>

                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Skills_Offer