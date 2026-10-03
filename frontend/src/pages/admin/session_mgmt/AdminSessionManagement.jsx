import React,{useEffect,useState} from "react";

import adminApi from '../../../services/adminApi'

import SessionStats from '../../../components/admin/session_mgmt/SessionStats'
import SessionFilters from '../../../components/admin/session_mgmt/SessionFilters'
import SessionTable from '../../../components/admin/session_mgmt/SessionTable'
import CompletionTrends from '../../../components/admin/session_mgmt/CompletionTrends'
import ActivityHeatmap from '../../../components/admin/session_mgmt/ActivityHeatmap'

import './AdminSessionManagement.css'

const AdminSessionManagement=()=>{
    const [sessions,setSessions]=useState([])
    const [stats,setStats]=useState({
        total_sessions:0,
        upcoming:0,
        ongoing:0,
        completed:0,
        cancelled:0,
        rejected:0,
        expired:0,
        average_duration:0,
        average_rating:null,
    })
    const [completionTrends,setCompletionTrends]=useState({
        completed:{
            count:0,
            percentage:0,
        },
        cancelled:{
            count:0,
            percentage:0,
        },
        expired:{
            count:0,
            percentage:0,
        },
        rejected:{
            count:0,
            percentage:0,
        },
    })
    const [tab,setTab]=useState('ALL')
    const [search,setSearch]=useState('')
    const [status,setStatus]=useState('')
    const [sessionType,setSessionType]=useState('ALL')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        fetchSessions()
    },[tab,status,sessionType])
    const fetchSessions=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                '/sessions/admin/',{
                    tab,
                    status,
                    session_type:sessionType,
                    search,
                }
            )
            setSessions(response.data.sessions||[])
            setStats(response.data.stats)
            setCompletionTrends(response.data.completion_trends)
        }catch(err){
            console.error('failed to load sessions:',err)
            setError(err.response?.data?.detail||'failed to load sessions')
        }finally{
            setLoading(false)
        }
    }
    const handleSearchSubmit=()=>{
        fetchSessions()
    }
    const tabs=[
        {
            key:'ALL',
            label:'All Sessions',
        },
        {
            key:'UPCOMING',
            label:'Upcoming',
        },
        {
            key:'ONGOING',
            label:'Ongoing',
        },
        {
            key:'COMPLETED',
            label:'Completed',
        },
        {
            key:'CANCELLED',
            label:'Cancelled',
        },
        {
            key:'REJECTED',
            label:'Rejected',
        },
        {
            key:'EXPIRED',
            label:'Expired',
        },
    ]
    return (
        <div className="container-fluid px-4 py-4">

            {/* HEADER */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Session Management
                    </h2>

                    <p className="text-muted mb-0">
                        Monitor and manage SkillSwap sessions.
                    </p>

                </div>

            </div>


            {/* STATS */}

            <SessionStats
                stats={stats}
            />


            {/* TABS */}

            <div className="mb-4">

                <div
                    className="nav nav-pills gap-2 bg-light p-2 rounded-4 d-inline-flex flex-wrap"
                >

                    {tabs.map((item) => (

                        <button
                            key={item.key}
                            type="button"
                            className={`nav-link rounded-3 ${
                                tab === item.key
                                    ? "active"
                                    : "text-muted"
                            }`}
                            onClick={() => {

                                setTab(
                                    item.key
                                );

                                if (
                                    [
                                        "COMPLETED",
                                        "CANCELLED",
                                        "REJECTED",
                                        "EXPIRED"
                                    ].includes(
                                        item.key
                                    )
                                ) {

                                    setStatus(
                                        item.key
                                    );

                                } else {

                                    setStatus("");

                                }

                            }}
                        >
                            {item.label}
                        </button>

                    ))}

                </div>

            </div>


            {/* FILTERS */}

            <SessionFilters

                search={search}
                setSearch={setSearch}

                status={status}
                setStatus={setStatus}

                sessionType={sessionType}
                setSessionType={
                    setSessionType
                }

            />


            {/* CONTENT */}

            <div className="row g-4">

                {/* TABLE */}

                <div className="col-12 col-xl-9">

                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}

                    {loading ? (

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="text-muted mt-3 mb-0">
                                    Loading sessions...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <SessionTable
                            sessions={sessions}
                        />

                    )}

                </div>


                {/* SIDEBAR */}

                <div className="col-12 col-xl-3">

                    <div className="d-flex flex-column gap-4">

                        <CompletionTrends
                            completionTrends={
                                completionTrends
                            }
                        />

                        <ActivityHeatmap
                            sessions={
                                sessions
                            }
                        />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminSessionManagement