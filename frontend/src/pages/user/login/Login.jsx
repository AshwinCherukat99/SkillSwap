import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {useDispatch} from 'react-redux'
import {login} from '../../../store/slices/authSlice'

import "./Login.css";

import {API_BASE_URL} from '../../../config'

function Login() {
    const dispatch=useDispatch()
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));
            console.log('login response:',response.status,data)
            console.log('access token from response:',data.tokens?.access)
            console.log('refresh token from response:',data.tokens?.refresh)
            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        data.message ||
                        "Invalid email or password."
                );
            }

            if (!data.tokens?.access){
                throw new Error(
                    'access token was not received'
                )
            }

            dispatch(
                login({
                    user:data.user,
                    accessToken:data.tokens.access,
                    refreshToken:data.tokens.refresh,
                })
            )

            console.log('stored access token:',localStorage.getItem('access_token'))
            console.log('stored refresh token:',localStorage.getItem('refresh_token'))
            console.log('stored user:',localStorage.getItem('user'))
            navigate("/feed/");
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (
    credentialResponse
) => {
    setLoading(true);
    setError("");

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/google/`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    token:
                        credentialResponse.credential,
                }),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                    data.message ||
                    "Google login failed."
            );
        }

        console.log(
            "Google login response:",
            data
        );

        if (!data.tokens?.access){
            throw new Error(
                'access token was not received'
            )
        }

        dispatch(
            login({
                user:data.user,
                accessToken:data.tokens.access,
                refreshToken:data.tokens.refresh,
            })
        )
        if (data.has_skills){
            console.log('navigating to feed')
            navigate("/feed/");
        }else{
            console.log('navigating to skill selection')
            navigate('/skills/want/')
        }
    } catch (err) {
        console.error(
            "Google authentication error:",
            err
        );

        setError(
            err.message ||
                "Google login failed."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="login-page">

            {/* ==========================================
                DARK MODE
            =========================================== */}

            <main className="login-main">

                {/* ==========================================
                    LEFT SECTION
                =========================================== */}

                <section className="login-left">

                    <div className="login-left-brand">
                        <span>
                            SkillSwap
                        </span>
                    </div>

                    <div className="login-left-content">

                        <h1>
                            Learn. Teach.
                            <br />
                            Grow Together.
                        </h1>

                        <p>
                            Join a global community where
                            expertise is the currency.
                            Exchange your skills, bridge
                            knowledge gaps, and master new
                            crafts through direct
                            collaboration.
                        </p>

                        <div className="login-features">

                            <Feature
                                icon="group"
                                title="Find Skill Partners"
                                description="Connect with peers matching your desired learning path."
                                iconType="primary"
                            />

                            <Feature
                                icon="verified"
                                title="Learn from Experts"
                                description="Get hands-on mentorship from verified industry professionals."
                                iconType="secondary"
                            />

                            <Feature
                                icon="forum"
                                title="Real-Time Chat & Video"
                                description="Engage in seamless knowledge transfer sessions anywhere."
                                iconType="primary-container"
                            />

                        </div>

                    </div>

                    <div className="login-background-image">

                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFV7UddaGoRadQSi1yfWSa4DEC2b3ioLwJ1EjLvapF6hgp8RzFfIGYj-6pf5lPcV04IQO4tUkfsVU6plat6eRnfEaLwrbM04xHnTUGnj24pkhlynae75HAj2arHkFu8QXiiNMELcVi7Rw5Dcgzdu7MeYg1S4cSBl0bIHg71aB9KKH2_RytIr4iOSdPu1OAWZ3lP_8r3wSDnqQW3z5clAB36CQ3NncVWf5IK1tm7E6E4cb42OEeTgl5A"
                            alt="SkillSwap community"
                        />

                    </div>

                </section>

                {/* ==========================================
                    RIGHT SECTION
                =========================================== */}

                <section className="login-right">

                    <div className="mobile-brand">
                        SkillSwap
                    </div>

                    <div className="login-accent top" />
                    <div className="login-accent bottom" />

                    <div className="login-card">

                        {/* LOGO */}

                        <div className="login-card-header">

                            <div className="login-logo">

                                <span className="material-symbols-outlined">
                                    swap_calls
                                </span>

                            </div>

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue your
                                learning journey.
                            </p>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="login-error">
                                <span className="material-symbols-outlined">
                                    error
                                </span>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* FORM */}

                        <form
                            className="login-form"
                            onSubmit={handleLogin}
                        >

                            {/* EMAIL */}

                            <div className="floating-label-input">

                                <input
                                    id="email"
                                    type="email"
                                    placeholder=" "
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                />

                                <label htmlFor="email">
                                    Email Address
                                </label>

                            </div>

                            {/* PASSWORD */}

                            <div className="floating-label-input">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder=" "
                                    required
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                />

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="password-toggle"
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

                            {/* OPTIONS */}

                            <div className="login-options">

                                <Link
                                    to="/forgot-password/"
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            {/* SUBMIT */}

                            <button
                                className="login-submit"
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="loading-spinner" />

                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}

                            </button>

                        </form>

                        {/* DIVIDER */}

                        <div className="login-divider">

                            <span />

                            <p>
                                OR
                            </p>

                            <span />

                        </div>

                        {/* SOCIAL */}

                        <div className="social-buttons">

                            <div className="google-login-wrapper">
    <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => {
            setError(
                "Google login failed. Please try again."
            );
        }}
        useOneTap={false}
        size='large'
        width='350'
    />
</div>
                        </div>

                        {/* REGISTER */}

                        <div className="login-footer-text">

                            <p>
                                Don't have an account?
                            </p>

                            <Link to="/register/">
                                Create Account
                            </Link>

                        </div>

                    </div>

                    <div className="login-copyright">
                        © 2024 SkillSwap Platform
                    </div>

                </section>

            </main>

            <footer className="login-compliance-footer">

                <Link to="#">
                    Privacy Policy
                </Link>

                <Link to="#">
                    Terms of Service
                </Link>

                <Link to="#">
                    Help Center
                </Link>

            </footer>

        </div>
    );
}

/* ==========================================
   FEATURE
========================================== */

function Feature({
    icon,
    title,
    description,
    iconType,
}) {
    return (
        <div className="login-feature">

            <div
                className={`feature-icon ${iconType}`}
            >
                <span className="material-symbols-outlined">
                    {icon}
                </span>
            </div>

            <div>

                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>

            </div>

        </div>
    );
}

/* ==========================================
   GOOGLE ICON
========================================== */

function GoogleIcon() {
    return (
        <svg
            className="social-icon"
            viewBox="0 0 24 24"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />

            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />

            <path
                d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
            />

            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export default Login;