import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {useDispatch} from 'react-redux'
import {login} from '../../../store/slices/authSlice'

import "./VerifyEmail.css";

import { API_BASE_URL } from "../../../config";

function VerifyEmail() {
    const dispatch=useDispatch()
    const navigate = useNavigate();

    const [searchParams]=useSearchParams()  
    const email=searchParams.get('email')||''
    const purpose=searchParams.get('purpose')||'register'
    
    const location = useLocation();

    const inputRefs = useRef([]);

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [timeLeft, setTimeLeft] = useState(299);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified,setVerified]=useState(false)

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previous) =>
                previous > 0 ? previous - 1 : 0
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const minutes = Math.floor(
            timeLeft / 60
        );

        const seconds = timeLeft % 60;

        return `${minutes
            .toString()
            .padStart(2, "0")}:${seconds
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

        /*
         * Handle pasted/multiple digits.
         */
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

        inputRefs.current[nextIndex]?.focus();
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
            index < otp.length - 1
        ) {
            inputRefs.current[
                index + 1
            ]?.focus();
        }
    };

const handleVerify = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
    }

    if (!email) {
        setError("Verification email was not found.");
        return;
    }

    try {
        setLoading(true);
        let endpoint
        if (purpose=='password-reset'){
            endpoint=`${API_BASE_URL}/auth/verify-reset-otp/`;
        }else{
            endpoint=`${API_BASE_URL}/auth/verify-otp/`;
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
                    otp: otpCode,
                }),
            }
        );

        const data = await response.json();

        console.log(
            "OTP verification response:",
            response.status,
            data
        );

        if (!response.ok) {
            setError(
                data.error ||
                data.detail ||
                data.message ||
                "OTP verification failed."
            );
            return;
        }

        setVerified(true)

        if (purpose=='password-reset'){
            const resetToken=data.reset_token
            if (!resetToken){
                setError('reset token was not received. please try again')
                return
            }
            navigate(
                `/reset-password/?email=${encodeURIComponent(email)}&reset_token=${encodeURIComponent(resetToken)}`
            )
            return
        }
        if (!data.tokens?.access){
            setError(
                'authentication tokens were not received'
            )
            return
        }
        dispatch(
            login({
                user:data.user,
                accessToken:data.tokens.access,
                refreshToken:data.tokens.refresh,
            })
        )
        navigate("/skills/want/");
    } catch (error) {
        console.error("OTP verification error:", error);
        setError("Unable to connect to the server.");
    } finally {
        setLoading(false);
    }
};

    const handleResendOtp = async () => {
        if (timeLeft > 0) { 
            return;
        }
        if (!email){
            setError(
                'verification email is missing'
            )
            return
        }
        
        try {
            setError("");
            setLoading(true)
            let endpoint
            if (purpose=='password-reset'){
                endpoint =
                `${API_BASE_URL}/auth/resend-reset-otp/`
            }else{
                endpoint =
                `${API_BASE_URL}/auth/resend-otp/`;
            }
            const response=await fetch(
                endpoint,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        email:email,
                    }),
                }
            )
            const data=await response.json()
            if (!response.ok){
                throw new Error(
                    data.error||
                    data.detail||
                    'unable to resend otp'
                )
            }

            setOtp([
                "",
                "",
                "",
                "",
                "",
                "",
            ]);

            setTimeLeft(298);

            inputRefs.current[0]?.focus();
        } catch (err) {
            console.error(
                "Resend OTP error:",
                err
            );

            setError(
                err.message||
                "Unable to resend the OTP right now."
            );
        }finally{
            setLoading(false)
        }
    };

    const handleBackToSignup = () => {
        navigate("/register/");
    };

    return (
        <div className="verify-page">

            {/* HEADER */}

            <header className="verify-header">
                <div className="verify-header-inner">

                    <Link
                        to="/"
                        className="verify-brand"
                    >
                        SkillSwap
                    </Link>

                    <div className="verify-header-links">
                        <a href="#">
                            Help Center
                        </a>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN */}

            <main className="verify-main">

                <div className="verify-content">

                    {/* LEFT SIDE */}

                    <section className="verify-left">

                        <div className="verify-illustration-wrapper">

                            <img
                                className="verify-illustration"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW6isYiWqp5GOrtTtXlY85-bQjEpKSvW7uKyQ0GzU-os498KmO2wP5ytvI3AU-mKo70kARq0SY5WeQndnwfZc1cgyj-bqwXJF0s5mrY2w9skUSuDpujF4wWTqm1mlgl5z3tCaYlWZKd3vbn6FR7C5w1Jd51icnrQkT5WL3sRK7d5AdvICglP6NKuOjUvegg-av-wlH6QpsLdhhBgynOBuCjWd3QjzyybYznNYcrWsxC4-n6zMPGpOe7Q"
                                alt="SkillSwap verification"
                            />

                            <div className="verified-platform-badge">
                                <span className="material-symbols-outlined">
                                    verified_user
                                </span>

                                Verified Platform
                            </div>
                        </div>

                        <div className="verify-intro">

                            <h1>
                                Almost There!
                            </h1>

                            <p>
                                Verify your email to unlock
                                SkillSwap and start connecting
                                with learners and mentors
                                around the world.
                            </p>
                        </div>

                        <div className="verify-feature-list">

                            <div className="verify-feature">
                                <span className="material-symbols-outlined primary">
                                    shield
                                </span>

                                <div>
                                    <h3>
                                        Secure Account
                                        Verification
                                    </h3>

                                    <p>
                                        Multi-factor
                                        authentication for your
                                        safety.
                                    </p>
                                </div>
                            </div>

                            <div className="verify-feature">
                                <span className="material-symbols-outlined secondary">
                                    group
                                </span>

                                <div>
                                    <h3>
                                        Protected Learning
                                        Community
                                    </h3>

                                    <p>
                                        Connect with real,
                                        verified professionals.
                                    </p>
                                </div>
                            </div>

                            <div className="verify-feature">
                                <span className="material-symbols-outlined tertiary">
                                    bolt
                                </span>

                                <div>
                                    <h3>
                                        Instant Access After
                                        Verification
                                    </h3>

                                    <p>
                                        Start your learning
                                        journey in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE */}

                    <section className="verify-right">

                        <div className="verify-card">

                            <div className="verify-card-header">

                                <h2>
                                    Verify Your Email
                                </h2>

                                <p>
                                    We've sent a 6-digit
                                    verification code to your
                                    email address:{" "}
                                    <strong>
                                        {email}
                                    </strong>
                                </p>

                                <button
                                    type="button"
                                    className="change-email-button"
                                    onClick={() =>
                                        navigate(
                                            "/register/"
                                        )
                                    }
                                >
                                    Change Email
                                </button>
                            </div>

                            {error && (
                                <div className="verify-error">
                                    {error}
                                </div>
                            )}

                            {/* OTP */}

<form className="flex flex-col gap-6" id='otp-form' onSubmit={handleVerify}>
                            <div className="otp-section">

                                <div className="otp-container">
                                    {otp.map(
                                        (
                                            value,
                                            index
                                        ) => (
                                            <input
                                                key={index}
                                                ref={(element) => {
                                                    inputRefs.current[
                                                        index
                                                    ] =
                                                        element;
                                                }}
                                                className="otp-input"
                                                value={value}
                                                inputMode="numeric"
                                                maxLength={1}
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
                                                onPaste={(event) => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (!digits) return;

    const updatedOtp = ["", "", "", "", "", ""];

    digits.split("").forEach((digit, index) => {
        updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
}}
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

                                <div className="otp-meta">

                                    <p className="otp-timer">
                                        <span className="material-symbols-outlined">
                                            schedule
                                        </span>

                                        Code expires in{" "}

                                        <span>
                                            {
                                                formatTime()
                                            }
                                        </span>
                                    </p>

                                    <p className="resend-text">
                                        Didn't receive
                                        the code?{" "}

                                        <button
                                            type="button"
                                            className={
                                                timeLeft ===
                                                0
                                                    ? "resend-button active"
                                                    : "resend-button"
                                            }
                                            disabled={
                                                timeLeft !==
                                                0
                                            }
                                            onClick={
                                                handleResendOtp
                                            }
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="verify-actions">

                                <button
                                    type="submit"
                                    className="verify-email-button"
                                    onClick={
                                        handleVerify
                                    }
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Verifying..."
                                        : "Verify Email"}
                                </button>

                                <button
                                    type="submit"
                                    className="back-signup-button"
                                    onClick={
                                        handleBackToSignup
                                    }
                                >
                                    Back to Sign Up
                                </button>
                            </div>
                            </form>

                            {/* SECURITY */}

                            <div className="verification-security">
                                <span className="material-symbols-outlined">
                                    lock
                                </span>

                                <span>
                                    Secure Verification -
                                    Your email is encrypted
                                    and protected.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* FOOTER */}

            <footer className="verify-footer">

                <div className="verify-footer-inner">

                    <div className="verify-footer-brand">
                        <div>
                            SkillSwap
                        </div>

                        <p>
                            © 2024 SkillSwap. All rights
                            reserved.
                        </p>
                    </div>

                    <div className="verify-footer-links">

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Terms of Service
                        </a>

                        <a href="#">
                            Help Center
                        </a>

                        <a href="#">
                            Contact Us
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default VerifyEmail;