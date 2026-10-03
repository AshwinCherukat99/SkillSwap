import React,{use, useCallback,useEffect,useState} from 'react'

import {useNavigate} from 'react-router-dom'

import MentorStats from '../../../components/admin/mentor_mgmt/MentorStats'
import MentorFilters from '../../../components/admin/mentor_mgmt/MentorFilters'
import MentorTable from '../../../components/admin/mentor_mgmt/MentorTable'

import adminApi from '../../../services/adminApi'

import './MentorManagement.css'

const MentorManagement=()=>{
    const navigate=useNavigate()
    const [stats,setStats]=useState({
        total:0,
        active:0,
        pending_verification:0,
        suspended:0,
        blocked:0,
    })
    const [mentors,setMentors]=useState([])
    const [activeTab,setActiveTab]=useState('ALL')
    const [search,setSearch]=useState('')
    const [loading,setLoading]=useState(true)
    const [statsLoading,setStatsLoading]=useState(true)
    const fetchStats=async ()=>{
        try{
            setStatsLoading(true)
            const data=await adminApi.get('/admin/mentor-management/stats/')
            setStats(data)
        }catch(err){
            console.error('failed to load mentor stats:',err)
        }finally{
            setStatsLoading(false)
        }
    }
    const fetchMentors=useCallback(
        async ()=>{
            try{
                setLoading(true)
                const data=await adminApi.get(
                    '/admin/mentor-management/',{
                        status:activeTab,
                        search
                    }
                )
                setMentors(data.mentors||[])
            }catch(err){
                console.error('failed to load mentors:',err)
            }finally{
                setLoading(false)
            }
        }
    ,[activeTab,search])
    useEffect(()=>{
        fetchStats()
    },[])
    useEffect(()=>{
        const timeout=setTimeout(()=>{
            fetchMentors()
        },300)
        return ()=>clearTimeout(timeout)
    },[fetchMentors])
    const handleView=(
        mentor,
        destination=null
    )=>{
        if (destination==='courses'){
            navigate()
            return
        }
        if (destination==='sessions'){
            navigate()
            return
        }
        if (destination==='payouts'){
            navigate()
            return
        }
        navigate(`/admin/mentor-management/${mentor.id}/`)
    }
    const handleEdit=(mentor)=>{
        navigate(`/admin/mentor-management/${mentor.id}/edit/`)
    }
    const handleAction=async (mentor,action)=>{
        let confirmationMessage=''
        if (action==='suspend'){
            confirmationMessage=`Are you sure you want to suspend ${mentor.full_name||mentor.username}?`
        }
        else if (action==='block'){
            confirmationMessage=`Are you sure you want to block ${mentor.full_name||mentor.username}?`
        }
        else if (action==='activate'){
            confirmationMessage=`Are you sure you want to activate ${mentor.full_name||mentor.username}?`
        }
        const confirmed=window.confirm(confirmationMessage)
        if (!confirmed){
            return
        }
        try{
            await adminApi.post(
                `/admin/mentor-management/${mentor.id}/action/`,
                action
            )
            await Promise.all([
                fetchMentors(),
                fetchStats()
            ])
        }catch(err){
            console.error('failed to update mentor:',err)
            alert(err.response.data.error||'failed to update mentor')
        }
    }
    const handleRefresh=async ()=>{
        await Promise.all([
            fetchMentors(),
            fetchStats()
        ])
    }
    return (
        <div className="mentor-management-page">

            <div className="container-fluid p-4 p-lg-5">

                {/* Header */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">

                    <div>

                        <h1 className="fw-bold mb-2">
                            Mentor Management
                        </h1>

                        <p className="text-muted mb-0">
                            Manage mentor accounts,
                            activity, courses,
                            sessions, earnings,
                            and payouts across
                            SkillSwap.
                        </p>

                    </div>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleRefresh}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Data
                    </button>

                </div>


                {/* Stats */}

                {!statsLoading && (
                    <div className="mb-4">
                        <MentorStats
                            stats={stats}
                        />
                    </div>
                )}


                {/* Main card */}

                <div className="mentor-main-card">

                    <MentorFilters
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        search={search}
                        setSearch={setSearch}
                        pendingCount={
                            stats.pending_verification
                        }
                    />


                    <MentorTable
                        mentors={mentors}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onAction={handleAction}
                    />

                </div>

            </div>

        </div>
    )
}

export default MentorManagement