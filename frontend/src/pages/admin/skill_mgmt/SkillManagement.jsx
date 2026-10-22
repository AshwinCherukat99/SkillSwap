import React,{useEffect,useState} from "react";

import adminApi from '../../../services/adminApi'

import './SkillManagement.css'

import SkillManagementHeader from '../../../components/admin/skill_mgmt/SkillManagementHeader'
import SkillList from '../../../components/admin/skill_mgmt/SkillList'
import SkillSuggestionList from '../../../components/admin/skill_mgmt/SkillSuggestionList'
import AddSkillModal from '../../../components/admin/skill_mgmt/AddSkillModal'
import RejectSkillModal from '../../../components/admin/skill_mgmt/RejectSkillModal'

const SkillManagement=()=>{
    const [skills,setSkills]=useState([])
    const [suggestions,setSuggestions]=useState([])
    const [search,setSearch]=useState('')
    const [suggestionStatus,setSuggestionStatus]=useState('PENDING')
    const [loadingSkills,setLoadingSkills]=useState(true)
    const [loadingSuggestions,setLoadingSuggestions]=useState(true)
    const [error,setError]=useState('')
    const [showAddModal,setShowAddModal]=useState(false)
    const [rejectSuggestion,setRejectSuggestion]=useState(null)
    const fetchSkills=async ()=>{
        try{
            setLoadingSkills(true)
            const response=await adminApi.get(
                '/admin/skills/',
                {
                    params:search
                }
            )
            setSkills(response.data.skills||[])
        }catch(error){
            console.error('failed to load skills:',error)
            setError('failed to load skills')
        }finally{
            setLoadingSkills(false)
        }
    }
    const fetchSuggestions=async ()=>{
        try{
            setLoadingSuggestions(true)
            const response=await adminApi.get(
                '/admin/skill-suggestions/',
                {
                    params:{
                        status:suggestionStatus
                    }
                }
            )
            setSuggestions(response.data.suggestions||[])
        }catch(error){
            console.error('failed to load suggestions:',error)
            setError('failed to load skill suggestions')
        }finally{
            setLoadingSuggestions(false)
        }
    }
    useEffect(()=>{
        fetchSkills()
    },[search])
    useEffect(()=>{
        fetchSuggestions()
    },[suggestionStatus])
    const handleAddSkill=async (data)=>{
        try{
            await adminApi.post(
                '/admin/skills/',
                data
            )
            setShowAddModal(false)
            await fetchSkills()
        }catch(error){
            throw error
        }
    }
    const handleDeleteSkill=async (skillId)=>{
        const confirmed=window.confirm(
            'are you sure you want to delete this skill?'
        )
        if (!confirmed){
            return
        }
        try{
            await adminApi.delete(
                `/admin/skills/${skillId}/`
            )
            setSkills((previous)=>
            previous.filter(
                (skill)=>
                    skill.id!==skillId
            ))
        }catch(error){
            console.error('failed to delete skill:',error)
            setError('failed to delete skill')
        }
    }
    const handleApproveSuggestion=async (suggestionId)=>{
        try{
            await adminApi.post(
                `/admin/skill-suggestions/${suggestionId}/approve/`
            )
            await Promise.all([
                fetchSkills(),
                fetchSuggestions()
            ])
        }catch(error){
            console.error('failed to approve suggestion:',error)
            setError(error.response?.data?.error||'failed to approve suggestion')
        }
    }
    const handleRejectSuggestion=async (
        suggestionId,
        rejectionReason
    )=>{
        try{
            await adminApi.post(
                `/admin/skill-suggestions/${suggestionId}/reject/`,
                {
                    rejection_reason:rejectionReason
                }
            )
            setRejectSuggestion(null)
            await fetchSuggestions()
        }catch(error){
            throw error
        }
    }
    return (
        <div className="container-fluid py-4">

            <SkillManagementHeader
                search={search}
                setSearch={setSearch}
                onAddSkill={() =>
                    setShowAddModal(true)
                }
            />


            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}


            {/* ================================= */}
            {/* Skills */}
            {/* ================================= */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Skills
                            </h5>

                            <p className="text-muted small mb-0">
                                Manage the skills available
                                on SkillSwap.
                            </p>

                        </div>

                        <span className="badge bg-primary-subtle text-primary">
                            {skills.length} Skills
                        </span>

                    </div>


                    <SkillList
                        skills={skills}
                        loading={loadingSkills}
                        onDelete={handleDeleteSkill}
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* Suggestions */}
            {/* ================================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Skill Suggestions
                            </h5>

                            <p className="text-muted small mb-0">
                                Review skills suggested
                                by users.
                            </p>

                        </div>


                        <select
                            className="form-select"
                            style={{
                                width: '180px'
                            }}
                            value={
                                suggestionStatus
                            }
                            onChange={(event) =>
                                setSuggestionStatus(
                                    event.target.value
                                )
                            }
                        >

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                            <option value="all">
                                All
                            </option>

                        </select>

                    </div>


                    <SkillSuggestionList
                        suggestions={
                            suggestions
                        }
                        loading={
                            loadingSuggestions
                        }
                        onApprove={
                            handleApproveSuggestion
                        }
                        onReject={(suggestion) =>
                            setRejectSuggestion(
                                suggestion
                            )
                        }
                    />

                </div>

            </div>


            {/* Add Skill */}

            <AddSkillModal
                show={showAddModal}
                onClose={() =>
                    setShowAddModal(false)
                }
                onSubmit={
                    handleAddSkill
                }
            />


            {/* Reject */}

            <RejectSkillModal
                suggestion={
                    rejectSuggestion
                }
                onClose={() =>
                    setRejectSuggestion(null)
                }
                onSubmit={
                    handleRejectSuggestion
                }
            />

        </div>
    )
}

export default SkillManagement