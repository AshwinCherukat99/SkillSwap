import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "./MentorLogin.css";

function MentorLogin() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/mentors/login/",
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
            "Mentor login response:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.non_field_errors?.[0] ||
                data.error ||
                "Invalid mentor credentials."
            );
        }

        localStorage.setItem(
            "mentor_access_token",
            data.tokens.access
        );

        localStorage.setItem(
            "mentor_refresh_token",
            data.tokens.refresh
        );

        localStorage.setItem(
            "mentor",
            JSON.stringify(data.mentor)
        );

        navigate("/mentor/dashboard/");

    } catch (err) {
        console.error(
            "Mentor login error:",
            err
        );

        setError(
            err.message ||
            "Unable to login right now. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    const handleUserLogin = () => {
        navigate("/login/");
    };

    const handleApplyForMentorship = () => {
        navigate("/mentor/apply/");
    };

    const handleGoogleLogin = async (credentialResponse) => {
    setError("")
    setLoading(true)

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/mentors/google-login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            }
        )

        const data = await response.json()

        console.log(
            "Mentor Google login response:",
            response.status,
            data
        )

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.error ||
                "Google mentor login failed."
            )
        }

        localStorage.setItem(
            "mentor_access_token",
            data.tokens.access
        )

        localStorage.setItem(
            "mentor_refresh_token",
            data.tokens.refresh
        )

        localStorage.setItem(
            "mentor",
            JSON.stringify(data.mentor)
        )

        navigate("/mentor/dashboard/")

    } catch (error) {
        console.error(
            "Mentor Google login error:",
            error
        )

        setError(
            error.message ||
            "Unable to login with Google."
        )

    } finally {
        setLoading(false)
    }
}

    return (
        <main className="mentor-login-page">

            {/* LEFT BRANDING SECTION */}
            <section className="mentor-login-left">

                {/* Animated particles */}
                <div
                    className="particle-container"
                    aria-hidden="true"
                >
                    {Array.from({ length: 30 }).map(
                        (_, index) => (
                            <span
                                key={index}
                                className="particle"
                                style={{
                                    left: `${(index * 37) % 100}%`,
                                    top: `${(index * 61) % 100}%`,
                                    width: `${2 + (index % 5)}px`,
                                    height: `${2 + (index % 5)}px`,
                                    animationDelay: `${(
                                        index * 0.7
                                    ).toFixed(1)}s`,
                                    animationDuration: `${
                                        10 + (index % 10)
                                    }s`,
                                }}
                            />
                        )
                    )}
                </div>

                <div className="mentor-brand-content">

                    <span
                        className="floating-icon floating-icon-one material-symbols-outlined"
                        aria-hidden="true"
                    >
                        menu_book
                    </span>

                    <span
                        className="floating-icon floating-icon-two material-symbols-outlined"
                        aria-hidden="true"
                    >
                        military_tech
                    </span>

                    <span
                        className="floating-icon floating-icon-three material-symbols-outlined"
                        aria-hidden="true"
                    >
                        star
                    </span>

                    <img
                        className="mentor-illustration"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGM24SQgGe6V77MntDuQMuXN0EUOlqgabcc1LXE4YjDjdlOX7pKpmiZCyz_2hNRm0K13iHIl7oeuzJfoyY9y7w4ep84Q37k5n-nDoC2UWp5rr3HawFIfkHF0wsxuYah2WBHCbR4_c8dirnZM3tTRav02gu75iIz-XHGsIAQrbTBdiGCRIVjdnxassnBGD9ZEdrOFuXhPawny53EjLa0qCbKGS7NKuf9x3qx5O-r4Q6fkZVm3iJj1pIig"
                        alt="SkillSwap mentors"
                    />

                    <div className="mentor-brand-text">
                        <h2>
                            Elevate Potential
                        </h2>

                        <p>
                            Join our global community of experts
                            and help shape the next generation of
                            talent.
                        </p>
                    </div>
                </div>
            </section>

            {/* RIGHT AUTH SECTION */}
            <section className="mentor-login-right">

                <div className="mentor-login-container">

                    {/* HEADER */}
                    <div className="mentor-login-header">

                        <Link
                            to="/"
                            className="mentor-logo"
                        >
                            <div className="mentor-logo-icon">
                                <span className="material-symbols-outlined">
                                    sync_alt
                                </span>
                            </div>

                            <span>
                                SkillSwap
                            </span>
                        </Link>

                        <div className="mentor-studio-badge">
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontVariationSettings:
                                        "'FILL' 1",
                                }}
                            >
                                school
                            </span>

                            MENTOR STUDIO
                        </div>
                    </div>

                    {/* LOGIN CARD */}
                    <div className="mentor-login-card">

                        <header className="mentor-login-card-header">
                            <h1>
                                Welcome Back, Mentor
                            </h1>

                            <p>
                                Sign in to Mentor Studio and continue
                                inspiring learners around the world.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit}>

                            {/* ERROR */}
                            {error && (
                                <div className="mentor-login-error">
                                    {error}
                                </div>
                            )}

                            {/* EMAIL */}
                            <div className="mentor-form-group">

                                <label htmlFor="mentor-email">
                                    Email Address
                                </label>

                                <div className="mentor-input-wrapper">

                                    <span className="material-symbols-outlined">
                                        mail
                                    </span>

                                    <input
                                        id="mentor-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="mentor@skillswap.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="mentor-form-group">

                                <label htmlFor="mentor-password">
                                    Password
                                </label>

                                <div className="mentor-input-wrapper">

                                    <span className="material-symbols-outlined">
                                        lock
                                    </span>

                                    <input
                                        id="mentor-password"
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
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <span className="material-symbols-outlined">
                                            {
                                                showPassword
                                                    ? "visibility_off"
                                                    : "visibility"
                                            }
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* OPTIONS */}
                            <div className="mentor-login-options">

                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => navigate('/mentor/forgot-password/')}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* ACTIONS */}
                            <div className="mentor-login-actions">

                                <button
                                    type="submit"
                                    className="mentor-enter-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Signing In..."
                                        : "Enter Mentor Studio"}

                                    {!loading && (
                                        <span className="material-symbols-outlined">
                                            arrow_forward
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form> 
                        <div className="mentor-divider">
    <span>OR</span>
</div>

<div className="mentor-google-login">
    <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
            setError("Google login failed. Please try again.")
        }}
        useOneTap={false}
    />
</div>
                    </div>

                    {/* APPLY CALLOUT */}
                    <div className="mentor-apply-callout">

                        <div>
                            <h3>
                                Not a Verified Mentor Yet?
                            </h3>

                            <p>
                                Start your journey today.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                ()=>navigate('/mentor/register/')
                            }
                        >
                            Apply for Mentorship
                        </button>
                    </div>

                    {/* BENEFITS */}
                    <div className="mentor-benefits-grid">

                        <div className="mentor-benefit">
                            <span className="material-symbols-outlined">
                                groups
                            </span>

                            <h4>
                                Mentor Students
                            </h4>

                            <p>
                                Connect with 50k+ learners.
                            </p>
                        </div>

                        <div className="mentor-benefit">
                            <span className="material-symbols-outlined">
                                history_edu
                            </span>

                            <h4>
                                Create Courses
                            </h4>

                            <p>
                                Build your own curriculum.
                            </p>
                        </div>

                        <div className="mentor-benefit">
                            <span className="material-symbols-outlined">
                                workspace_premium
                            </span>

                            <h4>
                                Tips & Rewards
                            </h4>

                            <p>
                                Earn performance bonuses.
                            </p>
                        </div>

                        <div className="mentor-benefit">
                            <span className="material-symbols-outlined">
                                forum
                            </span>

                            <h4>
                                Study Groups
                            </h4>

                            <p>
                                Lead active discussions.
                            </p>
                        </div>
                    </div>

                    {/* SECURITY NOTICE */}
                    <div className="mentor-security-notice">

                        <div className="security-icon">
                            <span className="material-symbols-outlined">
                                verified_user
                            </span>
                        </div>

                        <div>
                            <p className="security-title">
                                Secure Mentor Access
                            </p>

                            <p className="security-text">
                                This workstation is protected by
                                256-bit encryption. Multi-factor
                                authentication may be required for
                                dashboard access.
                            </p>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="mentor-login-footer">

                        <div className="mentor-footer-links">
                            <Link to="#">
                                Privacy Policy
                            </Link>

                            <Link to="#">
                                Terms of Service
                            </Link>

                            <Link to="#">
                                Guidelines
                            </Link>

                            <Link to="#">
                                Support
                            </Link>
                        </div>

                        <p>
                            © 2024 SkillSwap Mentor Studio.
                            All rights reserved.
                        </p>
                    </footer>
                </div>
            </section>
        </main>
    );
}

export default MentorLogin;