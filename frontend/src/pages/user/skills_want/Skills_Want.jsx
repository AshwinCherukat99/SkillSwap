import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

import './Skills_Want.css'

function Skills_Want(){
    const navigate=useNavigate()
    const [wantSkills, setWantSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [addingSkillId, setAddingSkillId] = useState(null);
    const [removingSkillId, setRemovingSkillId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    // --------------------------------
    // Normalize API response
    // --------------------------------
    const normalizeData = (data) => {
        if (Array.isArray(data)) {
            return data;
        }

        if (data?.results) {
            return data.results;
        }

        return [];
    };

    // --------------------------------
    // Get skill name
    // --------------------------------
    const getSkillName = (item) => {
        if (!item) {
            return "";
        }

        if (typeof item.skill === "object") {
            return item.skill?.name || "";
        }

        return (
            item.skill_name ||
            item.name ||
            "Unnamed skill"
        );
    };

    // --------------------------------
    // Get skill ID
    // --------------------------------
    const getSkillId = (item) => {
        if (!item) {
            return null;
        }

        if (typeof item.skill === "object") {
            return item.skill?.id;
        }

        return item.skill;
    };

    // --------------------------------
    // Load skills
    // --------------------------------
    const loadSkills = async () => {
        const accessToken =
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token");

        if (!accessToken) {
            navigate("/login/");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [wantResponse, allSkillsResponse] =
                await Promise.all([
                    api.get("/skills/want/"),
                    api.get("/skills/"),
                ]);

            console.log(
                "want skills:",
                wantResponse.status,
                wantResponse.data
            );

            console.log(
                "all skills:",
                allSkillsResponse.status,
                allSkillsResponse.data
            );

            setWantSkills(
                normalizeData(wantResponse.data)
            );

            setAllSkills(
                normalizeData(allSkillsResponse.data)
            );

        } catch (err) {
            console.error(
                "skills loading error:",
                err
            );

            if (err.response?.status === 401) {
                navigate("/login/");
                return;
            }

            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Unable to load skills"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);

    // --------------------------------
    // Add wanted skill
    // --------------------------------
    const handleAddSkill = async (skillId) => {
        try {
            setAddingSkillId(skillId);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/skills/want/",
                {
                    skill_id: skillId,
                }
            );

            console.log(
                "add wanted skill response:",
                response.status,
                response.data
            );

            setSuccess(
                "Skill added successfully"
            );

            await loadSkills();

        } catch (err) {
            console.error(
                "add skill error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                err.response?.data?.skill?.[0] ||
                "Unable to add skill"
            );

        } finally {
            setAddingSkillId(null);
        }
    };

    // --------------------------------
    // Remove wanted skill
    // --------------------------------
    const handleRemoveSkill = async (skillId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this skill?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingSkillId(skillId);
            setError("");
            setSuccess("");

            console.log(
                "Skill id being removed:",
                skillId
            );

            await api.delete(
                `/skills/want/${skillId}/`
            );

            setSuccess(
                "Skill removed successfully"
            );

            setWantSkills((currentSkills) =>
                currentSkills.filter(
                    (item) =>
                        getSkillId(item) !== skillId
                )
            );

        } catch (err) {
            console.error(
                "remove skill error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Unable to remove skill"
            );

        } finally {
            setRemovingSkillId(null);
        }
    };

    // --------------------------------
    // Already wanted skill IDs
    // --------------------------------
    const wantedSkillIds = new Set(
        wantSkills.map(
            (item) => getSkillId(item)
        )
    );

    // --------------------------------
    // Skills available to add
    // --------------------------------
    const availableSkills = allSkills.filter(
        (skill) =>
            !wantedSkillIds.has(skill.id)
    );

    // --------------------------------
    // Search user's wanted skills
    // --------------------------------
    const filteredWantSkills =
        wantSkills.filter((item) =>
            getSkillName(item)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    // --------------------------------
    // Search available skills
    // --------------------------------
    const filteredAvailableSkills =
        availableSkills.filter((skill) =>
            skill.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    // --------------------------------
    // Loading
    // --------------------------------
    if (loading) {
        return (
            <div className="skills-want-page d-flex justify-content-center align-items-center">
                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-muted">
                        Loading your learning skills...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="skills-want-page">

            <div className="container py-5">

                {/* HEADER */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                    <div>

                        <h1 className="skills-page-title">
                            Skills I Want
                        </h1>

                        <p className="skills-page-subtitle mb-0">
                            Manage the skills you want to
                            learn from other users.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary skills-back-btn"
                        onClick={() =>
                            navigate("/my_skills/")
                        }
                    >
                        <i className="bi bi-arrow-left me-2" />

                        Back to My Skills

                    </button>

                </div>


                {/* ALERTS */}

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {success}
                    </div>
                )}


                {/* SEARCH */}

                <div className="skills-search-wrapper mb-5">

                    <i className="bi bi-search skills-search-icon" />

                    <input
                        type="text"
                        className="form-control skills-search-input"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* MY WANTED SKILLS */}

                <section className="mb-5">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Skills I Want to Learn
                            </h2>

                            <p>
                                Skills you are currently
                                looking to learn from others.
                            </p>

                        </div>

                        <span className="skills-count-badge">
                            {wantSkills.length} Skills
                        </span>

                    </div>


                    {filteredWantSkills.length === 0 ? (

                        <div className="empty-skills-card">

                            <i className="bi bi-mortarboard fs-1 mb-3" />

                            <h4>
                                No learning skills found
                            </h4>

                            <p className="mb-0">
                                Add skills from the available
                                skill list below.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {filteredWantSkills.map(
                                (item) => {

                                    const skillId =
                                        getSkillId(item);

                                    return (
                                        <div
                                            className="col-md-6 col-xl-4"
                                            key={item.id}
                                        >

                                            <div className="card skill-card h-100">

                                                <div className="card-body d-flex flex-column">

                                                    <div className="d-flex align-items-center gap-3 mb-4">

                                                        <div className="skill-icon">
                                                            <i className="bi bi-book" />
                                                        </div>

                                                        <div>

                                                            <h4 className="mb-1">
                                                                {getSkillName(item)}
                                                            </h4>

                                                            <span className="text-muted small">
                                                                Learning Skill
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="mt-auto">

                                                        <button
                                                            type="button"
                                                            className="btn remove-skill-btn w-100"
                                                            disabled={
                                                                removingSkillId ===
                                                                skillId
                                                            }
                                                            onClick={() =>
                                                                handleRemoveSkill(
                                                                    skillId
                                                                )
                                                            }
                                                        >

                                                            {removingSkillId ===
                                                            skillId ? (

                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" />

                                                                    Removing...
                                                                </>

                                                            ) : (

                                                                <>
                                                                    <i className="bi bi-trash me-2" />

                                                                    Remove Skill
                                                                </>

                                                            )}

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </section>


                {/* AVAILABLE SKILLS */}

                <section className="master-skills-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Add New Skills
                            </h2>

                            <p>
                                Choose from the available
                                skills and add them to your
                                learning profile.
                            </p>

                        </div>

                    </div>


                    {filteredAvailableSkills.length === 0 ? (

                        <div className="empty-skills-card">

                            <i className="bi bi-check-circle fs-1 mb-3" />

                            <h4>
                                No more skills available
                            </h4>

                            <p className="mb-0">
                                You have already added all
                                currently available skills.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {filteredAvailableSkills.map(
                                (skill) => (

                                    <div
                                        className="col-md-6 col-xl-4"
                                        key={skill.id}
                                    >

                                        <div className="card available-skill-card h-100">

                                            <div className="card-body d-flex flex-column">

                                                <div className="d-flex align-items-center gap-3">

                                                    <div className="available-skill-icon">

                                                        <i className="bi bi-plus-lg" />

                                                    </div>

                                                    <div>

                                                        <h5 className="mb-1">
                                                            {skill.name}
                                                        </h5>

                                                        <small className="text-muted">
                                                            Available to add
                                                        </small>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="btn add-skill-btn w-100 mt-4"
                                                    disabled={
                                                        addingSkillId ===
                                                        skill.id
                                                    }
                                                    onClick={() =>
                                                        handleAddSkill(
                                                            skill.id
                                                        )
                                                    }
                                                >

                                                    {addingSkillId ===
                                                    skill.id ? (

                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />

                                                            Adding...
                                                        </>

                                                    ) : (

                                                        <>
                                                            <i className="bi bi-plus-circle me-2" />

                                                            Add Skill
                                                        </>

                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Skills_Want;
