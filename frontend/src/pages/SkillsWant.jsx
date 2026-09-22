import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillsWant.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function SkillsWant() {
    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH MASTER SKILL LIST
    // ==========================================

    useEffect(() => {
    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");
            const accessToken=localStorage.getItem('access_token')
            if (!accessToken){
                throw new Error('you are not authenticated')
            }
            const response = await fetch(
                "http://127.0.0.1:8000/api/skills/",
                {
                    method: "GET",
                    headers: {
                        Authorization:`Bearer ${accessToken}`
                    },
                }
            );

            const data = await response.json();

            console.log("Skills response:", response.status, data);

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to load skills."
                );
            }

            setSkills(data);
        } catch (err) {
            console.error("Skills fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchSkills();
}, []);

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
    setSelectedSkills((previous) => {
        if (previous.includes(skillId)) {
            return previous.filter(
                (id) => id !== skillId
            );
        }

        return [...previous, skillId];
    });
};

    // ==========================================
    // REMOVE SKILL
    // ==========================================

    const removeSkill = (skillId) => {
        setSelectedSkills((current) =>
            current.filter(
                (id) => id !== skillId
            )
        );
    };

    // ==========================================
    // SAVE WANT SKILLS
    // ==========================================

    const handleContinue = async () => {
    if (selectedSkills.size < 3) {
        setError("Please select at least 3 skills.");
        return;
    }

    try {
        setSaving(true);
        setError("");           
        const accessToken=localStorage.getItem('access_token')
        if (!accessToken){
            throw new Error(
                'authentication token not found'
            )
        }
        for (const skillId of selectedSkills) {
            const response = await fetch(
                `${API_BASE_URL}/api/skills/want/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        skill_id: skillId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    "Failed to save skill."
                );
            }
        }

        navigate("/skills/offer/");
    } catch (err) {
        console.error(err);
        setError(err.message);
    } finally {
        setSaving(false);
    }
};

    // ==========================================
    // SELECTED SKILL OBJECTS
    // ==========================================

    const selectedSkillObjects =
        skills.filter((skill) =>
            selectedSkills.includes(skill.id)
        );

    return (
        <div className="skills-page">

            {/* HEADER */}

            <header className="skills-header">

                <div className="skills-header-inner">

                    <div className="skills-logo">
                        SkillSwap
                    </div>

                    <div className="skills-progress">

                        <span>
                            Step 2 of 3
                        </span>

                        <div className="progress-track">
                            <div className="progress-fill" />
                        </div>

                    </div>

                </div>

            </header>

            <main className="skills-main">

                {/* INTRO */}

                <section className="skills-intro">

                    <div className="skills-intro-text">

                        <h1>
                            What would you like
                            to learn?
                        </h1>

                        <p>
                            Choose the skills you're
                            interested in. We'll
                            recommend mentors,
                            learners, and content
                            tailored just for you.
                        </p>

                    </div>

                    <div className="skills-intro-image">

                        <div className="image-glow" />

                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUQjsSirRkkVNbg_65LlAHNFCcwZdnrNtsLCr-jYTzMhLUUfuGMrRG556wICCpL_P3aP1uN3i6iSxhZNNv4j8-U_XxKmlOTm2t8dajlCHvcrOsv31_-SFZTk3QG6zDxdKRBWDUeAB2XJvRAPq4cr6PIJU_xvHUSmMjE5UOf_0sti1heridxifq6FqDsQQTHPrA6y_xTK5c2xFhadinMd_BofQhqfaKYoXXoBHQ7N-7zz9wmcrdsYPkBA"
                            alt="SkillSwap"
                        />

                    </div>

                </section>

                {/* SEARCH */}

                <div className="skill-search">

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
                    <div className="skills-error">
                        {error}
                    </div>
                )}

                {/* SELECTED */}

                {selectedSkillObjects.length >
                    0 && (

                    <section className="selected-section">

                        <div className="selected-heading">

                            <span>
                                SELECTED SKILLS
                            </span>

                            <span className="selected-count">
                                {
                                    selectedSkillObjects.length
                                }
                            </span>

                        </div>

                        <div className="selected-chips">

                            {selectedSkillObjects.map(
                                (skill) => (
                                    <button
                                        key={skill.id}
                                        className="selected-chip"
                                        type="button"
                                        onClick={() =>
                                            removeSkill(
                                                skill.id
                                            )
                                        }
                                    >
                                        {skill.name}

                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                )
                            )}

                        </div>

                    </section>
                )}

                {/* LOADING */}

                {loading ? (

                    <div className="skills-loading">
                        Loading skills...
                    </div>

                ) : (

                    <section className="category-grid">

                        <section className="skill-list">
    {filteredSkills.map((skill) => {
        const selected =
            selectedSkills.includes(skill.id);

        return (
            <button
                key={skill.id}
                type="button"
                className={
                    selected
                        ? "skill-chip selected"
                        : "skill-chip"
                }
                onClick={() =>
                    toggleSkill(skill.id)
                }
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
</section>

                    </section>
                )}

                {/* INFO */}

                <div className="skills-info">

                    <span className="material-symbols-outlined">
                        info
                    </span>

                    <p>
                        Based on your interests,
                        we'll recommend mentors
                        who excel in these fields
                        and community groups where
                        you can practice your new
                        skills.
                    </p>

                </div>

                {/* ACTIONS */}

                <div className="skills-actions">

                    <button
                        type="button"
                        className="skip-button"
                        onClick={() =>
                            navigate(
                                "/skills/offer/"
                            )
                        }
                    >
                        Skip for Now
                    </button>

                    <button
                        type="button"
                        className="continue-button"
                        disabled={
                            selectedSkills.length <
                                3 ||
                            saving
                        }
                        onClick={
                            handleContinue
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Continue"}
                    </button>

                </div>

            </main>

        </div>
    );
}

export default SkillsWant;