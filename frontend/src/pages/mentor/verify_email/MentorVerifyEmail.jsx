import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import "./MentorVerifyEmail.css";

function MentorVerifyEmail() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "";

    const purpose=searchParams.get('purpose')||'register'

    const isPasswordReset=purpose==='password-reset'

    const inputRefs = useRef([]);

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [timeLeft, setTimeLeft] = useState(298);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [verified, setVerified] =
        useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(
                (previous) =>
                    previous > 0
                        ? previous - 1
                        : 0
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const minutes = Math.floor(
            timeLeft / 60
        );

        const seconds = timeLeft % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleOtpChange = (
        index,
        value
    ) => {
        const numericValue =
            value.replace(/\D/g, "");

        if (!numericValue) {
            const updatedOtp = [...otp];
            updatedOtp[index] = "";
            setOtp(updatedOtp);

            return;
        }

        const updatedOtp = [...otp];

        const characters =
            numericValue.split("");

        characters.forEach(
            (character, offset) => {
                const targetIndex =
                    index + offset;

                if (
                    targetIndex <
                    updatedOtp.length
                ) {
                    updatedOtp[targetIndex] =
                        character;
                }
            }
        );

        setOtp(updatedOtp);

        const nextIndex = Math.min(
            index + characters.length,
            otp.length - 1
        );

        inputRefs.current[
            nextIndex
        ]?.focus();
    };

    const handleOtpKeyDown = (
        index,
        event
    ) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            inputRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index <
                otp.length - 1
        ) {
            inputRefs.current[
                index + 1
            ]?.focus();
        }
    };

    const handleVerify = async (event) => {
    event.preventDefault();

    const enteredOtp = otp.join("");

    setError("");

    if (!email) {
        setError(
            "Verification email is missing. Please register again."
        );
        return;
    }

    if (enteredOtp.length !== 6) {
        setError(
            "Please enter the complete 6-digit verification code."
        );
        return;
    }

    try {
        setLoading(true);

        let endpoint

        if (purpose==='password-reset'){
            endpoint="http://127.0.0.1:8000/api/mentors/verify-reset-otp/"
        }else{
            endpoint="http://127.0.0.1:8000/api/mentors/verify-email/"
        }

        const response = await fetch(
            endpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: enteredOtp,
                }),
            }
        );

        const data = await response.json();

        console.log(
            "Mentor OTP verification:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.detail ||
                "OTP verification failed."
            );
            return
        }

        setVerified(true);

        if (purpose==='password-reset'){
            const resetToken=data.reset_token
            if (!resetToken){
                setError(
                    'reset token was not received. please try again.'
                )
                return
            }
            navigate(
                `/mentor/reset-password/?email=${encodeURIComponent(
                    email
                )}&reset_token=${encodeURIComponent(
                    resetToken
                )}`
            )
            return 
        }

        if (!data.tokens?.access){
            setError(
                'authentication tokens were not received'
            )
            return
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
            "Mentor email verification error:",
            err
        );

        setError(
            err.message ||
            "Unable to verify your email right now."
        );
    } finally {
        setLoading(false);
    }
};

    const handleResend = async () => {
    if (timeLeft > 0) {
        return;
    }

    if (!email) {
        setError(
            "Verification email is missing."
        );
        return;
    }

    try {
        setError("");
        setLoading(true);

        const response = await fetch(
            "http://127.0.0.1:8000/api/mentors/resend-otp/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            }
        );

        const data = await response.json();

        console.log(
            "Mentor resend OTP:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.detail ||
                "Unable to resend OTP."
            );
        }

        // Clear old OTP
        setOtp([
            "",
            "",
            "",
            "",
            "",
            "",
        ]);

        // Restart countdown
        setTimeLeft(298);

        // Focus first OTP box
        inputRefs.current[0]?.focus();

    } catch (err) {
        console.error(
            "Mentor resend OTP error:",
            err
        );

        setError(
            err.message ||
            "Unable to resend the verification code."
        );
    } finally {
        setLoading(false);
    }
};

    const handleBackToRegistration = () => {
        navigate("/mentor/register/");
    };

    return (
        <div className="mentor-verify-page">

            <main className="mentor-verify-layout">

                {/* ======================================
                    LEFT SIDE
                ======================================= */}

                <section className="mentor-verify-left">

                    <div className="mentor-verify-decoration">
                        <div className="verify-decoration-one" />
                        <div className="verify-decoration-two" />
                    </div>

                    <div className="mentor-floating-icons">

                        <span className="material-symbols-outlined verify-float-mail">
                            mail
                        </span>

                        <span className="material-symbols-outlined verify-float-user">
                            verified_user
                        </span>

                        <span className="material-symbols-outlined verify-float-lock">
                            lock
                        </span>

                        <span className="material-symbols-outlined verify-float-check">
                            check_circle
                        </span>
                    </div>

                    <div className="mentor-verify-left-content">

                        <div className="mentor-verify-image-wrapper">

                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoTCpdyvWauFLeiyjCqRMqq3ATci4ARkqmkIZ7o9iyySKGdJk1k2PrvqUc4eHwdtxdI_E86Lprk-7_g0O2Y7lhg09vKUyG3iM3ej_827FzeHDJjF2_-A5n70hHdvVexzHjuMeXw_m9Ow_JxewJID3_NixJmGNcZMwQiiuvBUp0Xh2CsTldhbiMiH7kG7MfmGHclaESz-Kh7nDJkd_n10g6HUA8cMGPzTW6lU-h_MYiNvjTG0MOKCrYpQ"
                                alt="Mentor email verification"
                            />
                        </div>

                        <div className="mentor-verify-security-card">

                            <div className="mentor-verify-security-icon">
                                <span className="material-symbols-outlined">
                                    security
                                </span>
                            </div>

                            <p>
                                <strong>
                                    Secure Mentor
                                    Verification
                                </strong>{" "}
                                — Every mentor account
                                undergoes email verification
                                before entering the SkillSwap
                                verification process.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    RIGHT SIDE
                ======================================= */}

                <section className="mentor-verify-right">

                    <div className="mentor-verify-container">

                        {/* STEPPER */}

                        <div className="mentor-verify-stepper">

                            <div className="mentor-stepper-progress">

                                <div className="step completed">
                                    <span>
                                        ✓
                                    </span>
                                </div>

                                <div className="step-line completed" />

                                <div className="step active">
                                    2
                                </div>

                                <div className="step-line" />

                                <div className="step">
                                    3
                                </div>

                                <div className="step-line" />

                                <div className="step">
                                    4
                                </div>
                            </div>

                            <span>
                                STEP 02 OF 05
                            </span>
                        </div>

                        {/* CARD */}

                        <div className="mentor-verify-card">

                            {/* BRAND */}

                            <div className="mentor-verify-brand-section">

                                <Link
                                    to="/"
                                    className="mentor-verify-brand"
                                >
                                    <span className="material-symbols-outlined">
                                        dynamic_form
                                    </span>

                                    SkillSwap
                                </Link>

                                <span className="mentor-email-badge">
                                    <span className="material-symbols-outlined">
                                        mail
                                    </span>

                                    EMAIL VERIFICATION
                                </span>
                            </div>

                            {/* HEADER */}

                            <div className="mentor-verify-heading">

                                <h1>
                                    Verify Your Email
                                </h1>

                                <p>
                                    We've sent a 6-digit
                                    verification code to your
                                    registered email address.
                                    Enter the code below to
                                    continue your mentor
                                    registration.
                                </p>
                            </div>

                            {/* EMAIL */}

                            <div className="mentor-verify-email-box">

                                <span className="material-symbols-outlined">
                                    alternate_email
                                </span>

                                <span>
                                    Verification email sent
                                    to{" "}
                                    <strong>
                                        {email}
                                    </strong>
                                </span>
                            </div>

                            {error && (
                                <div className="mentor-verify-error">
                                    {error}
                                </div>
                            )}

                            {/* OTP FORM */}

                            <form
                                className="mentor-otp-form"
                                onSubmit={
                                    handleVerify
                                }
                            >

                                <div className="mentor-otp-grid">

                                    {otp.map(
                                        (
                                            value,
                                            index
                                        ) => (
                                            <input
                                                key={
                                                    index
                                                }
                                                ref={(
                                                    element
                                                ) => {
                                                    inputRefs.current[
                                                        index
                                                    ] =
                                                        element;
                                                }}
                                                className="mentor-otp-input"
                                                value={
                                                    value
                                                }
                                                maxLength={
                                                    1
                                                }
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                aria-label={`Verification digit ${
                                                    index +
                                                    1
                                                }`}
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleOtpChange(
                                                        index,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                onKeyDown={(
                                                    event
                                                ) =>
                                                    handleOtpKeyDown(
                                                        index,
                                                        event
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </div>

                                {/* TIMER */}

                                <div className="mentor-otp-controls">

                                    <div>
                                        <span className="material-symbols-outlined">
                                            timer
                                        </span>

                                        <span>
                                            Code expires
                                            in{" "}
                                            <strong>
                                                {formatTime()}
                                            </strong>
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            timeLeft >
                                            0
                                        }
                                        onClick={
                                            handleResend
                                        }
                                    >
                                        Didn't receive
                                        the code? Resend
                                        OTP
                                    </button>
                                </div>

                                {/* ACTIONS */}

                                <div className="mentor-verify-actions">

                                    <button
                                        type="submit"
                                        className={`mentor-verify-button ${
                                            verified
                                                ? "verified"
                                                : ""
                                        }`}
                                        disabled={
                                            loading ||
                                            verified
                                        }
                                    >
                                        {loading && (
                                            <span className="material-symbols-outlined mentor-spin">
                                                sync
                                            </span>
                                        )}

                                        {!loading &&
                                            verified && (
                                                <span className="material-symbols-outlined">
                                                    verified
                                                </span>
                                            )}

                                        {loading
                                            ? "Verifying..."
                                            : verified
                                              ? "Verified!"
                                              : "Verify Email"}
                                    </button>

                                    <button
                                        type="button"
                                        className="mentor-back-registration"
                                        onClick={
                                            handleBackToRegistration
                                        }
                                    >
                                        Back to Registration
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* SECURITY INFO */}

                        <div className="mentor-email-security">

                            <div className="mentor-security-icon">
                                <span className="material-symbols-outlined">
                                    shield_with_heart
                                </span>
                            </div>

                            <div>
                                <h4>
                                    Why Email Verification?
                                </h4>

                                <p>
                                    Protects your account from
                                    unauthorized access,
                                    prevents platform fraud,
                                    and confirms your
                                    institutional ownership.
                                </p>
                            </div>
                        </div>

                        {/* JOURNEY */}

                        <div className="mentor-verification-journey">

                            <div className="journey-item completed">
                                <span />
                                Registration Completed
                            </div>

                            <div className="journey-item current">
                                <span />
                                Email Verification
                            </div>

                            <div className="journey-item">
                                <span />
                                Certificate Review
                            </div>

                            <div className="journey-item">
                                <span />
                                Admin Approval
                            </div>

                            <div className="journey-item">
                                <span />
                                Mentor Studio Access
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default MentorVerifyEmail;