import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import mentorApi from "../../../services/mentorApi";
import "./MentorDashboard.css";

function MentorDashboard() {
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("mentor_access_token");
        localStorage.removeItem("mentor_refresh_token");
        localStorage.removeItem("mentor");
        navigate("/mentor/login/", { replace: true });
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await mentorApi.get("/mentors/dashboard/");
                setMentor(response.data.mentor);
                setDashboard(response.data);
                setCourses(response.data.courses || []);
            } catch (err) {
                console.log("Failed to load mentor dashboard:", err);
                if (err.response?.status === 401) {
                    handleLogout();
                    return;
                }
                setError("Unable to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner mb-3" />
                <p className="text-muted fw-semibold">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger d-inline-block px-4 py-3">{error}</div>
            </div>
        );
    }

    const isVerified = mentor?.is_verified === true;

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

    const chartBars = [
        { label: "May", height: "60%", value: 120 },
        { label: "Jun", height: "75%", value: 145 },
        { label: "Jul", height: "65%", value: 132 },
        { label: "Aug", height: "85%", value: 168 },
        { label: "Sep", height: "95%", value: 190 },
        { label: "Oct", height: "80%", value: 178 },
    ];

    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        mentor?.full_name || "Mentor"
    )}&background=ffffff&color=4f46e5&size=128&bold=true`;

    return (
        <div className="mentor-dashboard gradient-mesh">
            <main className="main-content">
                <div className="content-container">

                    {/* COMPACT UNIFIED HERO CARD (NO WASTED BANNER SPACE) */}
                    <section className="hero-card mb-4">
                        <div className="hero-content">
                            <div className="profile-avatar-wrapper">
                                <img
                                    className="profile-avatar"
                                    src={mentor.profile_image || fallbackAvatar}
                                    alt={mentor.full_name}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = fallbackAvatar;
                                    }}
                                />
                                {isVerified && (
                                    <div className="verified-badge" title="Verified Mentor">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                )}
                            </div>

                            <div className="profile-info">
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                    <h1 className="profile-name mb-0">{mentor.full_name}</h1>
                                    {mentor.current_profession && (
                                        <span className="role-badge">
                                            {mentor.current_profession}
                                        </span>
                                    )}
                                </div>

                                <div className="profile-meta">
                                    <div className="tags">
                                        {courses.map((course) => (
                                            <span className="tag" key={course.slug}>
                                                #{course.slug}
                                            </span>
                                        ))}
                                        {courses.length === 0 && (
                                            <span className="tag empty">
                                                No published courses yet
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    className="btn-edit-profile d-flex align-items-center gap-2"
                                    onClick={() => navigate("/mentor/profile/")}
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                    <span>Edit Profile</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* KPI STATS ROW (PERFECT 4-COLUMN SYMMETRY) */}
                    {isVerified && (
                        <section className="kpi-grid mb-4">
                            <div className="kpi-card">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="kpi-icon material-symbols-outlined">group</span>
                                    <span className="kpi-change">+12%</span>
                                </div>
                                <p className="kpi-label">Total Students</p>
                                <h3 className="kpi-value">524</h3>
                            </div>

                            <div className="kpi-card">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="kpi-icon material-symbols-outlined">school</span>
                                </div>
                                <p className="kpi-label">Courses</p>
                                <h3 className="kpi-value">12</h3>
                            </div>

                            <div className="kpi-card">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="kpi-icon material-symbols-outlined">star</span>
                                    <span className="kpi-top">TOP</span>
                                </div>
                                <p className="kpi-label">Rating</p>
                                <h3 className="kpi-value">{Number(mentor.rating || 0).toFixed(2)}</h3>
                            </div>

                            <div className="kpi-card">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="kpi-icon material-symbols-outlined">forum</span>
                                </div>
                                <p className="kpi-label">Active Groups</p>
                                <h3 className="kpi-value">8</h3>
                            </div>
                        </section>
                    )}

                    {/* BALANCED 2-COLUMN MAIN GRID */}
                    <div className="main-grid">
                        
                        {/* LEFT COLUMN: ABOUT & ANALYTICS */}
                        <div className="content-stack">
                            {/* ABOUT ME */}
                            <div className="section-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h3 className="section-title mb-0">About Me</h3>
                                    <div className="social-icons">
                                        <button className="social-btn" title="Website">
                                            <span className="material-symbols-outlined">public</span>
                                        </button>
                                        <button className="social-btn" title="Code / Portfolio">
                                            <span className="material-symbols-outlined">terminal</span>
                                        </button>
                                    </div>
                                </div>

                                <p className="about-text mb-2">
                                    {mentor.professional_summary || "No professional summary added yet."}
                                </p>

                                {mentor.teaching_niche && (
                                    <p className="about-text text-secondary-custom fw-medium mb-3">
                                        Specialization: {mentor.teaching_niche}
                                    </p>
                                )}

                                <div className="d-flex flex-wrap gap-2 pt-2">
                                    <div className="contact-pill">
                                        <span className="material-symbols-outlined">link</span>
                                        <span>github.com/alexj-dev</span>
                                    </div>
                                    <div className="contact-pill">
                                        <span className="material-symbols-outlined">work</span>
                                        <span>portfolio.lumina.io/alex</span>
                                    </div>
                                </div>
                            </div>

                            {/* STUDENT GROWTH CHART */}
                            {isVerified && (
                                <div className="section-card chart-card">
                                    <div className="chart-header">
                                        <h3 className="section-title mb-0">Student Growth</h3>
                                        <select className="chart-select">
                                            <option>Last 6 Months</option>
                                            <option>Last Year</option>
                                        </select>
                                    </div>

                                    <div className="chart-area">
                                        {chartBars.map((bar) => (
                                            <div className="chart-bar-wrapper" key={bar.label}>
                                                <div className="chart-tooltip">{bar.value}</div>
                                                <div className="chart-bar" style={{ height: bar.height }} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="chart-labels">
                                        {chartBars.map((bar) => (
                                            <span key={bar.label}>{bar.label}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: QUICK ACTIONS + SESSIONS + HIGHLIGHTS (FILLS EMPTY SPACE) */}
                        <div className="content-stack">
                            {/* QUICK ACTIONS */}
                            {isVerified && (
                                <div className="section-card">
                                    <h3 className="section-title mb-3">Quick Actions</h3>
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="quick-action"
                                            onClick={() => navigate("/mentor/courses/create_course/")}
                                        >
                                            <div className="quick-icon primary">
                                                <span className="material-symbols-outlined">add_circle</span>
                                            </div>
                                            <div>
                                                <p className="quick-title">Create Course</p>
                                                <p className="quick-description">Publish new material or bootcamp</p>
                                            </div>
                                        </button>

                                        <button
                                            className="quick-action"
                                            onClick={() => navigate("/mentor/revenue/")}
                                        >
                                            <div className="quick-icon dark">
                                                <span className="material-symbols-outlined">account_balance_wallet</span>
                                            </div>
                                            <div>
                                                <p className="quick-title">View Revenue</p>
                                                <p className="quick-description">Check monthly earnings & payouts</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* UPCOMING SESSIONS (MOVED HERE TO EVEN OUT COLUMN HEIGHTS) */}
                            {isVerified && (
                                <div className="section-card">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h3 className="section-title mb-0">Upcoming Sessions</h3>
                                        <button className="btn btn-link text-primary-custom text-decoration-none fw-bold small p-0">
                                            Calendar
                                        </button>
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        {sessions.map((session) => (
                                            <div key={session.date} className="session-card">
                                                <div className={`date-box ${session.disabled ? "secondary-date" : ""}`}>
                                                    <span className="date-month">{session.month}</span>
                                                    <span className="date-number">{session.date}</span>
                                                </div>

                                                <div className="session-info min-w-0">
                                                    <h4 className="session-title text-truncate">{session.title}</h4>
                                                    <p className="session-meta mb-0 text-truncate">{session.meta}</p>
                                                </div>

                                                <button
                                                    className={`join-btn ${session.disabled ? "disabled" : ""}`}
                                                    disabled={session.disabled}
                                                >
                                                    Join
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default MentorDashboard;