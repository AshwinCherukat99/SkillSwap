import React,{useEffect,useMemo,useState} from "react";
import {useNavigate} from 'react-router-dom'

import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    UserX,
    Clock3,
    Wallet,
    Download,
    Plus,
    Search,
    SlidersHorizontal,
    RotateCcw,
} from 'lucide-react'

import mentorApi from '../../../services/mentorApi'

import SessionHistoryHeader from "../../../components/mentor/session_history/SessionHistoryHeader";
import SessionStats from "../../../components/mentor/session_history/SessionStats";
import SessionFilters from "../../../components/mentor/session_history/SessionFilters";
import SessionTable from "../../../components/mentor/session_history/SessionTable";
import SessionDetailsPanel from "../../../components/mentor/session_history/SessionDetailsPanel";

const MentorSessionHistory=()=>{
    const navigate=useNavigate()
    const [sessions,setSessions]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [activeTab,setActiveTab]=useState('ALL')
    const [search,setSearch]=useState('')
    const [courseFilter,setCourseFilter]=useState('ALL')
    const [statusFilter,setStatusFilter]=useState('ALL')
    const [dateFilter,setDateFilter]=useState('THIS_MONTH')
    const [selectedSession,setSelectedSession]=useState(null)
    const [showExportMenu,setShowExportMenu]=useState(false)
    useEffect(()=>{
        fetchSessions()
    },[])
    const fetchSessions=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await mentorApi.get(
                '/sessions/mentor/session-history/'
            )
            setSessions(response.data.sessions||[])
        }catch(error){
            console.error('failed to fetch session history:',error)
            setError(error.response?.data?.error||'failed to load session history')
        }finally{
            setLoading(false)
        }
    }
    const getSessionDate=(session)=>{
        return new Date(session.scheduled_start)
    }
    const filteredSessions=useMemo(()=>{
        let result=[...sessions]
        if (activeTab!=='ALL'){
            result=result.filter(
                session=>session.status===activeTab
            )
        }
        if (statusFilter!=='ALL'){
            result=result.filter(
                session=>session.status===statusFilter
            )
        }
        if (courseFilter!=='ALL'){
            result=result.filter(
                session=>session.title===courseFilter
            )
        }
        const searchValue=search.trim().toLowerCase()
        if (searchValue){
            result=result.filter(
                session=>{
                    const student=session.person_name||''
                    const title=session.title||''
                    const message=session.message||''
                    const id=String(session.id||'')
                    return (
                        student.toLowerCase().includes(searchValue)||
                        title.toLowerCase().includes(searchValue)||
                        message.toLowerCase().includes(searchValue)||
                        id.toLowerCase().includes(searchValue)
                    )
                }
            )
        }
        if (dateFilter!=='ALL'){
            const now=new Date()
            result=result.filter(
                session=>{
                    const sessionDate=getSessionDate(session)
                    if (dateFilter==='TODAY'){
                        return (
                            sessionDate.toDateString()===now.toDateString()
                        )
                    }   
                    if (dateFilter==='THIS_WEEK'){
                        const startOfWeek=new Date(now)
                        startOfWeek.setDate(now.getDate()-now.getDay())
                        startOfWeek.setHours(0,0,0,0)
                        return sessionDate>=startOfWeek
                    }
                    if (dateFilter==='THIS_MONTH'){
                        return (
                            sessionDate.getMonth()===now.getMonth()&&
                            sessionDate.getFullYear()===now.getFullYear()
                        )
                    }
                    return true
                }
            )
        }
        return result
    },[
        sessions,
        activeTab,
        statusFilter,
        courseFilter,
        search,
        dateFilter,
    ])
    const stats=useMemo(()=>{
        const total=sessions.length
        const completed=sessions.filter(
            session=>session.status==='COMPLETED'
        ).length
        const cancelled=sessions.filter(
            session=>session.status==='CANCELLED'
        ).length
        const expired=sessions.filter(
            session=>session.status==='EXPIRED'
        )
        const totalMinutes=sessions.reduce(
            (sum,session)=>sum+Number(session.duration_minutes||0),0
        )  
        return {
            total,
            completed,
            cancelled,
            expired,
            totalHours:(totalMinutes/60).toFixed(1)
        }
    },[sessions])
    const courseOptions=useMemo(()=>{
        return [
            ...new Set(sessions.map(session=>session.title).filter(Boolean))
        ]
    },[sessions])
    const handleClearFilters=()=>{
        setActiveTab('ALL')
        setSearch('')
        setCourseFilter('ALL')
        setStatusFilter('ALL')
        setDateFilter('THIS_MONTH')
    }
    const formatDate = (date) => {
        if (!date) return '-'

        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )
    }
    return (
        <div className="mentor-session-history">

            <main className="container-fluid px-4 py-4">

                <SessionHistoryHeader
                    showExportMenu={showExportMenu}
                    setShowExportMenu={setShowExportMenu}
                    onSchedule={() =>
                        navigate('/mentor/sessions/create')
                    }
                />


                <SessionStats
                    stats={stats}
                />


                <SessionFilters
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}

                    search={search}
                    setSearch={setSearch}

                    courseFilter={courseFilter}
                    setCourseFilter={setCourseFilter}

                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}

                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}

                    courseOptions={courseOptions}

                    counts={{
                        all: sessions.length,
                        completed: stats.completed,
                        cancelled: stats.cancelled,
                        expired: stats.expired,
                    }}

                    onClear={handleClearFilters}
                />


                {loading && (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="text-muted mt-3 mb-0">
                            Loading session history...
                        </p>
                    </div>
                )}


                {!loading && error && (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span>{error}</span>

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={fetchSessions}
                        >
                            Retry
                        </button>
                    </div>
                )}


                {!loading &&
                    !error &&
                   sessions.length === 0 && (
                        <div className="session-empty-state">

                            <div className="empty-icon">
                                <Search size={30} />
                            </div>

                            <h4>
                                No matching sessions found
                            </h4>

                            <p>
                                There are no mentoring sessions
                                matching your current filters.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={handleClearFilters}
                            >
                                <RotateCcw
                                    size={16}
                                    className="me-2"
                                />
                                Reset Filters
                            </button>

                        </div>
                    )}


                {!loading &&
                    !error &&
                    sessions.length > 0 && (

                        <>

                            <SessionTable
                                sessions={
                                    sessions
                                }
                                onViewDetails={
                                    setSelectedSession
                                }
                            />

                            
                        </>
                    )}

            </main>


            <SessionDetailsPanel
                session={selectedSession}
                onClose={() =>
                    setSelectedSession(null)
                }
            />

        </div>
    )
}

export default MentorSessionHistory