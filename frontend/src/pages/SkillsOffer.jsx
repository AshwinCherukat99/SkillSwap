import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillsOffer.css";

import { API_BASE_URL } from "../config";

function SkillsOffer() {
    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] =
        useState(new Set());

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH MASTER SKILL LIST
    // ==========================================

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const accessToken =
                localStorage.getItem("access_token")

            const response = await fetch(
                `${API_BASE_URL}/api/skills/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(accessToken
                            ? {
                                  Authorization:
                                      `Bearer ${accessToken}`,
                              }
                            : {}),
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Failed to load skills."
                );
            }

            setSkills(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to load skills."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredSkills = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return skills;
        }

        return skills.filter((skill) =>
            skill.name
                ?.toLowerCase()
                .includes(query)
        );
    }, [skills, search]);

    // ==========================================
    // TOGGLE SKILL
    // ==========================================

    const toggleSkill = (skillId) => {
        const numericId=Number(skillId)
        setSelectedSkills((current) => {
            const updated = new Set(current);

            if (updated.has(numericId)) {
                updated.delete(numericId);
            } else {
                updated.add(
                    numericId
                );
            }

            return updated;
        });
    };

    // ==========================================
    // REMOVE SKILL
    // ==========================================

    const removeSkill = (skillId) => {
        setSelectedSkills((current) => {
            const updated = new Set(current);

            updated.delete(skillId);

            return updated;
        });
    };

    // ==========================================
    // SELECTED SKILL OBJECTS
    // ==========================================

    const selectedSkillObjects = skills.filter(
        (skill) =>
            selectedSkills.has(Number(skill.id))
    );

    // ==========================================
    // SAVE OFFER SKILLS
    // ==========================================

    const handleFinish = async () => {
        if (selectedSkills.size === 0) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const accessToken=localStorage.getItem("access_token");

            if (!accessToken){
                throw new Error(
                    'authentication token not found'
                )
            }

            for (const skillId of selectedSkills) {
            const response = await fetch(
                `${API_BASE_URL}/api/skills/offer/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        skill_id: Number(skillId),
                    }),
                }
            );

            const data =
                await response.json();

            console.log('offer skill response:',response.status,data)

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    data.skill_id?.[0] ||
                        "Unable to save your skills."
                );
            }
        }
            navigate("/feed/");
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // SKIP
    // ==========================================

    const handleSkip = () => {
        navigate("/feed/");
    };

    return (
        <div className="skills-offer-page">

            {/* ==============================
                MAIN
            ============================== */}

            <main className="skills-offer-main">

                {/* PROGRESS */}

                <div className="offer-progress">

                    <div className="progress-step completed">

                        <span className="material-symbols-outlined">
                            check_circle
                        </span>

                        <span>
                            Registration
                        </span>

                    </div>

                    <div className="progress-line" />

                    <div className="progress-step completed">

                        <span className="material-symbols-outlined">
                            check_circle
                        </span>

                        <span>
                            Interests
                        </span>

                    </div>

                    <div className="progress-line" />

                    <div className="progress-step active">

                        <span className="step-number">
                            3
                        </span>

                        <span>
                            Teaching Skills
                        </span>

                    </div>

                </div>

                {/* PAGE GRID */}

                <div className="offer-layout">

                    {/* ==============================
                        LEFT COLUMN
                    ============================== */}

                    <div className="offer-content">

                        {/* HEADER */}

                        <header className="offer-header">

                            <div className="offer-image">

                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1KbyASJAbqptOl-M-FU4n1DzhVfp3N1YBlvJ61LuTqhhWC1dp1gxMYc13dGxY2uzuPKnpfqjs1wTk5vpVlijRnQKLeJjjs3D91opfoLyQliOGn2gOcI_h-oXyPVBDDgZBGoLeii1g05BNoM0VDDjHE7rUjQfriWB9RQvB5nM9JbAkprK90SagZtXXeS0myCU9KZ91_ETuMQJns0QWqweT9RCA7OJXjoYUEDkBKqjgCJtFyRAjtETgPg"
                                    alt="SkillSwap"
                                />

                            </div>

                            <div className="offer-heading">

                                <h1>
                                    What skills can
                                    you teach?
                                </h1>

                                <p>
                                    Everyone has
                                    something valuable
                                    to share. Select
                                    the skills you're
                                    confident teaching
                                    to help others
                                    grow in the
                                    SkillSwap
                                    community.
                                </p>

                            </div>

                        </header>

                        {/* SEARCH */}

                        <section className="offer-discovery">

                            <div className="offer-search">

                                <span className="material-symbols-outlined">
                                    search
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search for skills..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="offer-error">
                                    {error}
                                </div>
                            )}

                            {/* CATEGORIES */}

                            {loading ? (

                                <div className="offer-loading">
                                    Loading skills...
                                </div>

                            ) : (

                                <div className="offer-category-grid">

                                    <div className="offer-category-card">
    <h3>Skills</h3>

    <div className="offer-chip-list">
        {filteredSkills.map((skill) => {
            const selected = selectedSkills.has(skill.id);

            return (
                <button
                    type="button"
                    key={skill.id}
                    className={
                        selected
                            ? "offer-chip chip-active"
                            : "offer-chip"
                    }
                    onClick={() => toggleSkill(skill.id)}
                >
                    {skill.name}

                    {selected && (
                        <span className="material-symbols-outlined">
                            check
                        </span>
                    )}
                </button>
            );
        })}
    </div>
</div>

                                </div>
                            )}

                        </section>

                        {/* SELECTED SKILLS */}

                        {selectedSkillObjects.length >
                            0 && (

                            <section className="selected-offer-section">

                                <h2>
                                    Skills you'll teach
                                </h2>

                                <div className="selected-offer-grid">

                                    {selectedSkillObjects.length > 0 && (
    <section className="selected-offer-section">
        <h2>
            Skills you'll teach
        </h2>

        <div className="selected-offer-grid">
            {selectedSkillObjects.map((skill) => (
                <div
                    className="selected-offer-card"
                    key={skill.id}
                >
                    <span className="skill-name">
                        {skill.name}
                    </span>

                    <button
                        type="button"
                        className="remove-offer"
                        onClick={() =>
                            removeSkill(skill.id)
                        }
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>
            ))}
        </div>
    </section>
)}

                                </div>

                            </section>
                        )}

                    </div>

                    {/* ==============================
                        RIGHT SIDEBAR
                    ============================== */}

                    <aside className="offer-sidebar">

                        <div className="offer-sidebar-sticky">

                            {/* WHY SHARE */}

                            <div className="offer-info-card">

                                <div className="info-icon">

                                    <span className="material-symbols-outlined">
                                        auto_awesome
                                    </span>

                                </div>

                                <h4>
                                    Why share skills?
                                </h4>

                                <p>
                                    SkillSwap is built
                                    on mutual growth.
                                    Listing your
                                    teaching skills
                                    helps our algorithm
                                    match you with
                                    learners who can
                                    offer you the
                                    skills you're
                                    looking to acquire
                                    in return.
                                </p>

                            </div>

                            {/* MENTOR NOTICE */}

                            <div className="mentor-notice">

                                <div className="mentor-notice-inner">

                                    <span className="material-symbols-outlined">
                                        info
                                    </span>

                                    <div>

                                        <p>
                                            Mentor
                                            Application
                                        </p>

                                        <span>
                                            This information
                                            helps us build
                                            your profile.
                                            It is not an
                                            official mentor
                                            application. You
                                            can apply for
                                            verified mentor
                                            status later in
                                            your dashboard.
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="offer-actions">

                                <button
                                    type="button"
                                    className="finish-button"
                                    disabled={
                                        submitting ||
                                        selectedSkills.size === 0
                                    }
                                    onClick={
                                        handleFinish
                                    }
                                >
                                    {submitting
                                        ? "Saving..."
                                        : "Finish Setup"}
                                </button>

                                <button
                                    type="button"
                                    className="skip-offer-button"
                                    onClick={
                                        handleSkip
                                    }
                                >
                                    Skip for Now
                                </button>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

            {/* FOOTER */}

            <footer className="offer-footer">

                <div className="offer-footer-inner">

                    <div>

                        <span>
                            SkillSwap
                        </span>

                        <p>
                            © 2024 SkillSwap.
                            Elevate your potential.
                        </p>

                    </div>

                    <nav>

                        <a href="#">
                            Terms of Service
                        </a>

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Help Center
                        </a>

                    </nav>

                </div>

            </footer>

        </div>
    );
}

export default SkillsOffer;