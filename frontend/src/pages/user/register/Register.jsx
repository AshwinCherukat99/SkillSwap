import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/authSlice";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "./Register.css";

import { API_BASE_URL } from "../../../config";

function Register() {
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [fieldErrors,setFieldErrors]=useState({})
    const [fullName, setFullName] = useState("");
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


const handleGoogleRegister = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/google/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.message ||
                "Google registration failed."
            );
        }

        if (!data.tokens?.access) {
            throw new Error("Access token was not received.");
        }

        dispatch(
            login({
                user: data.user,
                accessToken: data.tokens.access,
                refreshToken: data.tokens.refresh,
            })
        );

        if (!localStorage.getItem("access_token")) {
            throw new Error("Login state was not saved.");
        }

        if (data.has_skills) {
            navigate("/feed/");
        } else {
            navigate("/skills/want/");
        }
    } catch (error) {
        console.error("Google registration error:", error);
        setError(error.message || "Unable to register with Google.");
    } finally {
        setLoading(false);
    }
};

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const passwordStrength =
        password.length === 0
            ? 0
            : password.length < 6
              ? 25
              : password.length < 10
                ? 60
                : 100;

    const passwordStrengthClass =
        passwordStrength <= 25
            ? "password-strength-error"
            : passwordStrength < 100
              ? "password-strength-medium"
              : "password-strength-good";

    const removeSkill = (
        skill,
        setSkills
    ) => {
        setSkills((previous) =>
            previous.filter(
                (item) => item !== skill
            )
        );
    };

    const addSkill = (
        setSkills,
        skill
    ) => {
        setSkills((previous) => {
            if (previous.includes(skill)) {
                return previous;
            }

            return [...previous, skill];
        });
    };

    const extractDjangoErrors = (data) => {
    const errors = {};

    if (!data) {
        return errors;
    }

    Object.keys(data).forEach((field) => {
        const value = data[field];

        if (Array.isArray(value)) {
            errors[field] = value[0];
        } else if (typeof value === "string") {
            errors[field] = value;
        }
    });

    return errors;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/register/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    full_name: fullName,
                    username: username,
                    email: email,
                    password: password,
                    password2: confirmPassword,
                    phone_number: phoneNumber,
                }),
            }
        );

        const data = await response.json();

        console.log("Registration response:", response.status, data);

        if (!response.ok) {
    console.error("Django registration error:", data);

    const djangoErrors = extractDjangoErrors(data);

    if (Object.keys(djangoErrors).length > 0) {
        setFieldErrors(djangoErrors);
    } else {
        setError(
            data.detail ||
            data.message ||
            JSON.stringify(data) ||
            "Registration failed. Please try again."
        );
    }

    return;
}

        console.log(data);

        // Registration succeeded.
        // Go to email verification page.
        navigate(`/verify-email/?email=${encodeURIComponent(email)}&purpose=registration`);

    } catch (error) {

        console.error(error);

        setError(
            error.message ||
            "Something went wrong during registration."
        );

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="register-page">

            {/* LEFT SECTION */}

            <section className="register-left">

                <div className="register-left-content">

                    <div className="register-illustration-wrapper">
                        <img
                            src="https://lh3.googleusercontent.com/aida/AP1WRLszcXv91m5_y2A-Ab9UA-U-PfeNloBv2hq52PU3LGLIYnVZbd3W7S5WNXFsYYFUlLL2JolQWiQd96Dztg1g-DudW0J8WUokCqmecFCuc_L_SpR8MbneCJAqegrHTH661ejOhqagzBmWVQ0Ol-MKLJcQ5Gc8zGCoxhb7gPacMDPK6B22R3ahTIdL5gyoERq-7zpDzYVobOuqd_g70vLh_EvbhDVohK0ye3o3qn-QONf6Km3YR8wO2poueY8"
                            alt="SkillSwap Community"
                        />
                    </div>

                    <div className="register-left-heading">
                        <h1>
                            Share Your Skills.
                            <br />
                            Discover New Ones.
                        </h1>

                        <p>
                            Join a community where everyone
                            is both a teacher and a learner.
                            Connect, collaborate, and grow
                            together in a world of shared
                            knowledge.
                        </p>
                    </div>

                    <div className="register-feature-grid">

                        <div className="register-feature-card">
                            <span className="material-symbols-outlined">
                                target
                            </span>

                            <h3>
                                Find Skill Partners
                            </h3>

                            <p>
                                Match with peers who possess
                                the skills you crave.
                            </p>
                        </div>

                        <div className="register-feature-card">
                            <span className="material-symbols-outlined">
                                menu_book
                            </span>

                            <h3>
                                Learn New Skills
                            </h3>

                            <p>
                                Access diverse knowledge
                                directly from practitioners.
                            </p>
                        </div>

                        <div className="register-feature-card">
                            <span className="material-symbols-outlined">
                                chat
                            </span>

                            <h3>
                                Real-Time Interaction
                            </h3>

                            <p>
                                Connect via built-in chat
                                and video conferencing.
                            </p>
                        </div>

                        <div className="register-feature-card">
                            <span className="material-symbols-outlined">
                                emoji_events
                            </span>

                            <h3>
                                Earn Reputation
                            </h3>

                            <p>
                                Build credibility through
                                community endorsements.
                            </p>
                        </div>

                    </div>
                </div>

                <div className="register-glow register-glow-top" />
                <div className="register-glow register-glow-bottom" />
            </section>

            {/* RIGHT SECTION */}

            <main className="register-right">

                <div className="register-form-container">

                    {/* MOBILE BRAND */}

                    <div className="register-mobile-brand">
                        <Link to="/">
                            SkillSwap
                        </Link>
                    </div>

                    {/* HEADER */}

                    <div className="register-header">

                        <div className="register-desktop-brand">
                            <Link to="/">
                                SkillSwap
                            </Link>
                        </div>

                        <h2>
                            Create Your Account
                        </h2>

                        <p>
                            Start your learning journey
                            today.
                        </p>
                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}

                        {/* PERSONAL INFORMATION */}

                        <div className="register-two-column">

                            <div className="register-field">
                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={
                                        fullName
                                    }
                                    onChange={
                                        (e)=>setFullName(e.target.value)
                                    }
                                    minLength={2}
                                    maxLength={150}
                                    pattern=".*[A-Za-z].*"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="register-field">
                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={
                                        username
                                    }
                                    onChange={
                                        (e)=>setUsername(e.target.value)
                                    }
                                    minLength={3}
                                    maxLength={30}  
                                    pattern="[A-Za-z][A-Za-z0-9_]{2,29}"
                                    placeholder="johndoe123"
                                    required
                                />
                            </div>

                        </div>

                        {/* EMAIL */}

                        <div className="register-field">
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={
                                    (e)=>setEmail(e.target.value)
                                }
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="phone_number">
                                Phone Number
                            </label>

                            <input
                                id="phone_number"
                                name="phone_number"
                                type="tel"
                                value={phoneNumber}
                                onChange={
                                    (e)=>setPhoneNumber(e.target.value)
                                }
                                pattern="[6-9][0-9]{9}"
                                maxLength={10}
                                placeholder="9999999999"
                                required
                            />
                        </div>

                        {/* PASSWORDS */}

                        <div className="register-two-column">

                            <div className="register-field">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            password
                                        }
                                        onChange={
                                            (e)=>setPassword(e.target.value)
                                        }
                                        minLength={8}
                                        maxLength={128}      
                                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,128}"
                                        placeholder="••••••••"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
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

                                <div className="password-strength">
                                    <div
                                        className={`password-strength-bar ${passwordStrengthClass}`}
                                        style={{
                                            width: `${passwordStrength}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="register-field">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={
                                            (e)=>setConfirmPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) =>
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
                            </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="register-actions">

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                            <div className="register-divider">
                                <span />
                                <p>
                                    Or continue with
                                </p>
                                <span />
                            </div>

                            <div className="register-social-buttons">

                                <div className="google-register-wrapper">
                                    <GoogleLogin 
                                    onSuccess={handleGoogleRegister}
                                    onError={()=>{
                                        alert('google registration failed')
                                    }}
                                    useOneTap={false}
                                    />
                                </div>
                            </div>

                            <p className="register-signin">
                                Already have an account?{" "}
                                <Link to="/login/">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Register;