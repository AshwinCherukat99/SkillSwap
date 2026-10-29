import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import adminApi from '../../../services/adminApi'       

import KpiCard from '../../../components/admin/dashboard/KpiCard'
import PlatformStatus from '../../../components/admin/dashboard/PlatformStatus'
import RecentSessions from '../../../components/admin/dashboard/RecentSessions'
import SessionVolumeChart from '../../../components/admin/dashboard/SessionVolumeChart'

import './AdminDashboard.css'

function AdminDashboard(){
    const navigate=useNavigate()
    const [dashboard,setDashboard]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [search,setSearch]=useState("")
    const [currentTime,setCurrentTime]=useState("")
    const admin=JSON.parse(
        localStorage.getItem('admin')||'null'
    )
    const fetchDashboard=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await adminApi.get(
                '/admin/dashboard/'
            )
            console.log('dashbord api response:',response)
            console.log('dashboard data:',response.data)
            setDashboard(response.data)
        }catch(error){
            console.error("DASHBOARD API ERROR:", error);
        console.error("ERROR RESPONSE:", error.response);
        console.error("ERROR DATA:", error.response?.data);
            console.error(
                'failed to load admin dashboard:',
                error
            )
            setError(
                error.response?.data?.detail||
                error.response?.data?.error||
                'unable to load dashboard data'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchDashboard()
    },[])
    useEffect(()=>{
        const updateTime=()=>{
            const now=new Date()     
            setCurrentTime(
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour:'2-digit',
                        minute:'2-digit',
                        second:'2-digit',
                        hour12:true,
                    }
                )
            ) 
        }
        updateTime()
        const interval=setInterval(
            updateTime,
            1000
        )
        return ()=>clearInterval(interval)
    },[])
    
    if (loading){
        <div className="admin-dashboard">

                <div className="admin-dashboard-loading">
                    <span className="material-symbols-outlined">
                        progress_activity
                    </span>

                    Loading dashboard...
                </div>

            </div>
    }
    if (error){
        <div className="admin-dashboard">

                <div className="admin-dashboard-error">

                    <span className="material-symbols-outlined">
                        error
                    </span>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>
    } 
    const kpis=dashboard?.kpis||[]
    return (
        <div className="admin-dashboard">

            <main className="admin-main">

                <div className="admin-dashboard-grid">

                    <div className="admin-main-content">

                        {/* HERO */}

                        <section className="admin-hero">

                            <div className="admin-hero-content">

                                <div>

                                    <h2>
                                        Welcome Back,
                                        {" "}
                                        {admin?.username ||
                                            "Administrator"}
                                        {" "}👋
                                    </h2>

                                    <p>
                                        {dashboard?.hero
                                            ?.message ||
                                            "Here's what's happening across SkillSwap today."}
                                    </p>

                                </div>

                                <div className="admin-local-time">

                                    <span>
                                        Current Local Time
                                    </span>

                                    <strong>
                                        {currentTime}
                                    </strong>

                                </div>

                            </div>

                        </section>

                        {/* KPI CARDS */}

                        <section className="admin-kpi-grid">

                            {kpis.map((kpi) => (

                                <KpiCard
                                    key={kpi.title}
                                    {...kpi}
                                />

                            ))}

                        </section>

                        {/* ANALYTICS */}

                        <section className="admin-analytics-grid">

                            <div className="admin-panel">

                                <div className="admin-panel-header">

                                    <h3>
                                        User Growth
                                    </h3>

                                    <select
                                        defaultValue="30"
                                        onChange={(e) => {
                                            // You can later refetch
                                            // analytics based on this.
                                            console.log(
                                                "Period:",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <option value="30">
                                            Last 30 Days
                                        </option>

                                        <option value="6">
                                            Last 6 Months
                                        </option>

                                    </select>

                                </div>

                                <div className="user-growth-chart">

                                    {(dashboard?.user_growth || [])
                                        .map((item, index) => (

                                            <div
                                                key={item.label}
                                                className={
                                                    index ===
                                                    (dashboard?.user_growth
                                                        ?.length || 1) - 1
                                                        ? "growth-bar highlighted"
                                                        : "growth-bar"
                                                }
                                                style={{
                                                    height: `${item.height}%`,
                                                }}
                                                title={`${item.label}: ${item.value}`}
                                            >
                                                {index === 0 && (
                                                    <span>
                                                        {item.value}
                                                    </span>
                                                )}
                                            </div>

                                        ))}

                                </div>

                                <div className="chart-labels">

                                    {(dashboard?.user_growth || [])
                                        .map((item) => (

                                            <span key={item.label}>
                                                {item.label}
                                            </span>

                                        ))}

                                </div>

                            </div>

                            <div className="admin-panel">

                                <div className="admin-panel-header">

                                    <h3>
                                        Session Volume
                                    </h3>

                                    <div className="chart-legend">

                                        <span>
                                            <i className="legend-dot primary" />
                                            Mentoring
                                        </span>

                                        <span>
                                            <i className="legend-dot secondary" />
                                            Networking
                                        </span>

                                    </div>

                                </div>

                                <SessionVolumeChart
                                data={dashboard?.session_volume||[]}/>

                            </div>

                        </section>

                        {/* RECENT SESSIONS */}

                        <section className="admin-lower-grid">

                            <RecentSessions
                                sessions={
                                    dashboard?.recent_sessions || []
                                }
                                onViewAll={() =>
                                    navigate(
                                        "/admin/session-management/"
                                    )
                                }
                            />

                        </section>

                    </div>

                    {/* RIGHT SIDEBAR */}

                    <aside className="admin-platform-status">

                        <PlatformStatus
                            status={
                                dashboard?.platform_status
                            }
                        />

                    </aside>

                </div>

            </main>

        </div>
    )
} 

export default AdminDashboard