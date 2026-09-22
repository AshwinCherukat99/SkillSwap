import React,{useState,useEffect} from 'react'

import api from '../../../services/api'

import SessionStats from '../../../components/user/session_history/SessionStats'
import SessionFilters from '../../../components/user/session_history/SessionFilters'
import SessionCard from '../../../components/user/session_history/SessionCard'
import SessionDetailsModal from '../../../components/user/session_history/SessionDetailsModal'

import './SessionHistory.css'

const SessionHistory=()=>{
    const [sessions,setSessions]=useState([])
    const [stats,setStats]=useState({
        total_sessions:0,
        completed_sessions:0,
        total_hours:0,
    })
    const [search,setSearch]=useState('')
    const [statusFilter,setStatusFilter]=useState('ALL')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [selectedSession,setSelectedSession]=useState(null)
    const fetchSessions=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.get(
                '/sessions/history/',
                {
                    params:{
                        search,
                        status:statusFilter,
                    },
                }
            ) 
            setSessions(response.data.sessions||[])
            setStats(
                response.data.stats||{
                    total_sessions:0,
                    completed_sessions:0,
                    total_hours:0,
                }
            )
        }catch(err){
            console.error('failed to fetch session history:',err)
            setError(err.response?.data?.error||'failed to load session history')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        const timer=setTimeout(()=>{
            fetchSessions()
        },300)
        return ()=>clearTimeout(timer)
    },[search,statusFilter])
    return (
        <div className="session-history-page">

            <div className="container py-5">

                {/* Header */}

                <div className="session-history-header mb-5">

                    <div>

                        <h1>
                            Session History
                        </h1>

                        <p>
                            Review your completed and past
                            learning sessions.
                        </p>

                    </div>

                </div>


                {/* Statistics */}

                <SessionStats
                    stats={stats}
                />


                {/* Filters */}

                <SessionFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />


                {/* Error */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {/* Loading */}

                {loading && (

                    <div className="session-loading">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p>
                            Loading session history...
                        </p>

                    </div>

                )}


                {/* Empty */}

                {!loading &&
                    !error &&
                    sessions.length === 0 && (

                        <div className="session-empty">

                            <h4>
                                No sessions found
                            </h4>

                            <p>
                                Try changing your search
                                or filters.
                            </p>

                        </div>

                    )}


                {/* Session List */}

                {!loading &&
                    sessions.length > 0 && (

                        <div className="session-list">

                            {sessions.map(
                                (session) => (

                                    <SessionCard
                                        key={`${session.id}-${session.title}`}
                                        session={session}
                                        onClick={() =>
                                            setSelectedSession(
                                                session
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}


                {/* Details Modal */}

                {selectedSession && (

                    <SessionDetailsModal
                        session={selectedSession}
                        onClose={() =>
                            setSelectedSession(null)
                        }
                    />

                )}

            </div>

        </div>
    )
}

export default SessionHistory