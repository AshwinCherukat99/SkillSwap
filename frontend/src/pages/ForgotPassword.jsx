import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ForgotPassword.css";

import { API_BASE_URL } from "../config";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/forgot-password/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                }),
            }
        );

        const data = await response.json();

        console.log(
            "Forgot password response:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.error ||
                data.non_field_errors?.[0] ||
                "Unable to send verification code."
            );
        }

        navigate(
            `/verify-email/?email=${encodeURIComponent(
                email.trim().toLowerCase()
            )}&purpose=password-reset`
        );

    } catch (err) {
        console.error(
            "Forgot password error:",
            err
        );

        setError(
            err.message ||
            "Unable to send the verification code right now."
        );
    } finally {
        setLoading(false);
    }
};

    const handleResend = () => {
        console.log(
            "Resend verification code:",
            email
        );
    };

    return (
        <div className="forgot-password-page">

            <main className="forgot-password-main">

                {/* LEFT ILLUSTRATION */}

                <section className="forgot-password-left">

                    <div className="forgot-decor forgot-decor-one" />
                    <div className="forgot-decor forgot-decor-two" />

                    <div className="forgot-illustration-content">

                        <div className="forgot-security-visual">

                            <div className="forgot-security-card">
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    security
                                </span>
                            </div>

                            <div className="forgot-floating-icon forgot-lock">
                                <span className="material-symbols-outlined">
                                    lock
                                </span>
                            </div>

                            <div className="forgot-floating-icon forgot-verified">
                                <span className="material-symbols-outlined">
                                    verified_user
                                </span>
                            </div>

                            <div className="forgot-floating-icon forgot-mail">
                                <span className="material-symbols-outlined">
                                    mail
                                </span>
                            </div>
                        </div>

                        <h2>
                            Secure Authentication
                        </h2>

                        <p>
                            We use military-grade encryption
                            to ensure your account details and
                            password resets remain strictly
                            confidential.
                        </p>
                    </div>
                </section>

                {/* RIGHT FORM */}

                <section className="forgot-password-right">

                    <div className="forgot-password-container">

                        {/* HEADER */}

                        <div className="forgot-header">

                            <Link
                                to="/"
                                className="forgot-brand"
                            >
                                <span className="material-symbols-outlined">
                                    swap_calls
                                </span>

                                SkillSwap
                            </Link>
                        </div>

                        {/* CARD */}

                        <div className="forgot-card">

                            <div className="forgot-card-gradient" />

                            <div className="forgot-card-content">

                                <div className="forgot-card-heading">
                                    <h1>
                                        Forgot Password?
                                    </h1>

                                    <p>
                                        No worries! Enter your
                                        registered email address
                                        and we'll send you a
                                        verification code to reset
                                        your password.
                                    </p>
                                </div>

                                {/* SECURITY NOTICE */}

                                <div className="forgot-security-notice">

                                    <span className="material-symbols-outlined">
                                        info
                                    </span>

                                    <div>
                                        <p>
                                            Security Notice
                                        </p>

                                        <span>
                                            For your security,
                                            the verification
                                            code will expire in
                                            10 minutes.
                                        </span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="forgot-error">
                                        {error}
                                    </div>
                                )}

                                {/* FORM */}

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="forgot-form"
                                >

                                    <div className="forgot-email-field">

                                        <label htmlFor="forgot-email">
                                            Email Address
                                        </label>

                                        <div className="forgot-email-wrapper">

                                            <span className="material-symbols-outlined">
                                                mail
                                            </span>

                                            <input
                                                id="forgot-email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(
                                                    event
                                                ) =>
                                                    setEmail(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="forgot-submit-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="forgot-spinner" />
                                                <span>
                                                    Sending...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    Send
                                                    Verification
                                                    Code
                                                </span>

                                                <span className="material-symbols-outlined">
                                                    arrow_forward
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* LINKS */}

                                <div className="forgot-links">

                                    <div className="forgot-login-link">
                                        <span>
                                            Remember your
                                            password?
                                        </span>

                                        <Link to="/login/">
                                            Log In
                                        </Link>
                                    </div>

                                    <div className="forgot-back-link">
                                        <Link to="/login/">
                                            <span className="material-symbols-outlined">
                                                arrow_back
                                            </span>

                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HELP */}

                        <div className="forgot-help">
                            <p>
                                Didn't receive the email?
                                <br className="mobile-break" />
                                Check your spam folder or{" "}
                                <button
                                    type="button"
                                    onClick={
                                        handleResend
                                    }
                                >
                                    resend the code
                                </button>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ForgotPassword;