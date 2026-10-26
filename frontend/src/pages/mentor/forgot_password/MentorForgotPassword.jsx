import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./MentorForgotPassword.css"; 

import { API_BASE_URL } from "../../../config";

function MentorForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        const normalizedEmail=email.trim().toLowerCase()
        if (!normalizedEmail){
            setError('please enter your mentor email address')
            return
        }
        

        try {
            setLoading(true);

            const response = await fetch(
            `${API_BASE_URL}/mentors/forgot-password/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                }),
            }
        );

        const data=await response.json()

        console.log(
            "Mentor forgot password:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.detail ||
                data.message ||
                "Unable to send verification code."
            );
        }

        navigate(
            `/mentor/verify-email/?email=${encodeURIComponent(
                normalizedEmail
            )}&purpose=password-reset`
        );
        } catch (err) {
            console.error(
                "Mentor forgot-password error:",
                err
            );

            setError(
                "Unable to process your password recovery request right now."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/mentor/login/");
    };

    return (
        <div className="mentor-forgot-page">

            <main className="mentor-forgot-main">

                {/* ==========================================
                    LEFT SECTION
                =========================================== */}

                <section className="mentor-forgot-left">

                    <div className="mentor-forgot-header">
                        <div className="mentor-forgot-brand">
                            <span className="material-symbols-outlined">
                                shield_lock
                            </span>

                            <h1>
                                SkillSwap
                            </h1>
                        </div>
                    </div>

                    <div className="mentor-forgot-visual">

                        <div className="mentor-forgot-image-card">

                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxPCgMjUduhvfToxIyDJyj3_Wb--ToUsI84Hl31Z7TXhbqWwO5e6py6mUTa377fmKP2oIL3isqxv0nPIqOa6_0HNDD64QKmYa16Ii5sznt9x6l7YdtpY_15Ms_Fdgm8qmCQsYLbRT3SkkUsDtGUd44J52me0qzSv9G8KWPJc6mzvYtFpZ-5LK639ujuryF8Ovy51XVVotDrcAspjzhEaN0UtB7_ZYrc2fsi6Dsnbvnr2g2we4kuKz-bw"
                                alt="Mentor account security"
                            />
                        </div>

                        <div className="mentor-forgot-visual-copy">

                            <h2>
                                Advanced Protection
                                for Mentors
                            </h2>

                            <p>
                                Every account reset is protected
                                by multi-layered encryption to
                                ensure your expertise remains
                                secure.
                            </p>
                        </div>
                    </div>

                    <div className="mentor-recovery-card">

                        <span className="material-symbols-outlined">
                            verified_user
                        </span>

                        <p>
                            <strong>
                                🛡 Secure Account Recovery:
                            </strong>{" "}
                            We'll send a secure verification code
                            to your registered email address so you
                            can safely reset your mentor account
                            password.
                        </p>
                    </div>
                </section>

                {/* ==========================================
                    RIGHT SECTION
                =========================================== */}

                <section className="mentor-forgot-right">

                    <div className="mentor-forgot-container">

                        {/* MOBILE BRAND */}

                        <div className="mentor-mobile-security-icon">
                            <span className="material-symbols-outlined">
                                shield_lock
                            </span>
                        </div>

                        {/* HEADER */}

                        <div className="mentor-forgot-heading">

                            <span className="mentor-recovery-badge">
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    key
                                </span>

                                MENTOR PASSWORD RECOVERY
                            </span>

                            <h2>
                                Forgot Your Password?
                            </h2>

                            <p>
                                No worries! Enter your registered
                                mentor email address and we'll
                                send you a secure verification code
                                to reset your password.
                            </p>
                        </div>

                        {/* PROGRESS */}

                        <div className="mentor-recovery-progress">

                            <div className="mentor-progress-row">

                                <div className="mentor-progress-step active">
                                    1

                                    <span>
                                        Enter Email
                                    </span>
                                </div>

                                <div className="mentor-progress-line" />

                                <div className="mentor-progress-step">
                                    2

                                    <span>
                                        Verify OTP
                                    </span>
                                </div>

                                <div className="mentor-progress-line" />

                                <div className="mentor-progress-step">
                                    3

                                    <span>
                                        New Pass
                                    </span>
                                </div>

                                <div className="mentor-progress-line" />

                                <div className="mentor-progress-step">
                                    4

                                    <span>
                                        Success
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}

                        <form
                            className="mentor-forgot-form"
                            onSubmit={handleSubmit}
                        >

                            {error && (
                                <div className="mentor-forgot-error">
                                    {error}
                                </div>
                            )}

                            <div className="mentor-email-field">

                                <label htmlFor="mentor-email">
                                    Mentor Email Address
                                </label>

                                <div className="mentor-email-wrapper">

                                    <span className="material-symbols-outlined">
                                        mail
                                    </span>

                                    <input
                                        id="mentor-email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your registered mentor email"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <p className="mentor-email-help">
                                    <span className="material-symbols-outlined">
                                        info
                                    </span>

                                    Use the email address
                                    associated with your Mentor
                                    Studio account.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="mentor-send-code-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="mentor-spinner" />

                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Verification Code

                                        <span className="material-symbols-outlined">
                                            arrow_forward
                                        </span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="mentor-back-login-button"
                                onClick={
                                    handleBackToLogin
                                }
                            >
                                <span className="material-symbols-outlined">
                                    arrow_back
                                </span>

                                Back to Mentor Login
                            </button>
                        </form>

                        {/* SAFETY CARD */}

                        <div className="mentor-safety-card">

                            <div className="mentor-safety-heading">

                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified_user
                                </span>

                                <h3>
                                    Secure Password Recovery
                                </h3>
                            </div>

                            <ul>

                                <li>
                                    <span className="material-symbols-outlined">
                                        task_alt
                                    </span>

                                    Codes expire after
                                    10 minutes for your
                                    security.
                                </li>

                                <li>
                                    <span className="material-symbols-outlined">
                                        task_alt
                                    </span>

                                    Your new password must
                                    be at least 12 characters.
                                </li>

                                <li>
                                    <span className="material-symbols-outlined">
                                        task_alt
                                    </span>

                                    Two-factor authentication
                                    will still apply if
                                    enabled.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}

            <footer className="mentor-forgot-footer">

                <div className="mentor-footer-links">

                    <a href="#">
                        Privacy Policy
                    </a>

                    <a href="#">
                        Terms of Service
                    </a>

                    <a href="#">
                        Mentor Guidelines
                    </a>

                    <a href="#">
                        Help Center
                    </a>

                    <a href="#">
                        Support
                    </a>
                </div>

                <p>
                    © 2026 SkillSwap Professional Network.
                    All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default MentorForgotPassword;