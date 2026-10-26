import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import "./MentorResetPassword.css";

import { API_BASE_URL } from "../../../config";

function MentorResetPassword() {
    const navigate = useNavigate();
    const [searchParams]=useSearchParams()

    const email = searchParams.get('email')||''
    const resetToken=searchParams.get('reset_token')||''

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const requirements = useMemo(
        () => ({
            char: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            num: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        }),
        [password]
    );

    const score = Object.values(requirements).filter(Boolean).length;

    let strength = {
        label: "None",
        width: "0%",
        className: "strength-none",
    };

    if (password.length > 0) {
        if (score < 2) {
            strength = {
                label: "Weak",
                width: "25%",
                className: "strength-weak",
            };
        } else if (score < 4) {
            strength = {
                label: "Fair",
                width: "50%",
                className: "strength-fair",
            };
        } else if (score < 5) {
            strength = {
                label: "Good",
                width: "75%",
                className: "strength-good",
            };
        } else {
            strength = {
                label: "Strong",
                width: "100%",
                className: "strength-strong",
            };
        }
    }

    const passwordsMatch =
        confirmPassword.length > 0 &&
        password === confirmPassword;

    const passwordsMismatch =
        confirmPassword.length > 0 &&
        password !== confirmPassword;

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!email){
            setError(
                'Password reset email is missing. Please start the recovery process again.'
            )
        }

        if (!resetToken){
            setError(
                "Password reset session is invalid or expired. Please request a new OTP."
            )
        }

        if (score < 5) {
            setError(
                "Please satisfy all password requirements."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        try {
            setLoading(true);

            const response = await fetch(
            `${API_BASE_URL}/mentors/reset-password/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reset_token: resetToken,
                    new_password: password,
                    confirm_password: confirmPassword,
                }),
            }
        );

        const data = await response.json();

        console.log(
            "Mentor password reset:",
            response.status,
            data
        );    

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.detail ||
                data.message ||
                "Unable to reset password."
            );
        }

        navigate("/mentor/login/");

        } catch (err) {
            console.error(
                "Mentor password reset error:",
                err
            );

            setError(
                "Unable to update your password right now."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mentor-reset-page">

            <main className="mentor-reset-main">

                {/* =========================================
                    LEFT SIDE
                ========================================== */}

                <section className="mentor-reset-left">

                    <div className="mentor-reset-glow mentor-reset-glow-one" />
                    <div className="mentor-reset-glow mentor-reset-glow-two" />

                    <div className="mentor-reset-left-brand">
                        <span>SkillSwap</span>

                        <p>
                            Empowering Mentorship Connections
                        </p>
                    </div>

                    <div className="mentor-reset-left-illustration">

                        <div className="mentor-reset-floating">

                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGwVTEI0rLN_Tk5gHC-MOAfkHrm718nRP81mpOw3apK3S5ySNIRrMuCTtaV-yyfAYYqIGWm3Y_aZpOEjhUnP-yoRsUqxr6mnanzS3utu9TiWTTNwwsnrCte3n_CkKFmDln5WavL6WF03YJ71nsCEdpx_3lMDbp6X2z358DSEKBKARmCCguT6XGNewo6Vr6cCLwcbAMwbeOXaDNIXfvDOcETCTNO4K2A-th3hC2HI5vUx7caMR2zLMBIQ"
                                alt="Mentor account security"
                            />

                        </div>
                    </div>

                    <div className="mentor-reset-security-card">

                        <div className="mentor-reset-security-icon">
                            <span className="material-symbols-outlined">
                                verified_user
                            </span>
                        </div>

                        <div>
                            <h3>
                                Your Account Security Matters
                            </h3>

                            <p>
                                Create a strong password to keep
                                your Mentor Studio account,
                                students, and learning resources
                                secure. Our encrypted system
                                ensures your professional identity
                                remains protected.
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================================
                    RIGHT SIDE
                ========================================== */}

                <section className="mentor-reset-right">

                    <div className="mentor-reset-container">

                        {/* MOBILE BRAND */}

                        <div className="mentor-reset-mobile-brand">
                            SkillSwap
                        </div>

                        {/* HEADER */}

                        <div className="mentor-reset-heading">

                            <span className="mentor-reset-badge">
                                <span className="material-symbols-outlined">
                                    key
                                </span>

                                CREATE NEW PASSWORD
                            </span>

                            <h1>
                                Create a New Password
                            </h1>

                            <p>
                                Your identity has been verified.
                                Choose a strong password for your
                                Mentor Studio account.
                            </p>
                        </div>

                        {/* PROGRESS */}

                        <div className="mentor-reset-progress">

                            <div className="mentor-reset-progress-line" />

                            <div className="mentor-reset-step completed">
                                <div>
                                    <span className="material-symbols-outlined">
                                        check
                                    </span>
                                </div>

                                <span>
                                    Email
                                </span>
                            </div>

                            <div className="mentor-reset-step completed">
                                <div>
                                    <span className="material-symbols-outlined">
                                        check
                                    </span>
                                </div>

                                <span>
                                    OTP
                                </span>
                            </div>

                            <div className="mentor-reset-step active">
                                <div>
                                    <span className="material-symbols-outlined">
                                        key
                                    </span>
                                </div>

                                <span>
                                    New Pass
                                </span>
                            </div>

                            <div className="mentor-reset-step">
                                <div>
                                    <span className="material-symbols-outlined">
                                        done_all
                                    </span>
                                </div>

                                <span>
                                    Done
                                </span>
                            </div>
                        </div>

                        {/* FORM CARD */}

                        <div className="mentor-reset-card">

                            <form
                                onSubmit={handleSubmit}
                                className="mentor-reset-form"
                            >

                                {error && (
                                    <div className="mentor-reset-error">
                                        {error}
                                    </div>
                                )}

                                {/* NEW PASSWORD */}

                                <div className="mentor-reset-field">

                                    <label htmlFor="mentor-new-password">
                                        New Password
                                    </label>

                                    <div className="mentor-reset-input-wrapper">

                                        <span className="material-symbols-outlined">
                                            lock
                                        </span>

                                        <input
                                            id="mentor-new-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                password
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="••••••••••••"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (
                                                        previous
                                                    ) =>
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

                                    {/* STRENGTH */}

                                    <div className="mentor-strength">

                                        <div className="mentor-strength-header">

                                            <span>
                                                Strength
                                            </span>

                                            <strong
                                                className={
                                                    strength.className
                                                }
                                            >
                                                {
                                                    strength.label
                                                }
                                            </strong>
                                        </div>

                                        <div className="mentor-strength-track">
                                            <div
                                                className={
                                                    `mentor-strength-bar ${strength.className}`
                                                }
                                                style={{
                                                    width:
                                                        strength.width,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* REQUIREMENTS */}

                                <div className="mentor-requirements">

                                    <p>
                                        Requirements
                                    </p>

                                    <div className="mentor-requirement-grid">

                                        <Requirement
                                            valid={
                                                requirements.char
                                            }
                                            text="8+ Characters"
                                        />

                                        <Requirement
                                            valid={
                                                requirements.upper
                                            }
                                            text="Uppercase Letter"
                                        />

                                        <Requirement
                                            valid={
                                                requirements.lower
                                            }
                                            text="Lowercase Letter"
                                        />

                                        <Requirement
                                            valid={
                                                requirements.num
                                            }
                                            text="Number (0-9)"
                                        />

                                        <Requirement
                                            valid={
                                                requirements.special
                                            }
                                            text="Special Character"
                                        />
                                    </div>
                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="mentor-reset-field">

                                    <label htmlFor="mentor-confirm-password">
                                        Confirm New Password
                                    </label>

                                    <div
                                        className={
                                            `mentor-reset-input-wrapper ${
                                                passwordsMatch
                                                    ? "match"
                                                    : ""
                                            } ${
                                                passwordsMismatch
                                                    ? "mismatch"
                                                    : ""
                                            }`
                                        }
                                    >

                                        <span className="material-symbols-outlined">
                                            lock
                                        </span>

                                        <input
                                            id="mentor-confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setConfirmPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="••••••••••••"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (
                                                        previous
                                                    ) =>
                                                        !previous
                                                )
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                {showConfirmPassword
                                                    ? "visibility_off"
                                                    : "visibility"}
                                            </span>
                                        </button>
                                    </div>

                                    {passwordsMatch && (
                                        <div className="mentor-match-status success">
                                            ✓ Passwords Match
                                        </div>
                                    )}

                                    {passwordsMismatch && (
                                        <div className="mentor-match-status error">
                                            ✕ Passwords Do Not Match
                                        </div>
                                    )}
                                </div>

                                {/* SAFETY TIPS */}

                                <div className="mentor-password-tips">

                                    <div className="mentor-tip-icon">
                                        <span className="material-symbols-outlined">
                                            lightbulb
                                        </span>
                                    </div>

                                    <div>
                                        <h4>
                                            Pro Safety Tips
                                        </h4>

                                        <ul>
                                            <li>
                                                Avoid using
                                                common words or
                                                birthdays
                                            </li>

                                            <li>
                                                Use a unique
                                                password manager
                                                for vaulting
                                            </li>

                                            <li>
                                                Don't reuse
                                                passwords from
                                                other platforms
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* ACTIONS */}

                                <div className="mentor-reset-actions">

                                    <button
                                        type="submit"
                                        className="mentor-update-password"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update Password"}

                                        {!loading && (
                                            <span className="material-symbols-outlined">
                                                arrow_forward
                                            </span>
                                        )}
                                    </button>

                                    <Link
                                        to="/mentor/login/"
                                        className="mentor-back-login"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* FOOTER INFO */}

                        <p className="mentor-reset-footer">
                            © 2024 SkillSwap Mentor Portal.
                            All rights reserved.
                            <br />

                            <a href="#">
                                Security Policy
                            </a>

                            {" • "}

                            <a href="#">
                                Help Center
                            </a>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

function Requirement({
    valid,
    text,
}) {
    return (
        <div
            className={`mentor-requirement ${
                valid ? "valid" : ""
            }`}
        >
            <span className="material-symbols-outlined">
                {valid
                    ? "check_circle"
                    : "circle"}
            </span>

            <span>
                {text}
            </span>
        </div>
    );
}

export default MentorResetPassword;