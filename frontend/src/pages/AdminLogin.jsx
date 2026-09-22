import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/admin/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );

        const data = await response.json();

        console.log(
            "Admin login response:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.non_field_errors?.[0] ||
                data.error ||
                "Invalid admin credentials."
            );
        }

        // Store admin authentication tokens
        localStorage.setItem(
            "admin_access_token",
            data.tokens.access
        );

        localStorage.setItem(
            "admin_refresh_token",
            data.tokens.refresh
        );

        // Store admin user information
        localStorage.setItem(
            "admin_user",
            JSON.stringify(data.user)
        );

        // Redirect to admin dashboard
        navigate("/admin/dashboard/");

    } catch (err) {
        console.error(
            "Admin login error:",
            err
        );

        setError(
            err.message ||
            "Unable to sign in. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="admin-login-page">

            <main className="admin-login-main">

                {/* =====================================
                    LEFT SIDE
                ====================================== */}

                <section className="admin-login-left">

                    <div className="admin-left-overlay" />

                    {/* Identity */}

                    <div className="admin-identity">
                        <h1>
                            SkillSwap
                        </h1>

                        <div className="admin-enterprise-badge">
                            <span className="material-symbols-outlined">
                                verified_user
                            </span>

                            <span>
                                Enterprise Core
                            </span>
                        </div>
                    </div>

                    {/* Illustration */}

                    <div className="admin-illustration-area">

                        <div className="admin-illustration-wrapper">

                            <div className="admin-illustration">
                                <div
                                    className="admin-illustration-image"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1fVAyH7YSpwcqskG6fUXTnVDHLYbzn1Aby4uomez6-yuJU6ot2y_16-ETMtzTbnw_r75vZ9C0WCKlLuZxOzsvTv6v7Ry_mnK8I47HV8m91-6BnvjJnEkHre0nlp6jmpRxFNrKB_mbMGVwNfirXZ8Soym2ufgVgYMSk9BGuEU25LrAj26RQThOE9N-2hVQfY--8pt4en-DCsmpZEEeSmnCdygcNcYz1_Ol4yml1cli6vYupp7P-ulQEQ')",
                                    }}
                                />
                            </div>

                            {/* Floating icons */}

                            <div className="admin-floating admin-chart">
                                <div className="admin-icon-glass">
                                    <span className="material-symbols-outlined">
                                        bar_chart
                                    </span>
                                </div>
                            </div>

                            <div className="admin-floating admin-shield">
                                <div className="admin-icon-glass green">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontVariationSettings:
                                                "'FILL' 1",
                                        }}
                                    >
                                        shield
                                    </span>
                                </div>
                            </div>

                            <div className="admin-floating admin-settings">
                                <div className="admin-icon-glass">
                                    <span className="material-symbols-outlined">
                                        settings
                                    </span>
                                </div>
                            </div>

                            <div className="admin-floating admin-lock">
                                <div className="admin-icon-glass dark">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontVariationSettings:
                                                "'FILL' 1",
                                        }}
                                    >
                                        lock
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}

                    <div className="admin-stats">

                        <div>
                            <p>
                                Global Uptime
                            </p>

                            <strong>
                                99.98%
                            </strong>
                        </div>

                        <div>
                            <p>
                                Threats Mitigated
                            </p>

                            <strong>
                                Real-time
                            </strong>
                        </div>
                    </div>
                </section>

                {/* =====================================
                    RIGHT SIDE
                ====================================== */}

                <section className="admin-login-right">

                    {/* Mobile branding */}

                    <div className="admin-mobile-brand">
                        SkillSwap
                    </div>

                    <div className="admin-login-container">

                        {/* Header */}

                        <div className="admin-page-heading">

                            <span className="admin-portal-badge">
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    security
                                </span>

                                🛡 ADMIN PORTAL
                            </span>

                            <h2>
                                Welcome Back,
                                Administrator
                            </h2>

                            <p>
                                Sign in to securely access the
                                SkillSwap Administration Dashboard
                                and manage the platform.
                            </p>
                        </div>

                        {/* Login form */}

                        <form
                            className="admin-login-form"
                            onSubmit={handleSubmit}
                        >

                            {error && (
                                <div className="admin-error">
                                    {error}
                                </div>
                            )}

                            {/* Email */}

                            <div className="admin-field">

                                <label htmlFor="admin-email">
                                    Email Address
                                </label>

                                <div className="admin-input-wrapper">

                                    <span className="material-symbols-outlined">
                                        mail
                                    </span>

                                    <input
                                        id="admin-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="admin@skillswap.enterprise"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}

                            <div className="admin-field">

                                <label htmlFor="admin-password">
                                    Master Password
                                </label>

                                <div className="admin-input-wrapper">

                                    <span className="material-symbols-outlined">
                                        lock
                                    </span>

                                    <input
                                        id="admin-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="••••••••••••"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="admin-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword
                                                ? "visibility_off"
                                                : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Options */}

                            <div className="admin-login-options">

                                <button
                                    type="button"
                                    className="admin-forgot"
                                    onClick={() =>
                                        console.log(
                                            "Admin password reset"
                                        )
                                    }
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login */}

                            <button
                                type="submit"
                                className="admin-login-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Authenticating..."
                                    : "Secure Admin Login"}

                                {!loading && (
                                    <span className="material-symbols-outlined">
                                        arrow_forward
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Enterprise security */}

                        <div className="enterprise-security-card">

                            <div className="enterprise-heading">

                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    shield
                                </span>

                                <h3>
                                    🛡 Enterprise Security
                                </h3>
                            </div>

                            <p>
                                All administrative actions are
                                encrypted using AES-256 standards.
                                Access is governed by granular
                                Role-Based Access Control (RBAC)
                                and audited in real-time for
                                compliance.
                            </p>

                            <div className="enterprise-feature-grid">

                                <div>
                                    <span className="material-symbols-outlined">
                                        key
                                    </span>

                                    <span>
                                        End-to-End Encryption
                                    </span>
                                </div>

                                <div>
                                    <span className="material-symbols-outlined">
                                        group
                                    </span>

                                    <span>
                                        Role-Based Access
                                    </span>
                                </div>

                                <div>
                                    <span className="material-symbols-outlined">
                                        bolt
                                    </span>

                                    <span>
                                        Secure Session
                                    </span>
                                </div>

                                <div>
                                    <span className="material-symbols-outlined">
                                        analytics
                                    </span>

                                    <span>
                                        Real-Time Monitoring
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Live indicators */}

                        <div className="admin-live-indicators">

                            <div>
                                <span className="admin-status-dot" />
                                Authentication: Operational
                            </div>

                            <div>
                                <span className="admin-status-dot" />
                                Database: Online
                            </div>

                            <div>
                                <span className="admin-status-dot" />
                                Security: Active
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <footer className="admin-footer">

                        <p>
                            © 2024 SkillSwap Enterprise.
                            All rights reserved.
                        </p>

                        <div>
                            <a href="#">
                                Security Policy
                            </a>

                            <span />
                            
                            <a href="#">
                                System Status
                            </a>

                            <span />

                            <strong>
                                v2.0.0
                            </strong>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}

export default AdminLogin;