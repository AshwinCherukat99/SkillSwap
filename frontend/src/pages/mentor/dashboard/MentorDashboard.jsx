import { Link,useNavigate } from "react-router-dom";
import {useEffect,useState} from 'react'
import mentorApi from "../../../services/mentorApi";
import "./MentorDashboard.css";

function MentorDashboard() {
    const navigate=useNavigate()
    const [mentor,setMentor]=useState(null)
    const [dashboard,setDashboard]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const handleLogout=()=>{
        localStorage.removeItem('mentor_access_token')
        localStorage.removeItem('mentor_refresh_token')
        localStorage.removeItem('mentor')
        navigate('/mentor/login/',{replace:true})
    }
    useEffect(()=>{
        const fetchDashboard=async ()=>{
            try{
                const response=await mentorApi.get('/mentors/dashboard/')
                setMentor(response.data.mentor)
                setDashboard(response.data)
            }catch(error){
                console.log('failed to load mentor dashboard:',error)
                if (error.response?.status===401){
                    handleLogout()
                    return
                }
                setError('unable to load dashboard')
            }finally{
                setLoading(false)
            }
        }
        fetchDashboard()
    },[])
    if (loading){
        return <div>loading dashboard</div>
    }
    if (error){
        return <div>{error}</div>
    }
    const isVerified=mentor?.is_verified===true
    const sessions = [
        {
            month: "Oct",
            date: "24",
            title: "Django Middleware Masterclass",
            meta: "14:00 - 15:30 (IST) • 12 Enrolled",
            disabled: false,
        },
        {
            month: "Oct",
            date: "26",
            title: "Microservices Architecture 101",
            meta: "10:00 - 11:30 (IST) • 45 Enrolled",
            disabled: true,
        },
    ];

    const achievements = [
        {
            icon: "csv",
            title: "Mentor of Month",
            type: "green",
        },
        {
            icon: "favorite",
            title: "Comm. Favorite",
            type: "primary",
        },
        {
            icon: "auto_stories",
            title: "Deep Author",
            type: "gray",
        },
        {
            icon: "psychology",
            title: "AI Pioneer",
            type: "gray",
        },
    ];

    const chartBars = [
        { label: "May", height: "60%", value: 120 },
        { label: "Jun", height: "75%", value: 145 },
        { label: "Jul", height: "65%", value: 132 },
        { label: "Aug", height: "85%", value: 168 },
        { label: "Sep", height: "95%", value: 190 },
        { label: "Oct", height: "80%", value: 178 },
    ];

    return (
        <div className="mentor-dashboard gradient-mesh">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div>
                    <h1 className="brand-title">
                        Lumina Mentor
                    </h1>

                    <p className="brand-subtitle">
                        Senior Instructor
                    </p>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/mentor/dashboard/"
                        className="nav-link active"
                    >
                        <span className="material-symbols-outlined">
                            dashboard
                        </span>
                        Dashboard
                    </Link>

                    <Link
                        to="/mentor/students/"
                        className="nav-link"
                    >
                        <span className="material-symbols-outlined">
                            group
                        </span>
                        Students
                    </Link>

                    <Link
                        to="/mentor/courses/"
                        className="nav-link"
                    >
                        <span className="material-symbols-outlined">
                            school
                        </span>
                        Courses
                    </Link>

                    <Link
                        to="/mentor/revenue/"
                        className="nav-link"
                    >
                        <span className="material-symbols-outlined">
                            payments
                        </span>
                        Revenue
                    </Link>

                    <Link
                        to="/mentor/group-chat/"
                        className="nav-link"
                    >
                        <span className="material-symbols-outlined">
                            forum
                        </span>
                        Study Group Chats
                    </Link>

                    <Link
                        to="/mentor/reviews/"
                        className="nav-link"
                    >
                        <span className="material-symbols-outlined">
                            star
                        </span>
                        Reviews
                    </Link>

                    <button
    type="button"
    className="nav-link logout-button"
    onClick={handleLogout}
>
    <span className="material-symbols-outlined">
        logout
    </span>
    Logout
</button>
                </nav>

            </aside>

            {/* TOP BAR */}
            <header className="topbar">
                <div className="search-wrapper">
                    <span className="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search students or courses..."
                    />
                </div>

                <div className="topbar-actions">
                    <button className="icon-btn">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>

                        <span className="notification-dot" />
                    </button>

                    <button className="icon-btn">
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </button>

                    <div className="topbar-divider" />

                    <button className="icon-btn">
                        <span className="material-symbols-outlined">
                            account_circle
                        </span>
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <main className="main-content">
                <div className="content-container">

                    {/* HERO */}
                    <section className="mb-5">
                        <div className="hero-cover">
                            <div className="hero-gradient" />
                        </div>

                        <div className="profile-hero-content d-flex flex-column flex-md-row align-items-end gap-4">
                            <div className="profile-avatar-wrapper">
                                <img
                                    className="profile-avatar"
                                    src={mentor.profile_image||'/default-mentor.png'}
                                    alt={mentor.full_name}
                                />

                                <div className="verified-badge">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontVariationSettings:
                                                "'FILL' 1",
                                        }}
                                    >
                                        verified
                                    </span>
                                </div>
                            </div>

                            <div className="profile-info">
                                <div className="d-flex flex-wrap align-items-center gap-3">
                                    <h2 className="profile-name">
                                        {mentor.full_name}
                                    </h2>

                                    <span className="role-badge">
                                        {mentor.current_profession}
                                    </span>
                                </div>

                                <div className="profile-meta">
                                    <div className="location">
                                        <span className="material-symbols-outlined">
                                            location_on
                                        </span>

                                        Bangalore, India
                                    </div>

                                    <div className="tags">
                                        <span className="tag">
                                            #python
                                        </span>

                                        <span className="tag">
                                            #django
                                        </span>

                                        <span className="tag">
                                            #rest-apis
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button className="btn-primary-custom d-flex align-items-center gap-2"
                                onClick={()=>navigate('/mentor/profile/')}>
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>

                                    Edit Profile
                                </button>

                                <button className="share-btn">
                                    <span className="material-symbols-outlined">
                                        share
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* KPI CARDS */}
                    {isVerified&&(<section className="kpi-grid mb-5">

                        <div className="glass kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="kpi-icon material-symbols-outlined">
                                    group
                                </span>

                                <span className="kpi-change">
                                    +12%
                                </span>
                            </div>

                            <p className="kpi-label">
                                Total Students
                            </p>

                            <h3 className="kpi-value">
                                524
                            </h3>
                        </div>

                        <div className="glass kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="kpi-icon material-symbols-outlined">
                                    school
                                </span>
                            </div>

                            <p className="kpi-label">
                                Courses
                            </p>

                            <h3 className="kpi-value">
                                12
                            </h3>
                        </div>

                        <div className="glass kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="kpi-icon material-symbols-outlined">
                                    star
                                </span>

                                <span className="kpi-top">
                                    TOP
                                </span>
                            </div>

                            <p className="kpi-label">
                                Rating
                            </p>

                            <h3 className="kpi-value">
                                {mentor.rating}
                            </h3>
                        </div>

                                                <div className="glass kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="kpi-icon material-symbols-outlined">
                                    forum
                                </span>
                            </div>

                            <p className="kpi-label">
                                Active Groups
                            </p>

                            <h3 className="kpi-value">
                                8
                            </h3>
                        </div>

                        <div className="glass kpi-card">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="kpi-icon material-symbols-outlined">
                                    verified_user
                                </span>
                            </div>

                            <p className="kpi-label">
                                Reputation
                            </p>

                            <h3 className="kpi-value">
                                98%
                            </h3>
                        </div>
                    </section>)}

                    {/* CONTENT GRID */}
                    <div className="main-grid">

                        {/* LEFT COLUMN */}
                        <div className="content-stack">

                            {/* ABOUT */}
                            <div className="glass section-card">
                                <div className="about-header">
                                    <h3 className="section-title mb-0">
                                        About Me
                                    </h3>

                                    <div className="social-icons">
                                        <button className="social-btn">
                                            <span className="material-symbols-outlined">
                                                public
                                            </span>
                                        </button>

                                        <button className="social-btn">
                                            <span className="material-symbols-outlined">
                                                terminal
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <p className="about-text mt-4">
                                    {mentor.professional_summary}
                                </p>

                                <p className="about-text mt-4">
                                    {mentor.teaching_niche}
                                </p>

                                <div className="d-flex flex-wrap gap-3">
                                    <div className="contact-pill">
                                        <span className="material-symbols-outlined">
                                            link
                                        </span>

                                        github.com/alexj-dev
                                    </div>

                                    <div className="contact-pill">
                                        <span className="material-symbols-outlined">
                                            work
                                        </span>

                                        portfolio.lumina.io/alex
                                    </div>
                                </div>
                            </div>

                            {/* SESSIONS */}
                            {isVerified&&(<div className="glass section-card">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h3 className="section-title mb-0">
                                        Upcoming Sessions
                                    </h3>

                                    <button className="btn btn-link text-primary-custom text-decoration-none fw-bold small">
                                        View Calendar
                                    </button>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.date}
                                            className="session-card"
                                        >
                                            <div
                                                className={`date-box ${
                                                    session.disabled
                                                        ? "secondary-date"
                                                        : ""
                                                }`}
                                            >
                                                <span className="date-month">
                                                    {session.month}
                                                </span>

                                                <span className="date-number">
                                                    {session.date}
                                                </span>
                                            </div>

                                            <div className="session-info">
                                                <h4 className="session-title">
                                                    {session.title}
                                                </h4>

                                                <p className="session-meta mb-0">
                                                    {session.meta}
                                                </p>
                                            </div>

                                            <button
                                                className={`join-btn ${
                                                    session.disabled
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                disabled={
                                                    session.disabled
                                                }
                                            >
                                                Join
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>)}

                            {/* STUDENT GROWTH */}
                            {isVerified&&(<div className="glass section-card chart-card">
                                <div className="chart-header">
                                    <h3 className="section-title mb-0">
                                        Student Growth
                                    </h3>

                                    <select className="chart-select">
                                        <option>
                                            Last 6 Months
                                        </option>

                                        <option>
                                            Last Year
                                        </option>
                                    </select>
                                </div>

                                <div className="chart-area">
                                    {chartBars.map((bar) => (
                                        <div
                                            className="chart-bar-wrapper"
                                            key={bar.label}
                                        >
                                            <div className="chart-tooltip">
                                                {bar.value}
                                            </div>

                                            <div
                                                className="chart-bar"
                                                style={{
                                                    height: bar.height,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="chart-labels">
                                    {chartBars.map((bar) => (
                                        <span key={bar.label}>
                                            {bar.label}
                                        </span>
                                    ))}
                                </div>
                            </div>)}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="content-stack">

                            {/* QUICK ACTIONS */}
                            {isVerified&&(<div className="d-flex flex-column gap-3">

                                <button className="quick-action">
                                    <div className="quick-icon primary">
                                        <span className="material-symbols-outlined">
                                            add_circle
                                        </span>
                                    </div>

                                    <div>
                                        <p className="quick-title">
                                            Create Course
                                        </p>

                                        <p className="quick-description">
                                            New material or bootcamp
                                        </p>
                                    </div>
                                </button>

                                                                <button className="quick-action">
                                    <div className="quick-icon dark">
                                        <span className="material-symbols-outlined">
                                            account_balance_wallet
                                        </span>
                                    </div>

                                    <div>
                                        <p className="quick-title">
                                            View Revenue
                                        </p>

                                        <p className="quick-description">
                                            Check monthly earnings
                                        </p>
                                    </div>
                                </button>
                            </div>)}


                            {/* ACHIEVEMENTS */}
                            {isVerified&&(<div className="glass section-card">
                                <h3 className="section-title">
                                    Achievements
                                </h3>

                                <div className="achievement-grid">
                                    {achievements.map(
                                        (achievement) => (
                                            <div
                                                className="achievement"
                                                key={
                                                    achievement.title
                                                }
                                            >
                                                <div
                                                    className={`achievement-icon ${achievement.type}`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {
                                                            achievement.icon
                                                        }
                                                    </span>
                                                </div>

                                                <p className="achievement-title">
                                                    {
                                                        achievement.title
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MentorDashboard;