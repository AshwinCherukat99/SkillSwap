import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams]=useSearchParams()
    const resetToken=searchParams.get('reset_token')

    const email =
        location.state?.email || "";

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const requirements = {
        length: password.length >= 8,

        case:
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password),

        number: /\d/.test(password),

        special:
            /[^A-Za-z0-9]/.test(password),
    };

    const strengthScore = Object.values(
        requirements
    ).filter(Boolean).length;

    const strengthLabels = [
        "Insecure",
        "Fair",
        "Strong",
        "Very Strong",
    ];

    const strengthLabel =
        strengthLabels[strengthScore - 1] ||
        "Insecure";

    const handleSubmit = async (event)=>{
        event.preventDefault()
        setError("")
        if (strengthScore<4){
            setError(
                'please create a password that satisfies all requirements'
            )
            return
        }
        if (password!=confirmPassword){
            setError('passwords do not match')
            return
        }
        setLoading(true)
        try{
            const response=await fetch("http://127.0.0.1:8000/api/auth/reset-password/",
                {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        reset_token:resetToken,
                        new_password:password,
                        confirm_password:confirmPassword,
                    }),
                }
            )
            const data=await response.json()
            console.log('password reset response:',response.status,data)
            if (!response.ok){
                throw new Error(data.error||
                data.detail||
                data.non_field_errors?.[0]||
                'unable to reset your password'
            )}
            navigate('/login/')
        }catch(err){
            console.error('password reset error:',err)
            setError(err.message||'unable to reset your password right now')
        }finally{
            setLoading(false)
        }
    }

    const getRequirementClass = (
        requirement
    ) => {
        return requirement
            ? "requirement valid"
            : "requirement";
    };

    return (
        <div className="reset-password-page">

            {/* LEFT SIDE */}

            <section className="reset-left">

                <div className="reset-mesh-glow" />

                <div className="reset-floating-icon reset-key-icon">
                    <div className="reset-glass-icon">
                        <span className="material-symbols-outlined">
                            key
                        </span>
                    </div>
                </div>

                <div className="reset-floating-icon reset-verified-icon">
                    <div className="reset-glass-icon">
                        <span className="material-symbols-outlined">
                            verified_user
                        </span>
                    </div>
                </div>

                <div className="reset-floating-icon reset-lock-icon">
                    <div className="reset-glass-icon">
                        <span className="material-symbols-outlined">
                            lock
                        </span>
                    </div>
                </div>

                <div className="reset-security-content">

                    <div className="reset-shield">
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontVariationSettings:
                                    "'FILL' 1",
                            }}
                        >
                            shield_with_heart
                        </span>
                    </div>

                    <h2>
                        Security First
                    </h2>

                    <p>
                        We use bank-grade encryption to ensure
                        your new password and account data remain
                        completely private.
                    </p>
                </div>

                <div className="reset-dot-pattern" />
            </section>

            {/* RIGHT SIDE */}

            <main className="reset-right">

                <nav className="reset-topbar">

                    <Link
                        to="/"
                        className="reset-brand"
                    >
                        SkillSwap
                    </Link>

                    <a href="#">
                        Support
                    </a>
                </nav>

                <div className="reset-card-wrapper">

                    <div className="reset-card">

                        <div className="reset-card-header">
                            <h1>
                                Create New Password
                            </h1>

                            <p>
                                Your identity is verified. Please
                                choose a strong, unique password
                                for your account.
                            </p>
                        </div>

                        {error && (
                            <div className="reset-error">
                                {error}
                            </div>
                        )}

                        <form
                            className="reset-form"
                            onSubmit={handleSubmit}
                        >

                            {/* NEW PASSWORD */}

                            <div className="reset-field">

                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <div className="reset-input-wrapper">

                                    <span className="material-symbols-outlined">
                                        lock
                                    </span>

                                    <input
                                        id="new-password"
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
                                                event.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="reset-password-toggle"
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
                            </div>

                            {/* STRENGTH */}

                            <div className="reset-strength">

                                <div className="strength-header">

                                    <span>
                                        Password Strength
                                    </span>

                                    <strong
                                        className={`strength-label strength-${strengthScore}`}
                                    >
                                        {
                                            strengthLabel
                                        }
                                    </strong>
                                </div>

                                <div className="strength-meter">

                                    {[0, 1, 2, 3].map(
                                        (index) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className={`strength-meter-segment ${
                                                    index <
                                                    strengthScore
                                                        ? `strength-active-${strengthScore}`
                                                        : ""
                                                }`}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* REQUIREMENTS */}

                            <div className="reset-requirements">

                                <ul>

                                    <li
                                        className={getRequirementClass(
                                            requirements.length
                                        )}
                                    >
                                        <span className="material-symbols-outlined">
                                            {
                                                requirements.length
                                                    ? "check_circle"
                                                    : "circle"
                                            }
                                        </span>

                                        At least 8 characters
                                    </li>

                                    <li
                                        className={getRequirementClass(
                                            requirements.case
                                        )}
                                    >
                                        <span className="material-symbols-outlined">
                                            {
                                                requirements.case
                                                    ? "check_circle"
                                                    : "circle"
                                            }
                                        </span>

                                        Upper & lower case
                                        letters
                                    </li>

                                    <li
                                        className={getRequirementClass(
                                            requirements.number
                                        )}
                                    >
                                        <span className="material-symbols-outlined">
                                            {
                                                requirements.number
                                                    ? "check_circle"
                                                    : "circle"
                                            }
                                        </span>

                                        At least one number
                                    </li>

                                    <li
                                        className={getRequirementClass(
                                            requirements.special
                                        )}
                                    >
                                        <span className="material-symbols-outlined">
                                            {
                                                requirements.special
                                                    ? "check_circle"
                                                    : "circle"
                                            }
                                        </span>

                                        One special character
                                        (!@#$%)
                                    </li>
                                </ul>
                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="reset-field">

                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <div
                                    className={`reset-input-wrapper ${
                                        confirmPassword &&
                                        password ===
                                            confirmPassword
                                            ? "password-match"
                                            : confirmPassword
                                              ? "password-mismatch"
                                              : ""
                                    }`}
                                >

                                    <span className="material-symbols-outlined">
                                        check_circle
                                    </span>

                                    <input
                                        id="confirm-password"
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
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="reset-password-toggle"
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

                                {confirmPassword &&
                                    password !==
                                        confirmPassword && (
                                        <p className="match-error">
                                            Passwords do not match
                                        </p>
                                    )}
                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="reset-submit-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Resetting..."
                                    : "Reset Password"}
                            </button>

                            {/* BACK TO LOGIN */}

                            <div className="reset-back-login">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/login/"
                                        )
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        arrow_back
                                    </span>

                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* FOOTER */}

                <footer className="reset-footer">

                    <p>
                        © 2024 SkillSwap. All rights
                        reserved.
                    </p>

                    <div>
                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Terms of Service
                        </a>

                        <a href="#">
                            Help Center
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default ResetPassword;