import React,{useEffect,useState} from 'react'

import mentorApi from '../../../services/mentorApi'

import SessionStats from '../../../components/user/upcoming_sessions/SessionStats'
import SessionFilters from '../../../components/user/upcoming_sessions/SessionFilters'
import UpcomingSessionCard from '../../../components/mentor/upcoming_sessions/UpcomingSessionCard'
import EmptyState from '../../../components/mentor/upcoming_sessions/EmptyState'

import './MentorUpcomingSessions.css'

const MentorUpcomingSessions=()=>{
    const [stats,setStats]=useState(null)
    const [sessions,setSessions]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [search,setSearch]=useState('')
    const [dateFilter,setDateFilter]=useState('ALL')
    const [sort,setSort]=useState('EARLIEST')
    const fetchSessions=async ()=>{
        try{
            setError('')
            const response=await mentorApi.get(
                '/sessions/mentor/upcoming',
                {
                    params:{
                        search,
                        date:dateFilter,
                        sort,
                    }
                }
            )
            setStats(response.data.stats)
            setSessions(response.data.sessions)
        }catch(error){
            console.error('failed to load upcoming sessions:',error)
            setError(error.response?.data?.detail||'failed to load upcoming sessions')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchSessions()
    },[])
    useEffect(()=>{
        if (!loading){
            fetchSessions()
        }
    },[search,dateFilter,sort])
    const handleCancel=async (session)=>{
        const confirmed=window.confirm(
            `are you sure you want to cancel ${session.title}?`
        )
        if (!confirmed){
            return 
        }
        try{
            await mentorApi.post(
                `/sessions/mentor/course-sessions/${session.id}/cancel/`,
                {
                    cancellation_reason:'cancelled by mentor'
                }
            )
            await fetchSessions()
        }catch(error){
            console.error(
                'failed to cancel session:',
                error
            )
            alert(
                error.response?.data?.detail||
                'failed to cancel session'
            )
        }
    }
    if (loading){
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading upcoming sessions...
                </p>

            </div>
        )
    }
    if (error){
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        )
    }
    return (
        <div className="upcoming-sessions-page">

            <div className="container-fluid px-3 px-lg-5 py-4">


                {/* PAGE HEADER */}

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pb-3 mb-4 border-bottom">

                    <div>

                        <div className="d-flex align-items-center gap-2">

                            <h1 className="h3 fw-bold mb-0">
                                Upcoming Sessions
                            </h1>

                            <span className="badge bg-primary-subtle text-primary">
                                {sessions.length} Active
                            </span>

                        </div>

                        <p className="text-muted mb-0 mt-1">
                            Manage your scheduled mentoring sessions.
                        </p>

                    </div>


                    <div className="date-indicator">

                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}

                    </div>

                </div>


                {/* STATS */}

                <SessionStats
                    stats={stats}
                />


                {/* FILTERS */}

                <SessionFilters
                    search={search}
                    setSearch={setSearch}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    sort={sort}
                    setSort={setSort}
                />


                {/* UPCOMING SESSIONS */}

                <section>

                    <div className="mb-3">

                        <h2 className="h5 fw-bold mb-1">
                            Confirmed Upcoming Sessions
                        </h2>

                        <p className="small text-muted mb-0">
                            Your scheduled mentoring sessions.
                        </p>

                    </div>


                    {sessions.length === 0 ? (

                        <EmptyState />

                    ) : (

                        sessions.map(session => (

                            <UpcomingSessionCard
                                key={session.id}
                                session={session}
                                onCancel={handleCancel}
                            />

                        ))

                    )}

                </section>

            </div>

        </div>
    )
}

export default MentorUpcomingSessions