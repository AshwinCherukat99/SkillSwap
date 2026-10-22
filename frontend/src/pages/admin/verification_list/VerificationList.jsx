import React,{useEffect,useCallback,useMemo,useState} from 'react'
import {useNavigate,useParams} from 'react-router-dom'

import VerificationHeader from '../../../components/admin/verification_list/VerificationHeader'
import VerificationStats from '../../../components/admin/verification_list/VerificationStats'
import VerificationTabs from '../../../components/admin/verification_list/VerificationTabs'
import VerificationFilters from '../../../components/admin/verification_list/VerificationFilters'
import MentorVerificationList from '../../../components/admin/verification_list/MentorVerificaionList'
import VerificationEmptyState from '../../../components/admin/verification_list/VerificationEmptyState'

import adminApi from '../../../services/adminApi'

const VerificationList=()=>{
    const navigate=useNavigate()
    const [mentors,setMentors]=useState([])
    const [stats,setStats]=useState({
        pending:0,
        under_review:0,
        verified:0,
        rejected:0,
    })
    const [activeTab,setActiveTab]=useState('ALL')
    const [search,setSearch]=useState('')
    const [sortBy,setSortBy]=useState('newest')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const fetchMentors=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                '/admin/mentor-verification/'
            )
            setMentors(response.data.mentors||[])
            setStats(response.data.stats||{
                pending:0,
                under_review:0,
                verified:0,
                rejected:0,
            })
        }catch(error){
            console.error('failed to fetch mentor verification list:',error)
            setError(error.response?.data?.error||error.response?.data?.detail||'failed to load mentor verification list')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchMentors()
    },[])
    const filteredMentors=useMemo(()=>{
        let result=[...mentors]
        if (activeTab!=='ALL'){
            result=result.filter(
                (mentor)=>mentor.status?.toUpperCase()===activeTab
            )
        }
        const searchValue=search.trim().toLowerCase()
        if (searchValue){
            result=result.filter((mentor)=>{
                const username=mentor.username?.toLowerCase()||''
                const email=mentor.email?.toLowerCase()||''
                const fullName=mentor.full_name?.toLowerCase()||''
                const profession=mentor.current_profession?.toLowerCase()||''
                const niche=mentor.teaching_niche?.toLowerCase()||''
                return (
                    username.includes(searchValue)||
                    email.includes(searchValue)||
                    fullName.includes(searchValue)||
                    profession.includes(searchValue)||
                    niche.includes(searchValue)
                )
            })
        }
        result.sort((a,b)=>{
            if (sortBy==='newest'){
                return (
                    new Date(b.submitted_at||0)-
                    new Date(a.submitted_at||0)
                )
            }
            if (sortBy==='oldest'){
                return (
                    new Date(a.submitted_at||0)-
                    new Date(b.submitted_at||0)
                )
            }
            if (sortBy==='name'){
                return (
                    (a.username||'').localeCompare(b.username||'')
                )
            }
            return 0
        })
        return result
    },[mentors,activeTab,search,sortBy])
    const handleTabChange=(tab)=>{
        setActiveTab(tab)
    }
    const handleViewDocuments=(mentorId)=>{
        navigate(`/admin/mentor-verification/${mentorId}/documents/`)
    }
    const handleViewProfile=(mentorId)=>{
        navigate(`/admin/mentor/${mentorId}/profile/`)
    }
    const handleClearFilters=()=>{
        setSearch('')
        setActiveTab('ALL')
        setSortBy('newest')
    }
    if (loading){
        return (
            <div className="container-fluid py-4">

                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >

                    <div className="text-center">

                        <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="text-muted mb-0">
                            Loading mentor verification requests...
                        </p>

                    </div>

                </div>

            </div>
        )
    }
    if (error){
        return (
            <div className="container-fluid py-4">

                <div
                    className="alert alert-danger"
                    role="alert"
                >

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <i className="bi bi-exclamation-triangle me-2"></i>

                            {error}

                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={fetchMentors}
                        >

                            <i className="bi bi-arrow-clockwise me-1"></i>

                            Retry

                        </button>

                    </div>

                </div>

            </div>
        )
    }
    return (
        <div className="document-verification-page container-fluid py-4">


            {/* =====================================
                HEADER
            ===================================== */}

            <VerificationHeader />


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="mt-4">

                <VerificationStats
                    stats={stats}
                />

            </div>


            {/* =====================================
                TABS
            ===================================== */}

            <div className="mt-4">

                <VerificationTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    stats={stats}
                />

            </div>


            {/* =====================================
                FILTERS
            ===================================== */}

            <div className="mt-3">

                <VerificationFilters
                    search={search}
                    setSearch={setSearch}
                    documentStatus='all'
                    setDocumentStatus={()=>{}}
                    sort={sortBy}
                    setSort={setSortBy}
                    onReset={handleClearFilters}
                />

            </div>


            {/* =====================================
                RESULTS
            ===================================== */}

            <div className="mt-4">

                {filteredMentors.length > 0 ? (

                    <MentorVerificationList
                        mentors={filteredMentors}
                        onViewDocuments={handleViewDocuments}
                        onViewProfile={handleViewProfile}
                    />

                ) : (

                    <VerificationEmptyState
                        search={search}
                        activeTab={activeTab}
                        onClear={handleClearFilters}
                    />

                )}

            </div>

        </div>
    )
}

export default VerificationList