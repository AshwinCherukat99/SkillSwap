import React,{useEffect,useState} from 'react'

import api from '../../../services/api'

import SessionFilters from '../../../components/user/upcoming_sessions/SessionFilters'      
import SessionStats from '../../../components/user/upcoming_sessions/SessionStats'
import SessionRequestCard from '../../../components/user/upcoming_sessions/SessionRequestCard'         
import AcceptedSessionCard from '../../../components/user/upcoming_sessions/AcceptedSessionCard'

const UpcomingSessions=()=>{
    const [sessions,setSessions]=useState([])
    const [requests,setRequests]=useState([])
    const [stats,setStats]=useState({
        upcoming_sessions:0,
        total_hours:0,
        upcoming_user_sessions:0,
        learning_streak:0,
    })
    const [search,setSearch]=useState('')
    const [type,setType]=useState('ALL')
    const [loading,setLoading]=useState(true)
    const [requestLoading,setRequestLoading]=useState(true)
    const [error,setError]=useState("")
    const fetchSessions=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.get(
                '/sessions/upcoming/',
                {
                    params:{
                        search,
                        type,
                    },
                }
            )
            setSessions(response.data.sessions||[])
            setStats(response.data.stats||{})
        }catch(err){
            console.error(
                'failed to fetch upcoming sessions:',
            err
            )
            setError(
                err.response?.data?.error||
                'failed to load upcoming sessions'
            )
        }finally{
            setLoading(false)
        }
    }
    const fetchRequests=async ()=>{
        try{
            setRequestLoading(true)
            const response=await api.get(
                '/sessions/requests/'
            )
            setRequests(response.data.requests||[])
        }catch(err){
            console.error(
                'failed to fetch session requests:',
                err
            )
        }finally{
            setRequestLoading(false)
        }
    }
    useEffect(()=>{
        const timer=setTimeout(()=>{
            fetchSessions()
        },300)
        return ()=>clearTimeout(timer)
    },[search,type])
    useEffect(()=>{
        fetchRequests()
    },[])
    const handleRequestAction=async (sessionId,action)=>{
        try{
            await api.post(
                `/sessions/requests/${sessionId}/action/`,
                {
                    action,
                }
            )
            setRequests(
                previous=>previous.filter(
                    session=>session.id!==sessionId
                )
            )
            fetchSessions()
        }catch(err){
            console.error(
                'failed to process session request:',
                err
            )
            alert(err.reponse?.data?.error||'failed to process request')
        }
    }
    return (
        <div className="upcoming-sessions-page">

            <div className="container py-5">

                {/* Header */}

                <div className="upcoming-header mb-5">

                    <div>

                        <h1>
                            Upcoming Sessions
                        </h1>

                        <p>
                            Manage your upcoming sessions
                            and session requests in one place.
                        </p>

                    </div>

                </div>


                {/* Stats */}

                <SessionStats
                    stats={stats}
                />


                {/* Filters */}

                <SessionFilters
                    search={search}
                    setSearch={setSearch}
                    type={type}
                    setType={setType}
                />


                {/* Error */}

                {error && (

                    <div
                        className="alert alert-danger"
                    >
                        {error}
                    </div>

                )}


                {/* Request Queue */}

                {!requestLoading &&
                    requests.length > 0 && (

                        <section className="mb-5">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        Session Requests
                                    </h2>

                                    <p>
                                        Requests waiting for your response.
                                    </p>

                                </div>

                                <span>
                                    {requests.length}
                                </span>

                            </div>


                            <div className="session-request-list">

                                {requests.map(
                                    session => (

                                        <SessionRequestCard
                                            key={
                                                `request-${session.id}`
                                            }
                                            session={
                                                session
                                            }
                                            onAction={
                                                handleRequestAction
                                            }
                                        />

                                    )
                                )}

                            </div>

                        </section>

                    )}


                {/* Upcoming Sessions */}

                <section>

                    <div className="section-heading">

                        <div>

                            <h2>
                                Accepted Sessions
                            </h2>

                            <p>
                                Your confirmed upcoming sessions.
                            </p>

                        </div>

                    </div>


                    {loading && (

                        <div className="session-loading">

                            <div
                                className="spinner-border text-primary"
                            />

                            <p>
                                Loading sessions...
                            </p>

                        </div>

                    )}


                    {!loading &&
                        sessions.length === 0 && (

                            <div className="session-empty">

                                <h4>
                                    No upcoming sessions
                                </h4>

                                <p>
                                    You don't have any
                                    confirmed sessions yet.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        sessions.length > 0 && (

                            <div className="accepted-session-list">

                                {sessions.map(
                                    session => (

                                        <AcceptedSessionCard
                                            key={
                                                `${session.type}-${session.id}`
                                            }
                                            session={
                                                session
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                </section>

            </div>

        </div>
    )
}

export default UpcomingSessions